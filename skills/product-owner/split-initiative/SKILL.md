---
name: split-initiative
description: >-
  LLD: split an HLD-complete initiative (status lld) into actionable Refinement
  tickets + host milestone + per-ticket feature stubs.
---

# split-initiative

## When to use

`/forge.backlog-grooming` when an initiative has `status: lld`.

## Steps

1. Read `initiatives/<slug>/initiative.md`. If status is not `lld` → **fail closed**; recommend `/forge.initiative-planning`.
2. Read HLD package: `features/initiative.feature`, `spec.md`, `security.md`, and `design.md` when user_facing.
3. Propose N actionable board issues (Intention + AC from scenario groups). Never create epic/umbrella issues.
4. Propose create/reuse **one host milestone** for the initiative; assign all issues.
5. Propose `features/<ticket-slug>.feature` stubs (one per ticket) under the initiative folder — LLD refinement will deepen them and compile into AC.
6. Update initiative.md `board_milestone` and `board_tickets[]` (issue ids/titles after vendor create — parent Apply order: vendor first, then memory).
7. When event-spawned: propose-only; do not Apply.

## Outputs / stop conditions

Vendor issue + milestone ops + ticket feature stubs + initiative board refs, or hard stop if not LLD-ready.
