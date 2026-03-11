// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {NodeRegistryV2} from "../contracts/NodeRegistryV2.sol";
import {INodeRegistryV2} from "../contracts/interfaces/INodeRegistryV2.sol";
import {KoinaraV2Fixture} from "./helpers/KoinaraV2Fixture.sol";

contract NodeRegistryV2Test is KoinaraV2Fixture {
    function testRegisterMarksNodeActiveForCurrentEpoch() public {
        vm.prank(provider);
        nodeRegistry.registerNode(INodeRegistryV2.NodeRole.Provider, NODE_METADATA_HASH);

        INodeRegistryV2.NodeInfo memory info = nodeRegistry.getNode(provider);
        assertTrue(info.active);
        assertEq(uint256(info.lastHeartbeatEpoch), 0);
        assertEq(nodeRegistry.activeNodeCount(0), 1);
        assertTrue(nodeRegistry.isNodeActiveAt(provider, 0));
    }

    function testHeartbeatOnlyCountsOncePerEpoch() public {
        _registerActiveProvider();

        vm.prank(provider);
        nodeRegistry.heartbeat();
        assertEq(nodeRegistry.activeNodeCount(0), 1);

        vm.warp(block.timestamp + EPOCH_DURATION + 1);
        vm.prank(provider);
        nodeRegistry.heartbeat();

        assertEq(nodeRegistry.activeNodeCount(1), 1);
        assertTrue(nodeRegistry.isNodeActiveAt(provider, 1));
    }

    function testPastEpochActivityRemainsClaimableAfterLaterHeartbeat() public {
        _registerActiveProvider();

        vm.warp(block.timestamp + EPOCH_DURATION + 1);
        vm.prank(provider);
        nodeRegistry.heartbeat();

        assertTrue(nodeRegistry.isNodeActiveAt(provider, 0));
        assertTrue(nodeRegistry.isNodeActiveAt(provider, 1));
    }
}
