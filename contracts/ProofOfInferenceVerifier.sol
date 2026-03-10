// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IInferenceJobRegistry} from "./interfaces/IInferenceJobRegistry.sol";
import {IProofOfInferenceVerifier} from "./interfaces/IProofOfInferenceVerifier.sol";
import {Errors} from "./libraries/Errors.sol";
import {Events} from "./libraries/Events.sol";
import {JobTypes} from "./libraries/JobTypes.sol";

contract ProofOfInferenceVerifier is IProofOfInferenceVerifier, Events {
    using JobTypes for JobTypes.JobType;

    IInferenceJobRegistry public immutable registry;

    mapping(uint256 => IProofOfInferenceVerifier.VerificationRecord) private _records;
    mapping(uint256 => mapping(address => bool)) private _hasParticipated;
    mapping(uint256 => address[]) private _approvedVerifiers;
    mapping(uint256 => uint256) private _rejectionCounts;
    mapping(uint256 => bytes32) public rejectionReasonHash;

    constructor(address registry_) {
        if (registry_ == address(0)) {
            revert Errors.ZeroAddress();
        }

        registry = IInferenceJobRegistry(registry_);
    }

    function registerSubmission(uint256 jobId) external override {
        IProofOfInferenceVerifier.VerificationRecord storage existingRecord = _records[jobId];
        if (existingRecord.validJob) {
            revert Errors.AlreadyRegistered();
        }

        IInferenceJobRegistry.Job memory job = registry.getJob(jobId);
        if (job.creator == address(0)) {
            revert Errors.InvalidJob();
        }
        if (job.state != JobTypes.JobState.Submitted) {
            revert Errors.InvalidState();
        }

        IInferenceJobRegistry.Submission memory submission = registry.getSubmission(jobId);
        if (!submission.exists) {
            revert Errors.SubmissionNotFound();
        }

        _records[jobId] = IProofOfInferenceVerifier.VerificationRecord({
            provider: submission.provider,
            responseHash: submission.responseHash,
            submittedAt: submission.submittedAt,
            approvals: 0,
            quorum: job.jobType.verifierQuorum(),
            validJob: true,
            withinDeadline: submission.submittedAt <= job.deadline,
            formatPass: job.schemaHash != bytes32(0),
            nonEmptyResponse: submission.responseHash != bytes32(0),
            verificationPass: false,
            rejected: false,
            finalized: false,
            poiHash: bytes32(0)
        });

        registry.moveToVerification(jobId);
        emit SubmissionRegistered(jobId, submission.provider, submission.responseHash, job.jobType.verifierQuorum());
    }

    function verifySubmission(uint256 jobId) external override {
        IProofOfInferenceVerifier.VerificationRecord storage record = _requireActiveRecord(jobId);
        if (msg.sender == record.provider) {
            revert Errors.SelfVerification();
        }
        if (_hasParticipated[jobId][msg.sender]) {
            revert Errors.DuplicateVerification();
        }

        _hasParticipated[jobId][msg.sender] = true;
        _approvedVerifiers[jobId].push(msg.sender);
        record.approvals += 1;

        if (record.approvals >= record.quorum) {
            record.verificationPass = true;
        }

        emit SubmissionVerified(jobId, msg.sender, record.approvals, record.quorum);
    }

    function rejectSubmission(uint256 jobId, string calldata reason) external override {
        IProofOfInferenceVerifier.VerificationRecord storage record = _requireActiveRecord(jobId);
        if (msg.sender == record.provider) {
            revert Errors.SelfVerification();
        }
        if (_hasParticipated[jobId][msg.sender]) {
            revert Errors.DuplicateVerification();
        }

        _hasParticipated[jobId][msg.sender] = true;
        uint256 rejectionCount = _rejectionCounts[jobId] + 1;
        _rejectionCounts[jobId] = rejectionCount;
        rejectionReasonHash[jobId] =
            keccak256(abi.encodePacked(rejectionReasonHash[jobId], msg.sender, keccak256(bytes(reason))));

        if (rejectionCount >= record.quorum) {
            record.rejected = true;
            record.finalized = true;
            record.verificationPass = false;

            registry.markRejected(jobId);
        }
        emit SubmissionRejected(jobId, msg.sender, reason);
    }

    function finalizePoI(uint256 jobId) external override returns (bytes32 poiHash) {
        IProofOfInferenceVerifier.VerificationRecord storage record = _records[jobId];
        if (!record.validJob) {
            revert Errors.InvalidJob();
        }
        if (record.finalized) {
            revert Errors.AlreadyFinalized();
        }
        if (record.rejected) {
            revert Errors.SubmissionRejected();
        }
        if (!record.withinDeadline) {
            revert Errors.DeadlinePassed();
        }
        if (!record.formatPass || !record.nonEmptyResponse) {
            revert Errors.InvalidHash();
        }
        if (record.approvals < record.quorum) {
            revert Errors.QuorumNotReached();
        }

        record.verificationPass = true;
        record.finalized = true;
        poiHash = keccak256(
            abi.encodePacked(
                "KOINARA_POI_V1",
                block.chainid,
                jobId,
                record.provider,
                record.responseHash,
                record.submittedAt,
                record.approvals
            )
        );
        record.poiHash = poiHash;

        registry.markAccepted(jobId);
        emit PoIFinalized(jobId, poiHash, record.provider, record.approvals);
    }

    function getRecord(uint256 jobId)
        external
        view
        override
        returns (IProofOfInferenceVerifier.VerificationRecord memory)
    {
        return _records[jobId];
    }

    function getApprovedVerifiers(uint256 jobId) external view override returns (address[] memory) {
        return _approvedVerifiers[jobId];
    }

    function hasParticipated(uint256 jobId, address verifier) external view override returns (bool) {
        return _hasParticipated[jobId][verifier];
    }

    function _requireActiveRecord(uint256 jobId)
        internal
        view
        returns (IProofOfInferenceVerifier.VerificationRecord storage record)
    {
        record = _records[jobId];
        if (!record.validJob) {
            revert Errors.SubmissionNotFound();
        }
        if (record.finalized) {
            revert Errors.AlreadyFinalized();
        }
        if (record.rejected) {
            revert Errors.SubmissionRejected();
        }
    }
}
