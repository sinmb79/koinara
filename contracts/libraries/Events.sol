// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {JobTypes} from "./JobTypes.sol";

abstract contract Events {
    event JobCreated(
        uint256 indexed jobId,
        address indexed creator,
        bytes32 indexed requestHash,
        bytes32 schemaHash,
        uint64 deadline,
        JobTypes.JobType jobType,
        uint256 premiumReward
    );

    event JobStateTransition(
        uint256 indexed jobId,
        JobTypes.JobState previousState,
        JobTypes.JobState newState
    );

    event ResponseSubmitted(
        uint256 indexed jobId,
        address indexed provider,
        bytes32 responseHash,
        uint64 submittedAt
    );

    event SubmissionRegistered(
        uint256 indexed jobId,
        address indexed provider,
        bytes32 responseHash,
        uint256 quorum
    );

    event SubmissionVerified(
        uint256 indexed jobId,
        address indexed verifier,
        uint256 approvals,
        uint256 quorum
    );

    event SubmissionRejected(
        uint256 indexed jobId,
        address indexed verifier,
        string reason
    );

    event PoIFinalized(
        uint256 indexed jobId,
        bytes32 indexed poiHash,
        address indexed provider,
        uint256 approvals
    );

    event RewardsDistributed(
        uint256 indexed jobId,
        address indexed provider,
        uint256 providerReward,
        uint256 verifierRewardTotal,
        uint256 premiumReward
    );

    event PremiumReleased(uint256 indexed jobId, address indexed provider, uint256 amount);
    event PremiumRefunded(uint256 indexed jobId, address indexed creator, uint256 amount);
    event MinterSet(address indexed minter);
    event VerifierConfigured(address indexed verifier);
    event RewardDistributorConfigured(address indexed distributor);
    event AdminRenounced(address indexed admin);
}
