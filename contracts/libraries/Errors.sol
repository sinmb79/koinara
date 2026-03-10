// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Errors {
    error ZeroAddress();
    error Unauthorized();
    error InvalidHash();
    error InvalidDeadline();
    error InvalidConfiguration();
    error InvalidJob();
    error InvalidState();
    error DeadlinePassed();
    error DeadlineNotReached();
    error SubmissionAlreadyExists();
    error SubmissionNotFound();
    error AlreadyRegistered();
    error DuplicateVerification();
    error SelfVerification();
    error AlreadyFinalized();
    error SubmissionRejected();
    error QuorumNotReached();
    error MinterAlreadySet();
    error CapExceeded();
    error LengthMismatch();
    error InvalidVerifierSet();
    error RewardsAlreadyDistributed();
    error PremiumAlreadyReleased();
    error TransferFailed();
    error InsufficientBalance();
    error InsufficientAllowance();
}
