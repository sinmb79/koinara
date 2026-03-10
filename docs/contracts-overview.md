# Contracts Overview

## `KOINToken.sol`

- lightweight ERC20-compatible token
- hard cap at `2,100,000,000 KOIN`
- single minter role
- no owner mint privilege

## `InferenceJobRegistry.sol`

- creates jobs
- stores canonical submission data
- enforces state transitions
- escrows premium rewards
- refunds premium on reject / expiry

## `ProofOfInferenceVerifier.sol`

- registers submitted jobs for verification
- stores MAI condition flags
- tracks unique verifier participation
- finalizes PoI after quorum

## `RewardDistributor.sol`

- computes reward from epoch schedule and job weight
- splits protocol reward between provider and verifiers
- releases premium reward via registry
- marks accepted jobs as settled

## Libraries

### `JobTypes.sol`

- canonical enums for job type and job state
- weight and verifier quorum helpers

### `Errors.sol`

- shared custom errors

### `Events.sol`

- shared protocol event definitions
