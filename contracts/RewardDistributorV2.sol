// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IInferenceJobRegistry} from "./interfaces/IInferenceJobRegistry.sol";
import {IKOINToken} from "./interfaces/IKOINToken.sol";
import {INodeRegistryV2} from "./interfaces/INodeRegistryV2.sol";
import {IProofOfInferenceVerifier} from "./interfaces/IProofOfInferenceVerifier.sol";
import {IRewardDistributorV2} from "./interfaces/IRewardDistributorV2.sol";
import {Errors} from "./libraries/Errors.sol";
import {JobTypes} from "./libraries/JobTypes.sol";

contract RewardDistributorV2 is IRewardDistributorV2 {
    using JobTypes for JobTypes.JobType;

    struct RecordedJob {
        address provider;
        uint64 epoch;
        uint32 weight;
        uint32 verifierCount;
        bool exists;
        bool providerClaimed;
    }

    IKOINToken public immutable token;
    IInferenceJobRegistry public immutable registry;
    IProofOfInferenceVerifier public immutable verifier;
    INodeRegistryV2 public immutable nodeRegistry;

    uint256 public immutable genesisTimestamp;
    uint256 public immutable epochDuration;
    uint256 public immutable halvingInterval;
    uint256 public immutable initialEpochEmission;
    uint256 public immutable activePoolBps;

    uint256 private _reentrancyLock = 1;

    mapping(uint256 => RecordedJob) private _recordedJobs;
    mapping(uint256 => mapping(address => bool)) private _approvedVerifierAtRecord;
    mapping(uint256 => uint256) public override epochAcceptedWeight;
    mapping(uint256 => mapping(address => bool)) public activeRewardClaimed;
    mapping(uint256 => mapping(address => bool)) public verifierRewardClaimed;

    event AcceptedJobRecorded(
        uint256 indexed jobId,
        uint256 indexed epoch,
        address indexed provider,
        uint256 weight,
        uint256 verifierCount,
        uint256 premiumReward
    );
    event ActiveRewardClaimed(uint256 indexed epoch, address indexed node, uint256 amount);
    event WorkRewardClaimed(uint256 indexed jobId, address indexed claimant, uint256 amount, bool providerReward);

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
        address nodeRegistry_,
        uint256 genesisTimestamp_,
        uint256 epochDuration_,
        uint256 halvingInterval_,
        uint256 initialEpochEmission_,
        uint256 activePoolBps_
    ) {
        if (
            token_ == address(0) || registry_ == address(0) || verifier_ == address(0)
                || nodeRegistry_ == address(0)
        ) {
            revert Errors.ZeroAddress();
        }
        if (epochDuration_ == 0 || halvingInterval_ == 0 || initialEpochEmission_ == 0) {
            revert Errors.InvalidConfiguration();
        }
        if (activePoolBps_ > 10_000) {
            revert Errors.InvalidConfiguration();
        }

        token = IKOINToken(token_);
        registry = IInferenceJobRegistry(registry_);
        verifier = IProofOfInferenceVerifier(verifier_);
        nodeRegistry = INodeRegistryV2(nodeRegistry_);
        genesisTimestamp = genesisTimestamp_;
        epochDuration = epochDuration_;
        halvingInterval = halvingInterval_;
        initialEpochEmission = initialEpochEmission_;
        activePoolBps = activePoolBps_;
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

    function activeEpochEmission(uint256 epoch) public view override returns (uint256) {
        return (epochEmission(epoch) * activePoolBps) / 10_000;
    }

    function workEpochEmission(uint256 epoch) public view override returns (uint256) {
        return epochEmission(epoch) - activeEpochEmission(epoch);
    }

    function recordAcceptedJob(uint256 jobId, address provider) external override nonReentrant {
        if (_recordedJobs[jobId].exists) {
            revert Errors.InvalidState();
        }

        IProofOfInferenceVerifier.VerificationRecord memory record = verifier.getRecord(jobId);
        if (!record.finalized || record.rejected || record.poiHash == bytes32(0)) {
            revert Errors.InvalidState();
        }
        if (provider == address(0) || provider != record.provider) {
            revert Errors.InvalidVerifierSet();
        }

        IInferenceJobRegistry.Job memory job = registry.getJob(jobId);
        if (job.creator == address(0) || job.state != JobTypes.JobState.Accepted) {
            revert Errors.InvalidState();
        }

        uint256 epoch = _epochAt(record.submittedAt);
        uint256 weight = job.jobType.weight();
        address[] memory approvedVerifiers = verifier.getApprovedVerifiers(jobId);
        uint256 verifierCount = approvedVerifiers.length;
        if (verifierCount > type(uint32).max) {
            revert Errors.InvalidConfiguration();
        }

        for (uint256 i = 0; i < verifierCount; ++i) {
            _approvedVerifierAtRecord[jobId][approvedVerifiers[i]] = true;
        }

        _recordedJobs[jobId] = RecordedJob({
            provider: provider,
            epoch: uint64(epoch),
            weight: uint32(weight),
            verifierCount: uint32(verifierCount),
            exists: true,
            providerClaimed: false
        });
        epochAcceptedWeight[epoch] += weight;

        uint256 premiumReward = registry.releasePremiumToProvider(jobId, provider);
        registry.settleJob(jobId);

        emit AcceptedJobRecorded(jobId, epoch, provider, weight, verifierCount, premiumReward);
    }

    function calculateJobReward(uint256 jobId) public view override returns (uint256) {
        RecordedJob memory job = _requireRecordedJob(jobId);
        uint256 totalWeight = epochAcceptedWeight[job.epoch];
        if (totalWeight == 0) {
            return 0;
        }

        return (workEpochEmission(job.epoch) * job.weight) / totalWeight;
    }

    function getRewardBreakdown(uint256 jobId)
        public
        view
        override
        returns (uint256 totalReward, uint256 providerReward, uint256 verifierRewardTotal)
    {
        RecordedJob memory job = _requireRecordedJob(jobId);

        totalReward = calculateJobReward(jobId);
        providerReward = (totalReward * 70) / 100;
        verifierRewardTotal = totalReward - providerReward;

        uint256 verifierCount = job.verifierCount;
        if (verifierCount == 0) {
            providerReward = totalReward;
            verifierRewardTotal = 0;
            return (totalReward, providerReward, verifierRewardTotal);
        }

        uint256 perVerifierReward = verifierRewardTotal / verifierCount;
        uint256 verifierDust = verifierRewardTotal - (perVerifierReward * verifierCount);
        providerReward += verifierDust;
        verifierRewardTotal -= verifierDust;
        if (job.provider == address(0)) {
            providerReward = 0;
        }
    }

    function claimProviderWorkReward(uint256 jobId) external override nonReentrant {
        RecordedJob storage job = _recordedJobs[jobId];
        if (!job.exists) {
            revert Errors.InvalidJob();
        }
        if (msg.sender != job.provider) {
            revert Errors.Unauthorized();
        }
        if (job.providerClaimed) {
            revert Errors.RewardsAlreadyDistributed();
        }
        _requireEpochClosed(job.epoch);

        (, uint256 providerReward,) = getRewardBreakdown(jobId);

        job.providerClaimed = true;
        if (providerReward > 0) {
            token.mint(msg.sender, providerReward);
        }

        emit WorkRewardClaimed(jobId, msg.sender, providerReward, true);
    }

    function claimVerifierWorkReward(uint256 jobId) external override nonReentrant {
        RecordedJob memory job = _requireRecordedJob(jobId);
        _requireEpochClosed(job.epoch);

        if (verifierRewardClaimed[jobId][msg.sender]) {
            revert Errors.RewardsAlreadyDistributed();
        }
        if (!_approvedVerifierAtRecord[jobId][msg.sender]) {
            revert Errors.Unauthorized();
        }

        uint256 verifierCount = job.verifierCount;
        (, , uint256 verifierRewardTotal) = getRewardBreakdown(jobId);
        uint256 perVerifierReward = verifierCount == 0 ? 0 : verifierRewardTotal / verifierCount;

        verifierRewardClaimed[jobId][msg.sender] = true;
        if (perVerifierReward > 0) {
            token.mint(msg.sender, perVerifierReward);
        }

        emit WorkRewardClaimed(jobId, msg.sender, perVerifierReward, false);
    }

    function claimActiveReward(uint256 epoch) external override nonReentrant {
        _requireEpochClosed(epoch);
        if (activeRewardClaimed[epoch][msg.sender]) {
            revert Errors.RewardsAlreadyDistributed();
        }
        if (!nodeRegistry.isNodeActiveAt(msg.sender, epoch)) {
            revert Errors.InvalidState();
        }

        uint256 nodeCount = nodeRegistry.activeNodeCount(epoch);
        if (nodeCount == 0) {
            revert Errors.InvalidState();
        }

        activeRewardClaimed[epoch][msg.sender] = true;

        uint256 reward = activeEpochEmission(epoch) / nodeCount;
        if (reward > 0) {
            token.mint(msg.sender, reward);
        }

        emit ActiveRewardClaimed(epoch, msg.sender, reward);
    }

    function getRecordedJob(uint256 jobId) external view returns (RecordedJob memory) {
        return _requireRecordedJob(jobId);
    }

    function _requireRecordedJob(uint256 jobId) internal view returns (RecordedJob memory recordedJob) {
        recordedJob = _recordedJobs[jobId];
        if (!recordedJob.exists) {
            revert Errors.InvalidJob();
        }
    }

    function _requireEpochClosed(uint256 epoch) internal view {
        if (epoch >= currentEpoch()) {
            revert Errors.InvalidState();
        }
    }

    function _epochAt(uint256 timestamp) internal view returns (uint256) {
        if (timestamp <= genesisTimestamp) {
            return 0;
        }

        return (timestamp - genesisTimestamp) / epochDuration;
    }
}
