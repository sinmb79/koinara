# Koinara Protocol Glossary

## MAI

`Minimum Acceptable Inference`. The minimum protocol threshold for recognizing a submission as valid.

## PoI

`Proof of Inference`. A protocol record showing that MAI was achieved for a submission.

## Inference Job

The basic unit of demand in Koinara. A job defines the request, schema reference, deadline, type, and optional premium reward.

## Provider

The actor that submits the response hash for a job.

## Verifier

An actor that checks whether the submission meets the minimum protocol rules and either approves or rejects it.

## KOIN

The protocol token minted only through accepted inference reward distribution.

## Protocol Reward

Baseline `KOIN` issuance calculated by the epoch emission schedule and job weight.

## Market Reward

User-funded premium reward attached to a job. In v1 it is paid to the accepted provider and kept separate from KOIN issuance.

## Epoch

The emission time bucket used to scale baseline protocol issuance over time.

## Fair Launch

Koinara launches without pre-mine, founder allocation, or admin mint privileges.

## Ownerless Direction

The protocol minimizes privileged control paths. v1 keeps only one-time wiring for deployment and removes admin control afterward.
