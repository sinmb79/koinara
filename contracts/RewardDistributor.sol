// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IInferenceJobRegistry} from "./interfaces/IInferenceJobRegistry.sol";
import {IKOINToken} from "./interfaces/IKOINToken.sol";
import {IProofOfInferenceVerifier} from "./interfaces/IProofOfInferenceVerifier.sol";
import {IRewardDistributor} from "./interfaces/IRewardDistributor.sol";
import {Errors} from "./libraries/Errors.sol";
import {Events} from "./libraries/Events.sol";
import {JobTypes} from "./libraries/JobTypes.sol";

contract RewardDistributor is IRewardDistributor, Events {
    using JobTypes for JobTypes.JobType;

    IKOINToken public immutable token;
    IInferenceJobRegistry public immutable registry;
    IProofOfInferenceVerifier public immutable verifier;

    uint256 public immutable genesisTimestamp;
    uint256 public immutable epochDuration;
    uint256 public immutable halvingInterval;
    uint256 public immutable initialEpochEmission;

    uint256 private _reentrancyLock = 1;

    mapping(uint256 => bool) public rewardsDistributed;

    modifier nonReentrant() {
        if (_reentrancyLock != 1) {
            revert Errors.InvalidState();
        }
        _reentrancyLock = 2;
        _;
        _reentrancyLock = 1;
    }

    constructor(
        address token_,
        address registry_,
        address verifier_,
        uint256 genesisTimestamp_,
        uint256 epochDuration_,
        uint256 halvingInterval_,
        uint256 initialEpochEmission_
    ) {
        if (token_ == address(0) || registry_ == address(0) || verifier_ == address(0)) {
            revert Errors.ZeroAddress();
        }
        if (epochDuration_ == 0 || halvingInterval_ == 0 || initialEpochEmission_ == 0) {
            revert Errors.InvalidConfiguration();
        }

        token = IKOINToken(token_);
        registry = IInferenceJobRegistry(registry_);
        verifier = IProofOfInferenceVerifier(verifier_);
        genesisTimestamp = genesisTimestamp_;
        epochDuration = epochDuration_;
        halvingInterval = halvingInterval_;
        initialEpochEmission = initialEpochEmission_;
    }

    function currentEpoch() public view override returns (uint256) {
        return _epochAt(block.timestamp);
    }

    function epochEmission(uint256 epoch) public view override returns (uint256) {
        uint256 halvings = epoch / halvingInterval;
        if (halvings >= 256) {
            return 0;
        }

        return initialEpochEmission >> halvings;
    }

    function calculateJobReward(uint256 jobId) public view override returns (uint256) {
        IInferenceJobRegistry.Job memory job = registry.getJob(jobId);
        if (job.creator == address(0)) {
            revert Errors.InvalidJob();
        }

        IInferenceJobRegistry.Submission memory submission = registry.getSubmission(jobId);
        if (!submission.exists) {
            revert Errors.SubmissionNotFound();
        }

        uint256 submissionEpoch = _epochAt(submission.submittedAt);
        return epochEmission(submissionEpoch) * job.jobType.weight();
    }

    function getRewardBreakdown(uint256 jobId)
        public
        view
        override
        returns (uint256 totalReward, uint256 providerReward, uint256 verifierRewardTotal)
    {
        totalReward = calculateJobReward(jobId);
        providerReward = (totalReward * 70) / 100;
        verifierRewardTotal = totalReward - providerReward;
    }

    function distributeRewards(uint256 jobId, address provider) external override nonReentrant {
        if (rewardsDistributed[jobId]) {
            revert Errors.RewardsAlreadyDistributed();
        }

        IProofOfInferenceVerifier.VerificationRecord memory record = verifier.getRecord(jobId);
        if (!record.finalized || record.rejected || record.poiHash == bytes32(0)) {
            revert Errors.InvalidState();
        }
        if (provider == address(0)) {
            revert Errors.ZeroAddress();
        }
        if (provider != record.provider) {
            revert Errors.InvalidVerifierSet();
        }

        address[] memory approvedVerifiers = verifier.getApprovedVerifiers(jobId);

        (, uint256 providerReward, uint256 verifierRewardTotal) = getRewardBreakdown(jobId);

        uint256 verifierCount = approvedVerifiers.length;
        uint256 perVerifierReward = verifierCount == 0 ? 0 : verifierRewardTotal / verifierCount;
        uint256 verifierDust = verifierRewardTotal - (perVerifierReward * verifierCount);
        providerReward += verifierDust;

        rewardsDistributed[jobId] = true;

        uint256 premiumReward = registry.releasePremiumToProvider(jobId, provider);

        if (providerReward > 0) {
            token.mint(provider, providerReward);
        }

        uint256 distributedVerifierReward;
        if (perVerifierReward > 0) {
            for (uint256 i = 0; i < verifierCount; ++i) {
                token.mint(approvedVerifiers[i], perVerifierReward);
                distributedVerifierReward += perVerifierReward;
            }
        }

        registry.settleJob(jobId);
        emit RewardsDistributed(jobId, provider, providerReward, distributedVerifierReward, premiumReward);
    }

    function _epochAt(uint256 timestamp) internal view returns (uint256) {
        if (timestamp <= genesisTimestamp) {
            return 0;
        }

        return (timestamp - genesisTimestamp) / epochDuration;
    }
}
