// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IInferenceJobRegistry} from "../contracts/interfaces/IInferenceJobRegistry.sol";
import {IProofOfInferenceVerifier} from "../contracts/interfaces/IProofOfInferenceVerifier.sol";
import {JobTypes} from "../contracts/libraries/JobTypes.sol";
import {KoinaraFixture} from "./helpers/KoinaraFixture.sol";

contract ProofOfInferenceVerifierTest is KoinaraFixture {
    function testVerifierApprovalsFinalizePoI() public {
        uint256 jobId = _createJob(JobTypes.JobType.General, 1 days, 0);
        _submitResponse(jobId, RESPONSE_HASH);
        _registerSubmission(jobId);
        _approveGeneral(jobId);

        bytes32 poiHash = verifier.finalizePoI(jobId);
        IProofOfInferenceVerifier.VerificationRecord memory record = verifier.getRecord(jobId);
        IInferenceJobRegistry.Job memory job = registry.getJob(jobId);

        assertTrue(poiHash != bytes32(0));
        assertEq(record.poiHash, poiHash);
        assertEq(record.finalized, true);
        assertEq(record.verificationPass, true);
        assertEq(uint256(job.state), uint256(JobTypes.JobState.Accepted));
    }

    function testRejectSubmissionRequiresQuorumBeforeJobRejected() public {
        uint256 jobId = _createJob(JobTypes.JobType.General, 1 days, 0);
        _submitResponse(jobId, RESPONSE_HASH);
        _registerSubmission(jobId);

        vm.prank(verifierOne);
        verifier.rejectSubmission(jobId, "mai-fail");

        IProofOfInferenceVerifier.VerificationRecord memory recordAfterFirstReject = verifier.getRecord(jobId);
        IInferenceJobRegistry.Job memory jobAfterFirstReject = registry.getJob(jobId);

        assertEq(recordAfterFirstReject.rejected, false);
        assertEq(recordAfterFirstReject.finalized, false);
        assertEq(uint256(jobAfterFirstReject.state), uint256(JobTypes.JobState.UnderVerification));

        vm.prank(verifierTwo);
        verifier.rejectSubmission(jobId, "schema-mismatch");

        IProofOfInferenceVerifier.VerificationRecord memory recordAfterSecondReject = verifier.getRecord(jobId);
        IInferenceJobRegistry.Job memory jobAfterSecondReject = registry.getJob(jobId);

        assertEq(recordAfterSecondReject.rejected, false);
        assertEq(recordAfterSecondReject.finalized, false);
        assertEq(uint256(jobAfterSecondReject.state), uint256(JobTypes.JobState.UnderVerification));

        vm.prank(verifierThree);
        verifier.rejectSubmission(jobId, "verification-fail");

        IProofOfInferenceVerifier.VerificationRecord memory record = verifier.getRecord(jobId);
        IInferenceJobRegistry.Job memory job = registry.getJob(jobId);

        assertEq(record.rejected, true);
        assertEq(record.finalized, true);
        assertEq(uint256(job.state), uint256(JobTypes.JobState.Rejected));
        assertTrue(verifier.rejectionReasonHash(jobId) != bytes32(0));
    }
}
