// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {InferenceJobRegistry} from "../contracts/InferenceJobRegistry.sol";
import {ProofOfInferenceVerifier} from "../contracts/ProofOfInferenceVerifier.sol";
import {RewardDistributor} from "../contracts/RewardDistributor.sol";
import {JobTypes} from "../contracts/libraries/JobTypes.sol";
import {ScriptBase} from "./helpers/ScriptBase.sol";

contract DemoFlowScript is ScriptBase {
    function run() external {
        uint256 creatorPrivateKey = vm.envUint("CREATOR_PRIVATE_KEY");
        uint256 providerPrivateKey = vm.envUint("PROVIDER_PRIVATE_KEY");
        uint256 verifierOnePrivateKey = vm.envUint("VERIFIER_ONE_PRIVATE_KEY");
        uint256 verifierTwoPrivateKey = vm.envUint("VERIFIER_TWO_PRIVATE_KEY");
        uint256 verifierThreePrivateKey = vm.envUint("VERIFIER_THREE_PRIVATE_KEY");

        address provider = vm.addr(providerPrivateKey);

        InferenceJobRegistry registry = InferenceJobRegistry(vm.envAddress("REGISTRY"));
        ProofOfInferenceVerifier verifier = ProofOfInferenceVerifier(vm.envAddress("VERIFIER"));
        RewardDistributor distributor = RewardDistributor(vm.envAddress("DISTRIBUTOR"));

        vm.startBroadcast(creatorPrivateKey);
        uint256 jobId = registry.createJob{value: 1 ether}(
            keccak256("demo-request"),
            keccak256("demo-schema"),
            uint64(block.timestamp + 1 days),
            JobTypes.JobType.General
        );
        vm.stopBroadcast();

        vm.startBroadcast(providerPrivateKey);
        registry.submitResponse(jobId, keccak256("demo-response"));
        verifier.registerSubmission(jobId);
        vm.stopBroadcast();

        vm.startBroadcast(verifierOnePrivateKey);
        verifier.verifySubmission(jobId);
        vm.stopBroadcast();

        vm.startBroadcast(verifierTwoPrivateKey);
        verifier.verifySubmission(jobId);
        vm.stopBroadcast();

        vm.startBroadcast(verifierThreePrivateKey);
        verifier.verifySubmission(jobId);
        vm.stopBroadcast();

        vm.startBroadcast(creatorPrivateKey);
        verifier.finalizePoI(jobId);
        distributor.distributeRewards(jobId, provider);
        vm.stopBroadcast();
    }
}
