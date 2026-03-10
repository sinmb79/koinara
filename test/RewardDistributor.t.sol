// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {JobTypes} from "../contracts/libraries/JobTypes.sol";
import {KoinaraFixture} from "./helpers/KoinaraFixture.sol";

contract RewardDistributorTest is KoinaraFixture {
    function testRewardDistributionSplitsProviderAndVerifierRewards() public {
        uint256 jobId = _createJob(JobTypes.JobType.Simple, 1 days, 1 ether);
        _submitResponse(jobId, RESPONSE_HASH);
        _registerSubmission(jobId);
        address[] memory approvedVerifiers = _approveSimple(jobId);
        verifier.finalizePoI(jobId);

        uint256 providerEthBefore = provider.balance;
        distributor.distributeRewards(jobId, provider, approvedVerifiers);

        assertEq(token.balanceOf(provider), 700 ether);
        assertEq(token.balanceOf(verifierOne), 300 ether);
        assertEq(provider.balance, providerEthBefore + 1 ether);
        assertEq(uint256(registry.getJob(jobId).state), uint256(JobTypes.JobState.Settled));
    }
}
