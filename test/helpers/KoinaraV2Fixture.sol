// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {InferenceJobRegistry} from "../../contracts/InferenceJobRegistry.sol";
import {KOINToken} from "../../contracts/KOINToken.sol";
import {NodeRegistryV2} from "../../contracts/NodeRegistryV2.sol";
import {ProofOfInferenceVerifier} from "../../contracts/ProofOfInferenceVerifier.sol";
import {RewardDistributorV2} from "../../contracts/RewardDistributorV2.sol";
import {INodeRegistryV2} from "../../contracts/interfaces/INodeRegistryV2.sol";
import {JobTypes} from "../../contracts/libraries/JobTypes.sol";
import {TestBase} from "./TestBase.sol";

abstract contract KoinaraV2Fixture is TestBase {
    KOINToken internal token;
    NodeRegistryV2 internal nodeRegistry;
    InferenceJobRegistry internal registry;
    ProofOfInferenceVerifier internal verifier;
    RewardDistributorV2 internal distributor;

    address internal admin = address(0xA11CE);
    address internal creator = address(0xB0B);
    address internal provider = address(0xCAFE);
    address internal verifierOne = address(0x1001);
    address internal verifierTwo = address(0x1002);
    address internal verifierThree = address(0x1003);
    address internal verifierFour = address(0x1004);
    address internal verifierFive = address(0x1005);

    bytes32 internal constant REQUEST_HASH = keccak256("REQUEST_HASH");
    bytes32 internal constant SCHEMA_HASH = keccak256("SCHEMA_HASH");
    bytes32 internal constant RESPONSE_HASH = keccak256("RESPONSE_HASH");
    bytes32 internal constant NODE_METADATA_HASH = keccak256("NODE_METADATA_HASH");

    uint256 internal constant INITIAL_EPOCH_EMISSION = 1_000 ether;
    uint256 internal constant EPOCH_DURATION = 1 days;
    uint256 internal constant HALVING_INTERVAL = 365;
    uint256 internal constant START_TIMESTAMP = 1_700_000_000;
    uint256 internal constant ACTIVE_POOL_BPS = 2_000;

    function setUp() public virtual {
        vm.warp(START_TIMESTAMP);
        vm.deal(creator, 100 ether);
        vm.deal(provider, 100 ether);

        vm.startPrank(admin);
        registry = new InferenceJobRegistry(admin);
        verifier = new ProofOfInferenceVerifier(address(registry));
        token = new KOINToken(admin);
        nodeRegistry = new NodeRegistryV2(admin, block.timestamp, EPOCH_DURATION);
        distributor = new RewardDistributorV2(
            address(token),
            address(registry),
            address(verifier),
            address(nodeRegistry),
            block.timestamp,
            EPOCH_DURATION,
            HALVING_INTERVAL,
            INITIAL_EPOCH_EMISSION,
            ACTIVE_POOL_BPS
        );

        registry.setVerifier(address(verifier));
        registry.setRewardDistributor(address(distributor));
        token.setMinter(address(distributor));
        nodeRegistry.setRewardDistributor(address(distributor));
        registry.renounceAdmin();
        token.renounceAdmin();
        nodeRegistry.renounceAdmin();
        vm.stopPrank();
    }

    function _registerActiveProvider() internal {
        vm.prank(provider);
        nodeRegistry.registerNode(INodeRegistryV2.NodeRole.Provider, NODE_METADATA_HASH);
    }

    function _registerActiveVerifier(address verifierAddr) internal {
        vm.prank(verifierAddr);
        nodeRegistry.registerNode(INodeRegistryV2.NodeRole.Verifier, NODE_METADATA_HASH);
    }

    function _createJob(JobTypes.JobType jobType, uint64 deadlineOffset, uint256 premiumReward)
        internal
        returns (uint256 jobId)
    {
        vm.prank(creator);
        jobId = registry.createJob{value: premiumReward}(
            REQUEST_HASH, SCHEMA_HASH, uint64(block.timestamp + deadlineOffset), jobType
        );
    }

    function _submitResponse(uint256 jobId, bytes32 responseHash) internal {
        vm.prank(provider);
        registry.submitResponse(jobId, responseHash);
    }

    function _registerSubmission(uint256 jobId) internal {
        verifier.registerSubmission(jobId);
    }

    function _approveSimple(uint256 jobId) internal {
        vm.prank(verifierOne);
        verifier.verifySubmission(jobId);
    }

    function _approveGeneral(uint256 jobId) internal {
        vm.prank(verifierOne);
        verifier.verifySubmission(jobId);
        vm.prank(verifierTwo);
        verifier.verifySubmission(jobId);
        vm.prank(verifierThree);
        verifier.verifySubmission(jobId);
    }
}
