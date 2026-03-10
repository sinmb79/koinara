// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IInferenceJobRegistry} from "../contracts/interfaces/IInferenceJobRegistry.sol";
import {Errors} from "../contracts/libraries/Errors.sol";
import {JobTypes} from "../contracts/libraries/JobTypes.sol";
import {KoinaraFixture} from "./helpers/KoinaraFixture.sol";

contract InferenceJobRegistryTest is KoinaraFixture {
    function testCreateJobStoresOpenState() public {
        uint256 jobId = _createJob(JobTypes.JobType.Simple, 1 days, 1 ether);
        IInferenceJobRegistry.Job memory job = registry.getJob(jobId);

        assertEq(job.jobId, jobId);
        assertEq(job.creator, creator);
        assertEq(job.requestHash, REQUEST_HASH);
        assertEq(job.schemaHash, SCHEMA_HASH);
        assertEq(uint256(job.jobType), uint256(JobTypes.JobType.Simple));
        assertEq(job.premiumReward, 1 ether);
        assertEq(uint256(job.state), uint256(JobTypes.JobState.Open));
    }

    function testSubmitResponseStoresSubmission() public {
        uint256 jobId = _createJob(JobTypes.JobType.Simple, 1 days, 0);
        _submitResponse(jobId, RESPONSE_HASH);

        IInferenceJobRegistry.Submission memory submission = registry.getSubmission(jobId);
        IInferenceJobRegistry.Job memory job = registry.getJob(jobId);

        assertEq(submission.provider, provider);
        assertEq(submission.responseHash, RESPONSE_HASH);
        assertEq(submission.exists, true);
        assertEq(uint256(job.state), uint256(JobTypes.JobState.Submitted));
    }

    function testSubmitResponseAfterDeadlineReverts() public {
        uint256 jobId = _createJob(JobTypes.JobType.Simple, 1 days, 0);

        vm.warp(block.timestamp + 1 days + 1);
        vm.prank(provider);
        vm.expectRevert(abi.encodeWithSelector(Errors.DeadlinePassed.selector));
        registry.submitResponse(jobId, RESPONSE_HASH);
    }
}
