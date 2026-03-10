// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IProofOfInferenceVerifier {
    struct VerificationRecord {
        address provider;
        bytes32 responseHash;
        uint64 submittedAt;
        uint256 approvals;
        uint256 quorum;
        bool validJob;
        bool withinDeadline;
        bool formatPass;
        bool nonEmptyResponse;
        bool verificationPass;
        bool rejected;
        bool finalized;
        bytes32 poiHash;
    }

    function registerSubmission(uint256 jobId) external;
    function verifySubmission(uint256 jobId) external;
    function rejectSubmission(uint256 jobId, string calldata reason) external;
    function finalizePoI(uint256 jobId) external returns (bytes32);
    function getRecord(uint256 jobId) external view returns (VerificationRecord memory);
    function getApprovedVerifiers(uint256 jobId) external view returns (address[] memory);
    function hasParticipated(uint256 jobId, address verifier) external view returns (bool);
}
