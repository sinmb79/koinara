// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IRewardDistributor {
    function currentEpoch() external view returns (uint256);
    function epochEmission(uint256 epoch) external view returns (uint256);
    function calculateJobReward(uint256 jobId) external view returns (uint256);
    function getRewardBreakdown(uint256 jobId)
        external
        view
        returns (uint256 totalReward, uint256 providerReward, uint256 verifierRewardTotal);
    function distributeRewards(uint256 jobId, address provider) external;
}
