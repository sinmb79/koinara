# Koinara: A Peer-to-Peer Collective Inference Network

## Abstract

This document is the English whitepaper for Koinara.

For the Korean version, see [`whitepaper.ko.md`](./whitepaper.ko.md).

Koinara is a minimal protocol for collective inference. It does not attempt to define intelligence, truth, or optimal answer quality at the protocol layer. Instead, it defines only two protocol primitives: `Minimum Acceptable Inference (MAI)` and `Minimum Reward`. If a submitted response satisfies the minimum acceptance conditions, the network records a `Proof of Inference (PoI)` and issues the baseline protocol reward. All value above this floor, including speed, depth, clarity, usefulness, ranking, and user satisfaction, is left to the market. This design keeps the protocol narrow, neutral, and chain-independent, while allowing humans and AI agents to participate under the same minimum rules. Koinara v1 is an EVM-friendly reference implementation of this model.

## 1. Introduction

Advanced inference is increasingly delivered through centralized platforms. Yet the real capacity for reasoning is distributed across individuals, organizations, domain experts, autonomous agents, and AI systems. The missing layer is not only better models. It is shared market infrastructure that allows inference demand and inference supply to meet under open, neutral, and minimum rules.

Koinara proposes that collective inference can be coordinated with a much smaller protocol surface than most network designs assume. Rather than embedding subjective quality ranking, reputation ideology, governance overhead, or chain-specific assumptions into the base layer, Koinara asks a narrower question:

How little must a protocol define in order to let an open inference market exist?

The answer in v1 is intentionally strict. The protocol defines only:

1. `Minimum Acceptable Inference`
2. `Minimum Reward`

Everything else belongs to competition, application design, or social coordination outside the protocol.

## 2. Design Goals

Koinara is guided by five design goals.

### 2.1 Minimalism

The protocol should define only the minimum conditions required for open inference exchange. Complexity that does not protect this minimum should remain outside the base layer.

### 2.2 Permissionless Participation

Both humans and AI agents should be able to participate as providers or verifiers. The protocol should not assume a single actor type, vendor, or organization.

### 2.3 Market-Driven Quality

The protocol should not attempt to encode the best answer. Quality is contextual and market-specific. Koinara only recognizes whether a response crossed the minimum validity threshold.

### 2.4 Neutral Infrastructure

The base layer should remain owner-light and governance-light. It should serve as shared infrastructure rather than a central planner of inference value.

### 2.5 Chain-Independent Theory

The protocol logic should be conceptually portable across execution environments. Koinara v1 uses an EVM-friendly reference implementation, but the underlying protocol ideas are not tied to a single chain.

## 3. Problem Statement

Modern inference systems typically combine three separate layers inside one closed product:

- request routing
- answer production
- answer validity and payment

This makes the market difficult to open. Users depend on a single platform for matching, execution, ranking, and settlement. Providers cannot easily compete on an open protocol surface, and verifiers cannot independently participate in a transparent minimum-validity process.

Koinara separates these concerns. It does not solve every coordination problem in inference markets. Instead, it provides a minimal public substrate for:

- publishing inference demand
- submitting a response
- checking whether the response meets the minimum protocol floor
- issuing a baseline reward if it does

This creates a common settlement and validity layer without forcing the protocol to decide what the best answer is.

## 4. Core Concepts

### 4.1 Inference Job

An `Inference Job` is the basic unit of demand in the network. A job defines the request commitment, schema commitment, deadline, job type, optional market premium, and lifecycle state.

### 4.2 Provider

A `Provider` submits an inference response for a job. In v1, the canonical on-chain object is the response hash rather than the full response payload.

### 4.3 Verifier

A `Verifier` checks whether the submission satisfies the minimum protocol rules. In v1, verifiers do not rank quality. They only approve or reject against the minimum floor.

### 4.4 Minimum Acceptable Inference

`Minimum Acceptable Inference (MAI)` is the minimum threshold required for a response to be recognized as valid by the protocol.

### 4.5 Proof of Inference

`Proof of Inference (PoI)` is the protocol record that a submission has satisfied the MAI conditions and has been finalized by the verifier process.

### 4.6 KOIN

`KOIN` is the protocol token. It is minted only through accepted inference reward distribution, subject to the protocol cap and emission schedule.

### 4.7 Market Reward

The `Market Reward` is a user-funded premium reward attached to a job. It is distinct from protocol issuance and reflects market demand rather than baseline protocol economics.

## 5. Minimum Acceptable Inference

Koinara is built around a clear separation between protocol validity and market value. A protocol must define some floor, but that floor should not be mistaken for quality supremacy.

In v1, a response is recognized as `Minimum Acceptable Inference` only if all of the following are satisfied:

1. `ValidJob`
2. `WithinDeadline`
3. `FormatPass`
4. `NonEmptyResponse`
5. `VerificationPass`

These conditions are interpreted as follows.

### 5.1 ValidJob

The referenced job exists and was created through the protocol with the required non-zero commitments.

### 5.2 WithinDeadline

The response was submitted at or before the declared deadline.

### 5.3 FormatPass

The submission is attached to a job with a valid schema commitment and can be evaluated under the minimum structural rules of the protocol.

### 5.4 NonEmptyResponse

The response commitment is not empty.

### 5.5 VerificationPass

The required verifier quorum approves the submission.

These conditions say nothing about whether the answer is the best, deepest, fastest, or most useful answer in a broader market sense. MAI is not a universal truth predicate. It is a minimum protocol acceptance rule.

## 6. Proof of Inference

PoI is the protocol artifact produced when a submission crosses the MAI threshold.

PoI means that:

- a valid job existed
- a provider submitted a non-empty response in time
- the minimum structural checks passed
- verifier quorum approved the submission

PoI does not mean:

- the answer is globally optimal
- the answer is objectively true in every context
- the market cannot prefer another answer
- user satisfaction is guaranteed

This distinction is essential. Koinara records minimum acceptable participation, not perfect cognition.

## 7. Network Roles

Koinara v1 defines three explicit roles.

### 7.1 Job Creator

The job creator opens demand by publishing an inference request commitment and optionally escrowing a premium reward.

### 7.2 Provider

The provider submits the response commitment and becomes the recipient of protocol reward and premium reward if the submission is accepted.

### 7.3 Verifier

The verifier checks whether the submission satisfies the minimum rules and either contributes approval toward quorum or rejects the submission.

The protocol does not assume that these roles are played only by humans or only by AI systems. Koinara is designed for mixed participation.

## 8. Job Lifecycle

The v1 lifecycle is intentionally narrow.

### 8.1 States

- `Created`
- `Open`
- `Submitted`
- `UnderVerification`
- `Accepted`
- `Rejected`
- `Settled`
- `Expired`

### 8.2 Transition Flow

1. A creator opens a job.
2. A provider submits a response.
3. The verifier contract registers the submission and moves the job into verification.
4. Verifiers approve or reject.
5. If quorum is reached, the protocol finalizes PoI and marks the job accepted.
6. Rewards are distributed and the job is settled.
7. If no valid completion occurs before the deadline, the job can expire.

### 8.3 Lifecycle Principle

Only accepted jobs mint KOIN. Rejected and expired jobs do not create protocol issuance.

## 9. Job Types and Quorum

Koinara v1 includes three job types:

- `Simple`
- `General`
- `Collective`

These types affect both verifier quorum and reward weight.

### 9.1 Verifier Quorum

- `Simple = 1`
- `General = 3`
- `Collective = 5`

### 9.2 Reward Weight

- `Simple = 1`
- `General = 3`
- `Collective = 7`

The protocol does not interpret these types as deep ontology. They are lightweight coordination categories used for minimum settlement logic in v1.

## 10. Reward Model

Koinara separates protocol issuance from market compensation.

### 10.1 Protocol Reward

The protocol reward is the baseline issuance of `KOIN`. It exists to reward accepted inference under the minimum rules of the network.

### 10.2 Market Reward

The market reward is an optional premium funded by the job creator. It expresses local market demand and remains distinct from KOIN issuance.

### 10.3 Provider Income

For an accepted job:

`ProviderIncome = ProtocolReward + MarketReward`

This rule allows the protocol to remain minimal while still supporting market-driven upside.

## 11. Tokenomics

### 11.1 Token Properties

- Name: `Koinara`
- Symbol: `KOIN`
- Maximum supply: `2,100,000,000 KOIN`

### 11.2 Fair Launch

Koinara follows a fair launch model:

- no pre-mine
- no founder allocation
- no admin mint
- no hidden treasury mint
- no issuance path outside accepted inference

### 11.3 Issuance Rule

All KOIN enters circulation only through accepted Proof of Inference reward distribution.

### 11.4 Epoch Emission

The v1 reference model uses epoch-based halving:

`E_t = E_0 * (1/2)^(floor(t / H))`

Where:

- `E_0` is the initial epoch emission
- `t` is the epoch index
- `H` is the halving interval in epochs

For a given job:

`JobReward = epochEmission(submissionEpoch) * jobWeight`

### 11.5 Reward Split

Protocol issuance is split as:

- provider: `70%`
- verifiers: `30%`

Verifier reward is split evenly across the approving verifier set in v1. Any remainder caused by integer rounding is assigned to the provider to avoid stranded units.

## 12. Architecture

Koinara v1 is implemented as four primary contracts.

### 12.1 InferenceJobRegistry

The registry is the lifecycle source of truth for jobs and canonical submissions. It also escrows premium rewards and manages premium release or refund.

### 12.2 ProofOfInferenceVerifier

The verifier contract tracks the MAI condition flags, distinct verifier approvals, rejection, and PoI finalization.

### 12.3 RewardDistributor

The distributor calculates epoch-based issuance, applies job weight, splits protocol rewards, triggers premium release, and settles accepted jobs.

### 12.4 KOINToken

The token contract is intentionally simple. It enforces the supply cap and restricts minting to the reward distributor.

This separation keeps premium reward accounting separate from protocol issuance accounting.

## 13. Ownerless Direction

Koinara aims toward an owner-light or ownerless protocol character. In the v1 reference implementation, privileged setup exists only to wire the system:

- set verifier address
- set reward distributor address
- set token minter

After deployment wiring, admin control can be renounced. This is not full governance minimization in every sense, but it keeps the trusted setup surface intentionally small.

## 14. Security and Trust Assumptions

Koinara v1 is deliberately modest about what it secures.

It does secure:

- explicit job state transitions
- restricted mint authority
- supply cap enforcement
- duplicate settlement prevention
- duplicate verifier participation prevention
- premium reward separation from protocol issuance

It does not fully solve:

- verifier sybil resistance
- semantic correctness
- off-chain data availability
- collusion resistance
- universal truth evaluation
- cross-chain settlement

These are not oversights in v1. They are deliberately excluded so that the minimum protocol can remain simple and composable.

## 15. v1 Scope and Exclusions

Koinara v1 is a `Minimum Viable Protocol`.

Included:

- on-chain registry
- on-chain verifier flow
- on-chain reward distribution
- capped token issuance
- fair launch token path
- market reward escrow

Excluded:

- bridge logic
- cross-chain settlement
- zkML
- advanced oracle systems
- DAO governance
- subjective answer ranking
- advanced reputation systems
- autonomous agent mesh coordination

The protocol should not absorb these concerns until the minimum layer is proven useful.

## 16. Why This Minimality Matters

Protocols often fail by trying to price, rank, govern, and interpret everything at once. In inference markets, that temptation is even stronger because correctness and value are often contextual.

Koinara takes the opposite direction. It defines a floor rather than a ceiling. It allows open participation without pretending that the protocol can settle every argument about quality. In this sense, Koinara is not a complete theory of intelligence markets. It is a minimum coordination layer for them.

This matters because it preserves flexibility:

- applications can compete on quality models
- markets can compete on premium pricing
- ecosystems can layer reputation without changing the minimum protocol
- future chains can adopt the same conceptual rules

## 17. Conclusion

Koinara is an attempt to define the smallest useful protocol for collective inference. By limiting the protocol to Minimum Acceptable Inference and Minimum Reward, it avoids turning the base layer into a centralized judge of intelligence quality. Instead, it offers a neutral foundation on which humans, AI agents, and applications can coordinate open inference markets.

The v1 reference implementation is intentionally narrow. It is not the final form of collective inference infrastructure. It is the first credible minimum.
