// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IInferenceJobRegistry} from "./interfaces/IInferenceJobRegistry.sol";
import {Errors} from "./libraries/Errors.sol";
import {Events} from "./libraries/Events.sol";
import {JobTypes} from "./libraries/JobTypes.sol";

contract InferenceJobRegistry is IInferenceJobRegistry, Events {
    address public admin;
    address public verifier;
    address public rewardDistributor;
    uint256 public override totalJobs;

    uint256 private _reentrancyLock = 1;

    mapping(uint256 => IInferenceJobRegistry.Job) private _jobs;
    mapping(uint256 => IInferenceJobRegistry.Submission) private _submissions;
    mapping(uint256 => bool) private _premiumReleased;

    modifier onlyAdmin() {
        if (msg.sender != admin) {
            revert Errors.Unauthorized();
        }
        _;
    }

    modifier onlyVerifier() {
        if (msg.sender != verifier) {
            revert Errors.Unauthorized();
        }
        _;
    }

    modifier onlyRewardDistributor() {
        if (msg.sender != rewardDistributor) {
            revert Errors.Unauthorized();
        }
        _;
    }

    modifier nonReentrant() {
        if (_reentrancyLock != 1) {
            revert Errors.InvalidState();
        }
        _reentrancyLock = 2;
        _;
        _reentrancyLock = 1;
    }

    constructor(address admin_) {
        if (admin_ == address(0)) {
            revert Errors.ZeroAddress();
        }

        admin = admin_;
    }

    function setVerifier(address verifier_) external onlyAdmin {
        if (verifier_ == address(0)) {
            revert Errors.ZeroAddress();
        }
        if (verifier != address(0)) {
            revert Errors.InvalidState();
        }

        verifier = verifier_;
        emit VerifierConfigured(verifier_);
    }

    function setRewardDistributor(address rewardDistributor_) external onlyAdmin {
        if (rewardDistributor_ == address(0)) {
            revert Errors.ZeroAddress();
        }
        if (rewardDistributor != address(0)) {
            revert Errors.InvalidState();
        }

        rewardDistributor = rewardDistributor_;
        emit RewardDistributorConfigured(rewardDistributor_);
    }

    function renounceAdmin() external onlyAdmin {
        emit AdminRenounced(admin);
        admin = address(0);
    }

    function createJob(
        bytes32 requestHash,
        bytes32 schemaHash,
        uint64 deadline,
        JobTypes.JobType jobType
    ) external payable override returns (uint256 jobId) {
        if (requestHash == bytes32(0) || schemaHash == bytes32(0)) {
            revert Errors.InvalidHash();
        }
        if (deadline <= block.timestamp) {
            revert Errors.InvalidDeadline();
        }

        jobId = ++totalJobs;
        _jobs[jobId] = IInferenceJobRegistry.Job({
            jobId: jobId,
            creator: msg.sender,
            requestHash: requestHash,
            schemaHash: schemaHash,
            deadline: deadline,
            jobType: jobType,
            premiumReward: msg.value,
            state: JobTypes.JobState.Created
        });

        emit JobCreated(jobId, msg.sender, requestHash, schemaHash, deadline, jobType, msg.value);
        _transition(jobId, JobTypes.JobState.Open);
    }

    function submitResponse(uint256 jobId, bytes32 responseHash) external override {
        IInferenceJobRegistry.Job storage job = _requireJob(jobId);

        if (job.state != JobTypes.JobState.Open) {
            revert Errors.InvalidState();
        }
        if (block.timestamp > job.deadline) {
            revert Errors.DeadlinePassed();
        }
        if (responseHash == bytes32(0)) {
            revert Errors.InvalidHash();
        }
        if (_submissions[jobId].exists) {
            revert Errors.SubmissionAlreadyExists();
        }

        _submissions[jobId] = IInferenceJobRegistry.Submission({
            provider: msg.sender,
            responseHash: responseHash,
            submittedAt: uint64(block.timestamp),
            exists: true
        });

        emit ResponseSubmitted(jobId, msg.sender, responseHash, uint64(block.timestamp));
        _transition(jobId, JobTypes.JobState.Submitted);
    }

    function moveToVerification(uint256 jobId) external override onlyVerifier {
        IInferenceJobRegistry.Job storage job = _requireJob(jobId);
        if (job.state != JobTypes.JobState.Submitted || !_submissions[jobId].exists) {
            revert Errors.InvalidState();
        }

        _transition(jobId, JobTypes.JobState.UnderVerification);
    }

    function markAccepted(uint256 jobId) external override onlyVerifier {
        IInferenceJobRegistry.Job storage job = _requireJob(jobId);
        if (job.state != JobTypes.JobState.UnderVerification) {
            revert Errors.InvalidState();
        }

        _transition(jobId, JobTypes.JobState.Accepted);
    }

    function markRejected(uint256 jobId) external override onlyVerifier {
        IInferenceJobRegistry.Job storage job = _requireJob(jobId);
        if (job.state != JobTypes.JobState.UnderVerification) {
            revert Errors.InvalidState();
        }

        _transition(jobId, JobTypes.JobState.Rejected);
    }

    function markExpired(uint256 jobId) external override {
        IInferenceJobRegistry.Job storage job = _requireJob(jobId);
        if (job.state != JobTypes.JobState.Open) {
            revert Errors.InvalidState();
        }
        if (block.timestamp <= job.deadline) {
            revert Errors.DeadlineNotReached();
        }

        _transition(jobId, JobTypes.JobState.Expired);
    }

    function settleJob(uint256 jobId) external override onlyRewardDistributor {
        IInferenceJobRegistry.Job storage job = _requireJob(jobId);
        if (job.state != JobTypes.JobState.Accepted) {
            revert Errors.InvalidState();
        }

        _transition(jobId, JobTypes.JobState.Settled);
    }

    function releasePremiumToProvider(
        uint256 jobId,
        address provider
    ) external override onlyRewardDistributor nonReentrant returns (uint256 amount) {
        IInferenceJobRegistry.Job storage job = _requireJob(jobId);
        if (provider == address(0)) {
            revert Errors.ZeroAddress();
        }
        if (job.state != JobTypes.JobState.Accepted) {
            revert Errors.InvalidState();
        }
        if (_premiumReleased[jobId]) {
            revert Errors.PremiumAlreadyReleased();
        }

        _premiumReleased[jobId] = true;
        amount = job.premiumReward;
        _transferNative(provider, amount);

        emit PremiumReleased(jobId, provider, amount);
    }

    function claimPremiumRefund(uint256 jobId) external override nonReentrant returns (uint256 amount) {
        IInferenceJobRegistry.Job storage job = _requireJob(jobId);
        if (msg.sender != job.creator) {
            revert Errors.Unauthorized();
        }
        if (job.state != JobTypes.JobState.Rejected && job.state != JobTypes.JobState.Expired) {
            revert Errors.InvalidState();
        }
        if (_premiumReleased[jobId]) {
            revert Errors.PremiumAlreadyReleased();
        }

        _premiumReleased[jobId] = true;
        amount = job.premiumReward;
        _transferNative(job.creator, amount);

        emit PremiumRefunded(jobId, job.creator, amount);
    }

    function getJob(uint256 jobId) external view override returns (IInferenceJobRegistry.Job memory) {
        return _jobs[jobId];
    }

    function getSubmission(
        uint256 jobId
    ) external view override returns (IInferenceJobRegistry.Submission memory) {
        return _submissions[jobId];
    }

    function _requireJob(uint256 jobId) internal view returns (IInferenceJobRegistry.Job storage job) {
        job = _jobs[jobId];
        if (job.creator == address(0)) {
            revert Errors.InvalidJob();
        }
    }

    function _transition(uint256 jobId, JobTypes.JobState newState) internal {
        JobTypes.JobState previousState = _jobs[jobId].state;
        _jobs[jobId].state = newState;
        emit JobStateTransition(jobId, previousState, newState);
    }

    function _transferNative(address to, uint256 amount) internal {
        if (amount == 0) {
            return;
        }

        (bool success, ) = to.call{value: amount}("");
        if (!success) {
            revert Errors.TransferFailed();
        }
    }
}
