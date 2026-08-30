---
name: compile-ticket-feature
description: >-
  LLD refinement: deepen features/<ticket-slug>.feature and fold Intention + AC
  into the Ready issue body (adds to grooming brief; does not replace it).
---

# compile-ticket-feature

## When to use

`/forge.refinement` for tickets that belong to an initiative (`board_tickets`).

## Steps

1. Locate initiative via issue milestone / initiative.md `board_tickets[]`.
2. Read or deepen `initiatives/<slug>/features/<ticket-slug>.feature` — scenarios for this ticket only.
3. Propose issue body updates: map Feature scenarios into **Intention** (outcome) and **Acceptance criteria** checkboxes; keep full Ready shape via agent-ready-ticket / requirements-writing.
4. Feature files **add to** Intention + AC — they do not replace Out of scope / Constraints / Verification.
5. Never link memory paths from the issue body.
6. When event-spawned: propose-only; do not Apply.

## Outputs / stop conditions

Updated ticket `.feature` + Ready-shaped issue body proposal.
