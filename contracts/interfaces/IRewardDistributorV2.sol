// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IRewardDistributorV2 {
    function currentEpoch() external view returns (uint256);
    function epochEmission(uint256 epoch) external view returns (uint256);
    function activeEpochEmission(uint256 epoch) external view returns (uint256);
    function workEpochEmission(uint256 epoch) external view returns (uint256);
    function epochAcceptedWeight(uint256 epoch) external view returns (uint256);
    function recordAcceptedJob(uint256 jobId, address provider) external;
    function calculateJobReward(uint256 jobId) external view returns (uint256);
    function getRewardBreakdown(uint256 jobId)
        external
        view
        returns (uint256 totalReward, uint256 providerReward, uint256 verifierRewardTotal);
    function claimProviderWorkReward(uint256 jobId) external;
    function claimVerifierWorkReward(uint256 jobId) external;
    function claimActiveReward(uint256 epoch) external;
}
