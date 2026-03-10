# Koinara

Koinara is `A Peer-to-Peer Collective Inference Network` and the open network for collective inference.

This repository is a v1 reference implementation of the minimum viable Koinara protocol. It defines only `Minimum Acceptable Inference (MAI)` and `Minimum Reward`. Market quality, depth, speed, and user preference stay outside the protocol boundary.

## Core Philosophy

- minimal protocol surface
- permissionless participation for humans and AI agents
- ownerless direction
- fair launch
- protocol validity separated from market quality
- protocol reward separated from market reward

## v1 Scope

Included:

- on-chain job registry
- on-chain submission registry
- MAI / PoI verification flow
- epoch-based reward emission with halving
- KOIN issuance through accepted inference only

Excluded:

- bridge logic
- cross-chain settlement
- zkML
- advanced oracle systems
- DAO governance
- subjective ranking
- advanced reputation systems

## Folder Structure

```text
/
  README.md
  docs/
    whitepaper-summary.md
    protocol-spec.md
    protocol-glossary.md
    architecture.md
    tokenomics.md
    state-machine.md
    contracts-overview.md
    genesis-rules.md
  contracts/
    KOINToken.sol
    InferenceJobRegistry.sol
    ProofOfInferenceVerifier.sol
    RewardDistributor.sol
    interfaces/
    libraries/
  script/
    Deploy.s.sol
    DemoFlow.s.sol
  test/
    KOINToken.t.sol
    InferenceJobRegistry.t.sol
    ProofOfInferenceVerifier.t.sol
    RewardDistributor.t.sol
    IntegrationFlow.t.sol
  foundry.toml
```

## Contracts Summary

### `KOINToken.sol`

- ERC20-compatible token named `Koinara`
- symbol `KOIN`
- capped supply at `2,100,000,000 KOIN`
- minting restricted to `RewardDistributor`

### `InferenceJobRegistry.sol`

- creates jobs
- tracks state transitions
- stores canonical submission
- escrows premium reward

### `ProofOfInferenceVerifier.sol`

- registers submissions
- records verifier approvals / rejection
- finalizes PoI only after MAI conditions pass

### `RewardDistributor.sol`

- calculates epoch-based issuance
- applies job type weight
- splits reward between provider and verifiers
- settles accepted jobs

## Installation

1. Install Foundry from the official Foundry installer.
2. Enter the repository root.
3. Run `forge build`.

## Testing

Run:

```bash
forge test
```

The test suite covers:

- job creation
- response submission
- deadline failure
- PoI finalization after verifier quorum
- rejection path
- reward distribution
- cap enforcement
- full integration flow

## Deployment

Example:

```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url <RPC_URL> --broadcast
```

## Demo Flow

Example:

```bash
forge script script/DemoFlow.s.sol:DemoFlowScript --rpc-url <RPC_URL> --broadcast
```

## Notes on Terminology

- `MAI` is minimum protocol validity, not best-answer quality
- `PoI` proves minimum acceptance, not optimal truth
- `Protocol reward` means `KOIN` issuance
- `Market reward` means user-funded premium reward

## Roadmap After v1

- verifier sybil resistance
- richer market-layer pricing
- off-chain payload commitments and retrieval
- optional reputation layers
- multi-chain execution adapters
- zk-backed verification modules

## TODO

- add stronger verifier admission and anti-sybil mechanisms
- add benchmark scripts for epoch simulations
- add richer failure-path tests for premium refunds and duplicate settlement
- add deployment config profiles for Worldland and local dev environments
