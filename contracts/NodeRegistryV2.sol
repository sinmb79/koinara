// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Errors} from "./libraries/Errors.sol";
import {INodeRegistryV2} from "./interfaces/INodeRegistryV2.sol";

contract NodeRegistryV2 is INodeRegistryV2 {
    address public admin;
    address public override rewardDistributor;
    uint256 public immutable override genesisTimestamp;
    uint256 public immutable override epochDuration;

    mapping(address => NodeInfo) private _nodes;
    mapping(uint256 => mapping(address => bool)) private _activeAtEpoch;
    mapping(uint256 => uint256) public override activeNodeCount;

    event NodeRegistered(address indexed node, NodeRole indexed role, bytes32 metadataHash, uint256 epoch);
    event NodeMetadataUpdated(address indexed node, bytes32 metadataHash);
    event NodeHeartbeated(address indexed node, uint256 indexed epoch);
    event NodeDeactivated(address indexed node);
    event RewardDistributorConfigured(address indexed rewardDistributor);
    event AdminRenounced(address indexed admin);

    modifier onlyAdmin() {
        if (msg.sender != admin) {
            revert Errors.Unauthorized();
        }
        _;
    }

    constructor(address admin_, uint256 genesisTimestamp_, uint256 epochDuration_) {
        if (admin_ == address(0)) {
            revert Errors.ZeroAddress();
        }
        if (epochDuration_ == 0) {
            revert Errors.InvalidConfiguration();
        }

        admin = admin_;
        genesisTimestamp = genesisTimestamp_;
        epochDuration = epochDuration_;
    }

    function setRewardDistributor(address rewardDistributor_) external onlyAdmin {
        if (rewardDistributor_ == address(0)) {
            revert Errors.ZeroAddress();
        }
        if (rewardDistributor != address(0)) {
            revert Errors.InvalidState();
        }

        rewardDistributor = rewardDistributor_;
        emit RewardDistributorConfigured(rewardDistributor_);
    }

    function renounceAdmin() external onlyAdmin {
        emit AdminRenounced(admin);
        admin = address(0);
    }

    function currentEpoch() public view override returns (uint256) {
        return _epochAt(block.timestamp);
    }

    function registerNode(NodeRole role, bytes32 metadataHash) external override {
        NodeInfo storage node = _nodes[msg.sender];
        uint256 epoch = currentEpoch();
        bool firstRegistration = node.registeredAt == 0;

        if (firstRegistration) {
            node.registeredAt = uint64(block.timestamp);
        }

        node.role = role;
        node.metadataHash = metadataHash;
        node.active = true;

        if (firstRegistration || node.lastHeartbeatEpoch != epoch) {
            node.lastHeartbeatEpoch = uint64(epoch);
            if (!_activeAtEpoch[epoch][msg.sender]) {
                _activeAtEpoch[epoch][msg.sender] = true;
                activeNodeCount[epoch] += 1;
            }
        }

        emit NodeRegistered(msg.sender, role, metadataHash, epoch);
    }

    function setNodeMetadata(bytes32 metadataHash) external override {
        NodeInfo storage node = _nodes[msg.sender];
        if (node.registeredAt == 0) {
            revert Errors.InvalidState();
        }

        node.metadataHash = metadataHash;
        emit NodeMetadataUpdated(msg.sender, metadataHash);
    }

    function heartbeat() external override returns (uint256 epoch) {
        NodeInfo storage node = _nodes[msg.sender];
        if (!node.active) {
            revert Errors.InvalidState();
        }

        epoch = currentEpoch();
        if (node.lastHeartbeatEpoch != epoch) {
            node.lastHeartbeatEpoch = uint64(epoch);
            if (!_activeAtEpoch[epoch][msg.sender]) {
                _activeAtEpoch[epoch][msg.sender] = true;
                activeNodeCount[epoch] += 1;
            }
        }

        emit NodeHeartbeated(msg.sender, epoch);
    }

    function deactivateNode() external override {
        NodeInfo storage node = _nodes[msg.sender];
        if (!node.active) {
            revert Errors.InvalidState();
        }

        node.active = false;
        emit NodeDeactivated(msg.sender);
    }

    function getNode(address node) external view override returns (NodeInfo memory) {
        return _nodes[node];
    }

    function isNodeActiveAt(address node, uint256 epoch) external view override returns (bool) {
        return _activeAtEpoch[epoch][node];
    }

    function _epochAt(uint256 timestamp) internal view returns (uint256) {
        if (timestamp <= genesisTimestamp) {
            return 0;
        }

        return (timestamp - genesisTimestamp) / epochDuration;
    }
}
