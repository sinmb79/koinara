// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface INodeRegistryV2 {
    enum NodeRole {
        Provider,
        Verifier,
        Both
    }

    struct NodeInfo {
        NodeRole role;
        bytes32 metadataHash;
        uint64 registeredAt;
        uint64 lastHeartbeatEpoch;
        bool active;
    }

    function genesisTimestamp() external view returns (uint256);
    function epochDuration() external view returns (uint256);
    function rewardDistributor() external view returns (address);
    function currentEpoch() external view returns (uint256);
    function activeNodeCount(uint256 epoch) external view returns (uint256);
    function registerNode(NodeRole role, bytes32 metadataHash) external;
    function setNodeMetadata(bytes32 metadataHash) external;
    function heartbeat() external returns (uint256 epoch);
    function deactivateNode() external;
    function getNode(address node) external view returns (NodeInfo memory);
    function isNodeActiveAt(address node, uint256 epoch) external view returns (bool);
}
