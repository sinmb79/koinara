# Genesis Rules

## Fair Launch Commitments

Koinara v1 follows these genesis rules:

1. No pre-mine
2. No founder allocation
3. No admin-controlled mint
4. No hidden treasury mint
5. No privileged inference reward bypass

## Issuance Rule

All `KOIN` enters circulation only through accepted `Proof of Inference` reward distribution.

## Ownerless Direction

The reference implementation uses temporary deployment wiring only. After deployment:

- registry admin can be renounced
- token admin can be renounced
- no mint privilege remains outside `RewardDistributor`

## Chain Positioning

The protocol is chain-independent by design. v1 is written as an EVM-friendly reference implementation for Worldland-style deployment environments, but the conceptual rules do not depend on a single chain.

## v1 Exclusions

Genesis intentionally excludes:

- DAO governance
- bridge minting
- cross-chain settlement
- zkML proofs
- advanced oracle truth systems
- subjective market ranking logic
