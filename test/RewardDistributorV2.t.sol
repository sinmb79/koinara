// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Errors} from "../contracts/libraries/Errors.sol";
import {JobTypes} from "../contracts/libraries/JobTypes.sol";
import {KoinaraV2Fixture} from "./helpers/KoinaraV2Fixture.sol";

contract RewardDistributorV2Test is KoinaraV2Fixture {
    function testRecordAcceptedJobSettlesPremiumAndTracksEpochWeight() public {
        _registerActiveProvider();
        _registerActiveVerifier(verifierOne);

        uint256 jobId = _createJob(JobTypes.JobType.Simple, 1 days, 2 ether);
        _submitResponse(jobId, RESPONSE_HASH);
        _registerSubmission(jobId);
        _approveSimple(jobId);
        verifier.finalizePoI(jobId);

        uint256 providerBalanceBefore = provider.balance;

        distributor.recordAcceptedJob(jobId, provider);

        assertEq(uint256(registry.getJob(jobId).state), uint256(JobTypes.JobState.Settled));
        assertEq(distributor.epochAcceptedWeight(0), 1);
        assertEq(provider.balance, providerBalanceBefore + 2 ether);
    }

    function testClaimActiveAndWorkRewardsAfterEpochClose() public {
        _registerActiveProvider();
        _registerActiveVerifier(verifierOne);

        uint256 jobId = _createJob(JobTypes.JobType.Simple, 1 days, 0);
        _submitResponse(jobId, RESPONSE_HASH);
        _registerSubmission(jobId);
        _approveSimple(jobId);
        verifier.finalizePoI(jobId);
        distributor.recordAcceptedJob(jobId, provider);

        vm.warp(block.timestamp + EPOCH_DURATION + 1);

        vm.prank(provider);
        distributor.claimProviderWorkReward(jobId);
        vm.prank(verifierOne);
        distributor.claimVerifierWorkReward(jobId);
        vm.prank(provider);
        distributor.claimActiveReward(0);
        vm.prank(verifierOne);
        distributor.claimActiveReward(0);

        assertEq(token.balanceOf(provider), 660 ether);
        assertEq(token.balanceOf(verifierOne), 340 ether);
    }

    function testCannotClaimBeforeEpochCloses() public {
        _registerActiveProvider();
        _registerActiveVerifier(verifierOne);

        uint256 jobId = _createJob(JobTypes.JobType.Simple, 1 days, 0);
        _submitResponse(jobId, RESPONSE_HASH);
        _registerSubmission(jobId);
        _approveSimple(jobId);
        verifier.finalizePoI(jobId);
        distributor.recordAcceptedJob(jobId, provider);

        vm.prank(provider);
        vm.expectRevert(abi.encodeWithSelector(Errors.InvalidState.selector));
        distributor.claimProviderWorkReward(jobId);
    }
}
