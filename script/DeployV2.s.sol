// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {InferenceJobRegistry} from "../contracts/InferenceJobRegistry.sol";
import {KOINToken} from "../contracts/KOINToken.sol";
import {NodeRegistryV2} from "../contracts/NodeRegistryV2.sol";
import {ProofOfInferenceVerifier} from "../contracts/ProofOfInferenceVerifier.sol";
import {RewardDistributorV2} from "../contracts/RewardDistributorV2.sol";
import {ScriptBase} from "./helpers/ScriptBase.sol";

contract DeployV2Script is ScriptBase {
    function run()
        external
        returns (
            KOINToken token,
            NodeRegistryV2 nodeRegistry,
            InferenceJobRegistry registry,
            ProofOfInferenceVerifier verifier,
            RewardDistributorV2 distributor
        )
    {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        uint256 activePoolBps = 2_000;

        vm.startBroadcast(deployerPrivateKey);

        registry = new InferenceJobRegistry(deployer);
        verifier = new ProofOfInferenceVerifier(address(registry));
        token = new KOINToken(deployer);
        nodeRegistry = new NodeRegistryV2(deployer, block.timestamp, 1 days);
        distributor = new RewardDistributorV2(
            address(token),
            address(registry),
            address(verifier),
            address(nodeRegistry),
            block.timestamp,
            1 days,
            365,
            1_000 ether,
            activePoolBps
        );

        registry.setVerifier(address(verifier));
        registry.setRewardDistributor(address(distributor));
        token.setMinter(address(distributor));
        nodeRegistry.setRewardDistributor(address(distributor));
        registry.renounceAdmin();
        token.renounceAdmin();
        nodeRegistry.renounceAdmin();

        vm.stopBroadcast();
    }
}
