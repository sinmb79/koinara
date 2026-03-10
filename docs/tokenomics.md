# Koinara Tokenomics v1

## Token

- Name: `Koinara`
- Symbol: `KOIN`
- Max supply: `2,100,000,000 KOIN`
- Mint path: accepted inference only

## Fair Launch Rules

- no pre-mine
- no founder allocation
- no admin mint
- no arbitrary treasury mint

## Emission Model

Koinara v1 uses a halving schedule:

`E_t = E_0 * (1/2)^(floor(t / H))`

Where:

- `E_0` is the baseline epoch emission scalar
- `t` is the epoch index
- `H` is the halving interval in epochs

The reference contracts interpret `epochEmission(epoch)` as the baseline Simple-job reward scalar for that epoch.

The token cap is a hard ceiling rather than a guaranteed fully issued terminal supply; under the discrete halving schedule, issuance may stop below the cap if the cap is not reached earlier.

## Job Type Weights

- `Simple = 1`
- `General = 3`
- `Collective = 7`

### Baseline reward

`JobReward = epochEmission(submissionEpoch) * jobWeight`

## Reward Split

- Provider share: `70%`
- Verifier share: `30%`

Verifier share is split evenly across the approving verifier set recorded at PoI finalization time. Any rounding dust is assigned to the provider in v1 to avoid stranded token units.

## Market Reward vs Protocol Reward

### Protocol Reward

- denominated in `KOIN`
- minted only on accepted jobs
- derived from epoch emission and job weight

### Market Reward

- funded by the job creator
- denominated in the native asset used to escrow the job premium
- paid only if the job is accepted
- refundable to the creator if the job is rejected or expires

This separation is a core Koinara rule. Market value is not baked into protocol issuance.
