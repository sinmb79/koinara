// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {KOINToken} from "../contracts/KOINToken.sol";
import {InferenceJobRegistry} from "../contracts/InferenceJobRegistry.sol";
import {ProofOfInferenceVerifier} from "../contracts/ProofOfInferenceVerifier.sol";
import {RewardDistributor} from "../contracts/RewardDistributor.sol";
import {ScriptBase} from "./helpers/ScriptBase.sol";

contract DeployScript is ScriptBase {
    function run()
        external
        returns (
            KOINToken token,
            InferenceJobRegistry registry,
            ProofOfInferenceVerifier verifier,
            RewardDistributor distributor
        )
    {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        registry = new InferenceJobRegistry(deployer);
        verifier = new ProofOfInferenceVerifier(address(registry));
        token = new KOINToken(deployer);
        distributor = new RewardDistributor(
            address(token), address(registry), address(verifier), block.timestamp, 1 days, 365, 1_000 ether
        );

        registry.setVerifier(address(verifier));
        registry.setRewardDistributor(address(distributor));
        token.setMinter(address(distributor));
        registry.renounceAdmin();
        token.renounceAdmin();

        vm.stopBroadcast();
    }
}
