---
name: write-initiative-feature
description: >-
  Author or deepen initiatives/<slug>/features/initiative.feature (Gherkin) during HLD.
---

# write-initiative-feature

## When to use

`/forge.initiative-design` (primary). One Feature file per initiative at HLD.

## Steps

1. Read `initiatives/<slug>/initiative.md` and existing `features/initiative.feature`.
2. Replace stub scenarios with real behavior: Feature + Scenarios covering the initiative ask.
3. Keep Gherkin valid for phase-1 checks (`Feature:` + at least one `Scenario:`).
4. Put unresolved product forks in `open-questions.md` (blocking as appropriate); do not leave TBD in scenarios that must be true for sign-off.
5. Do not create ticket-level `.feature` files here — that is LLD grooming/refinement.
6. When event-spawned: propose-only; do not Apply; do not flip signoffs.

## Outputs / stop conditions

Updated `initiative.feature` proposal, or explicit gaps listed as open questions.
