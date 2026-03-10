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

    function testRejectSubmissionMarksJobRejected() public {
        uint256 jobId = _createJob(JobTypes.JobType.Simple, 1 days, 0);
        _submitResponse(jobId, RESPONSE_HASH);
        _registerSubmission(jobId);

        vm.prank(verifierOne);
        verifier.rejectSubmission(jobId, "mai-fail");

        IProofOfInferenceVerifier.VerificationRecord memory record = verifier.getRecord(jobId);
        IInferenceJobRegistry.Job memory job = registry.getJob(jobId);

        assertEq(record.rejected, true);
        assertEq(record.finalized, true);
        assertEq(uint256(job.state), uint256(JobTypes.JobState.Rejected));
    }
}
