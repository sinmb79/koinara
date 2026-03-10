// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {JobTypes} from "../contracts/libraries/JobTypes.sol";
import {KoinaraFixture} from "./helpers/KoinaraFixture.sol";

contract IntegrationFlowTest is KoinaraFixture {
    function testFullCollectiveFlow() public {
        uint256 jobId = _createJob(JobTypes.JobType.Collective, 2 days, 2 ether);
        _submitResponse(jobId, RESPONSE_HASH);
        _registerSubmission(jobId);
        _approveCollective(jobId);
        verifier.finalizePoI(jobId);

        distributor.distributeRewards(jobId, provider);

        assertEq(token.balanceOf(provider), 4_900 ether);
        assertEq(token.balanceOf(verifierOne), 420 ether);
        assertEq(token.balanceOf(verifierTwo), 420 ether);
        assertEq(token.balanceOf(verifierThree), 420 ether);
        assertEq(token.balanceOf(verifierFour), 420 ether);
        assertEq(token.balanceOf(verifierFive), 420 ether);
        assertEq(uint256(registry.getJob(jobId).state), uint256(JobTypes.JobState.Settled));
    }
}
