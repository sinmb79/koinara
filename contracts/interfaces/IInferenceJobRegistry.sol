// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {JobTypes} from "../libraries/JobTypes.sol";

interface IInferenceJobRegistry {
    struct Job {
        uint256 jobId;
        address creator;
        bytes32 requestHash;
        bytes32 schemaHash;
        uint64 deadline;
        JobTypes.JobType jobType;
        uint256 premiumReward;
        JobTypes.JobState state;
    }

    struct Submission {
        address provider;
        bytes32 responseHash;
        uint64 submittedAt;
        bool exists;
    }

    function totalJobs() external view returns (uint256);
    function createJob(
        bytes32 requestHash,
        bytes32 schemaHash,
        uint64 deadline,
        JobTypes.JobType jobType
    ) external payable returns (uint256);
    function submitResponse(uint256 jobId, bytes32 responseHash) external;
    function moveToVerification(uint256 jobId) external;
    function markAccepted(uint256 jobId) external;
    function markRejected(uint256 jobId) external;
    function markExpired(uint256 jobId) external;
    function settleJob(uint256 jobId) external;
    function releasePremiumToProvider(uint256 jobId, address provider) external returns (uint256);
    function claimPremiumRefund(uint256 jobId) external returns (uint256);
    function getJob(uint256 jobId) external view returns (Job memory);
    function getSubmission(uint256 jobId) external view returns (Submission memory);
}
