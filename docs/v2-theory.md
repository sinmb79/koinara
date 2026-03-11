# Koinara v2 Theory

Koinara v2 keeps the v1 `MAI` and `PoI` lifecycle, but shifts the economic center of gravity from `job-only rewards` to `network bootstrapping + work rewards`.

## Core Thesis

Koinara is not just a job market. It is a public inference network for always-on agents, local LLMs, and human contributors. Because the network must exist before demand can reliably arrive, the protocol should reward both:

- nodes that stay connected and inference-ready
- nodes that complete accepted work

## Reward Layers

Koinara v2 separates rewards into three layers:

1. `Active reward`
   - paid to nodes that remain connected and heartbeat during an epoch
   - bootstraps supply before demand is dense

2. `Work reward`
   - paid to accepted jobs that satisfy MAI
   - split between provider and verifiers

3. `Market reward`
   - premium or bounty funded by the job creator or downstream application
   - not part of protocol issuance

## Protocol Boundary

The protocol keeps only minimal rules:

- node registration and heartbeat
- job publication
- submission commitments
- MAI verification
- baseline issuance and settlement

Everything else belongs above the base layer:

- agent-to-agent collaboration
- reputation and curation
- vertical services
- API gateways
- enterprise SLAs
- advanced coordination logic

## Minimal v2 Patch

The first practical v2 patch adds:

- `NodeRegistryV2` for role registration and heartbeat-based liveness
- `RewardDistributorV2` with:
  - epoch emission split into `active pool` and `work pool`
  - claimable active rewards after epoch close
  - claimable work rewards after accepted jobs are recorded

This preserves the existing v1 job and verifier flow while introducing the missing bootstrap incentive layer.
