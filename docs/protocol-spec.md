# Koinara Protocol Specification v1

## Scope

This specification defines the minimum viable protocol for Koinara v1. The protocol is intentionally narrow. It standardizes only minimum validity and minimum reward distribution.

## Roles

- `Job Creator`: publishes an inference request and optional premium reward
- `Provider`: submits an inference response hash
- `Verifier`: approves or rejects whether the submission meets the minimum protocol rules

## Objects

### Inference Job

An inference job is the base unit of work in the network. Each job stores:

- `jobId`
- `creator`
- `requestHash`
- `schemaHash`
- `deadline`
- `jobType`
- `premiumReward`
- `state`

### Submission

Each v1 job tracks one canonical submission:

- `provider`
- `responseHash`
- `submittedAt`
- `exists`

### Verification Record

The verifier contract records the MAI / PoI status for the canonical submission:

- `validJob`
- `withinDeadline`
- `formatPass`
- `nonEmptyResponse`
- `verificationPass`
- `approvals`
- `quorum`
- `rejected`
- `finalized`
- `poiHash`

## MAI Rules

Koinara v1 recognizes a submission as MAI only when all of the following are true:

1. `ValidJob`
2. `WithinDeadline`
3. `FormatPass`
4. `NonEmptyResponse`
5. `VerificationPass`

### Interpretation in v1

- `ValidJob`: the job exists and was created with non-zero request and schema hashes
- `WithinDeadline`: the response was submitted at or before the job deadline
- `FormatPass`: the job references a non-zero schema hash and the verifier is registering a concrete submission against that job
- `NonEmptyResponse`: the submitted response hash is not zero
- `VerificationPass`: distinct verifier addresses meet quorum

The protocol does not inspect semantic quality, correctness ranking, style, or completeness beyond this minimum floor.

## Job Types

- `Simple`
- `General`
- `Collective`

### Quorum

- `Simple = 1`
- `General = 3`
- `Collective = 5`

### Weight

- `Simple = 1`
- `General = 3`
- `Collective = 7`

## State Machine

### Persisted states

- `Created`
- `Open`
- `Submitted`
- `UnderVerification`
- `Accepted`
- `Rejected`
- `Settled`
- `Expired`

### Transition rules

- `createJob`: `Created -> Open`
- `submitResponse`: `Open -> Submitted`
- `registerSubmission`: `Submitted -> UnderVerification`
- `finalizePoI`: `UnderVerification -> Accepted`
- `rejectSubmission`: `UnderVerification -> Rejected`
- `distributeRewards + settleJob`: `Accepted -> Settled`
- `markExpired`: `Open -> Expired`

## Contract Responsibilities

### InferenceJobRegistry

- creates jobs
- stores canonical submission
- enforces state transitions
- escrows and releases premium rewards

### ProofOfInferenceVerifier

- registers submissions for verification
- counts distinct verifier approvals
- handles rejection
- mints PoI state only after MAI rules are satisfied

### RewardDistributor

- computes epoch-based baseline issuance
- applies job-type weight
- splits protocol reward between provider and verifiers
- triggers premium payout release
- settles accepted jobs

### KOINToken

- capped ERC20-compatible token
- no privileged mint path
- minting restricted to RewardDistributor

## Premium Reward Rules

- premium reward is native-token escrow attached to a job at creation
- premium reward is separate from protocol issuance accounting
- on accepted jobs, premium reward is released to the provider
- on rejected or expired jobs, the creator can reclaim the premium reward

## Non-goals in v1

- best-answer ranking
- SLA guarantees
- reputation markets
- sybil resistance for verifiers
- off-chain content discovery
- oracle-backed truth certification
