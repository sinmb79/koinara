# Koinara Whitepaper Appendices

This document is the companion appendix to the main Koinara whitepaper.

For the Korean version, see [`whitepaper-appendices.ko.md`](./whitepaper-appendices.ko.md).

The main whitepaper presents the protocol thesis and minimum mechanics. This appendix collects deployment profiles, portability notes, contract mappings, and parameter references that support the core paper.

## Appendix A. Deployment Profiles

Koinara is designed as a chain-independent protocol with multiple deployment profiles.

Recommended profile categories:

- local development profile
- EVM-compatible production profile
- Worldland-oriented profile
- future non-EVM compatibility profiles

The protocol theory should remain stable even where deployment assumptions change.

## Appendix B. Reference Deployment: Worldland

Worldland is a natural reference environment for an EVM-friendly Koinara deployment because it allows the v1 contracts to operate without changing the minimum protocol model.

In this profile:

- KOIN issuance remains tied to PoI
- jobs, verification, and settlement remain on-chain
- premium reward may remain native-asset based

Worldland in this appendix is a reference deployment profile, not a protocol dependency.

## Appendix C. EVM-Compatible Deployment

Any EVM-compatible environment can host the v1 reference contracts so long as it supports:

- standard contract deployment
- native-asset escrow for premium rewards
- hash commitments
- deterministic state transitions

The reference implementation is intentionally written so that the protocol concepts remain legible across EVM-compatible chains.

## Appendix D. Solana Deployment Model

A Solana-oriented deployment would preserve the same conceptual model while mapping jobs, receipts, and reward logic into Solana-native account and program structures.

This appendix is non-normative in v1. It signals portability rather than a finished implementation.

## Appendix E. Bitcoin Anchoring Model

Bitcoin anchoring may later be used for timestamping, commitment finality, or cross-system auditability without forcing Koinara settlement to become Bitcoin-native.

This appendix is also non-normative in v1. It describes a possible anchoring direction rather than an implemented feature.

## Appendix F. Reference Contracts and Code Notes

The v1 reference implementation consists of four primary contracts:

- `InferenceJobRegistry`
- `ProofOfInferenceVerifier`
- `RewardDistributor`
- `KOINToken`

### F.1 Logical Architecture

Koinara consists of four logical layers:

1. Job Layer
2. Provider Layer
3. Verification Layer
4. Settlement Layer

### F.2 Contract Mapping Note

The main architecture figures appear in the main whitepaper, Section 6. This appendix maps those layers to the v1 reference contracts:

- `Job Layer` -> `InferenceJobRegistry`
- `Verification Layer` -> `ProofOfInferenceVerifier`
- `Settlement Layer` -> `RewardDistributor`
- `Issuance Asset` -> `KOINToken`

This mapping keeps the main whitepaper readable while still tying the abstract protocol layers to the concrete reference codebase.

## Appendix G. Parameters

### G.1 Default v1 Parameters

- token cap: `2,100,000,000 KOIN`
- provider share: `70%`
- verifier share: `30%`
- job weights: `Simple = 1`, `General = 3`, `Collective = 7`
- verifier quorum: `Simple = 1`, `General = 3`, `Collective = 5`

### G.2 Issuance Curve

KOIN issuance follows a declining epoch schedule:

```text
E_t = E_0 * (1/2)^(floor(t / H))
```

Properties of this curve:

- early participation receives stronger baseline incentives
- issuance decreases over time
- long-term scarcity is preserved by fixed supply
- market rewards can gradually replace protocol rewards as the dominant incentive

### G.3 Economic Interpretation

In early stages, protocol issuance is the primary incentive. As the network matures:

- job demand increases
- premium rewards increase
- competition increases
- market-based income becomes more important

### G.4 Figure Reference

The primary issuance visualization appears as Figure 4 in the main whitepaper, Section 7. This appendix keeps the parameter interpretation close to the economic rule set while leaving the visual curve in the main body of the whitepaper.
