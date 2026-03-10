# Koinara Whitepaper Summary

## Identity

- Official name: `Koinara: A Peer-to-Peer Collective Inference Network`
- Tagline: `The open network for collective inference`
- Objective: implement a minimal protocol for collective inference with on-chain job registration, minimum validity checks, and baseline token issuance

## Core Thesis

Koinara treats inference as a public market primitive rather than a closed product feature. The protocol defines only:

1. `Minimum Acceptable Inference (MAI)`
2. `Minimum Reward`

Everything above that floor, including speed, depth, polish, ranking, and user delight, is decided by the market rather than by protocol governance.

## Design Principles

1. Minimalism
2. Permissionless participation
3. Market-driven quality
4. Neutral infrastructure
5. Chain-independent protocol design with an EVM-friendly v1 reference implementation

## MAI

In v1, a response qualifies as `Minimum Acceptable Inference` when it satisfies the protocol floor:

- it belongs to a valid job
- it is submitted before the deadline
- it has a non-empty response hash
- it passes verifier quorum

The protocol does not claim that the response is the best answer. It only records that the minimum acceptance rules were satisfied.

## PoI

`Proof of Inference (PoI)` is the protocol-level proof that MAI was reached for a submitted response.

PoI means:

- a valid job existed
- the provider submitted in time
- the minimum format checks passed
- the response was non-empty
- verifier quorum approved it

PoI does not mean:

- best answer
- objective truth
- market preference
- final user satisfaction

## Reward Model

- Protocol reward: baseline `KOIN` issuance
- Market reward: user-funded premium reward
- Provider income: `protocol reward + market reward`

v1 splits protocol reward as:

- provider: 70%
- verifiers: 30%

## Token Philosophy

- token symbol: `KOIN`
- capped supply: `2,100,000,000 KOIN`
- no pre-mine
- no founder allocation
- no admin mint path
- minting only through accepted inference reward distribution

## v1 Scope

Included:

- on-chain job registry
- on-chain submission registration
- on-chain verifier quorum tracking
- epoch-based halving emission
- protocol reward and market reward separation

Excluded:

- bridge logic
- cross-chain settlement
- advanced oracle systems
- zkML
- DAO governance
- subjective ranking
- advanced reputation systems
- autonomous agent mesh coordination
