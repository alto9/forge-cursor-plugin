---
name: initiative-planning
description: >-
  Weekly HLD cycle: assess completeness, propose sign-offs / status lld when all green.
---

# initiative-planning

## When to use

`/forge.initiative-planning`.

## Steps

1. Enumerate `initiatives/*/initiative.md` with status `hld` or `intake`. If none: parent AskQuestion (new-initiative from Icebox/Later, grooming if `lld` waiting, or stay put) before CreatePlan — not an empty successful plan.
2. For each: check feature file, spec, design (if user_facing), security, blocking OQs. Re-examine as of this run; flag stale HLD.
3. Build HLD gate table for the hand-off (pass/fail per role).
4. When all green: propose `signoffs.*` true (designer `na` if not user_facing) and `status: lld`.
5. When not green: recommend specific `/forge.initiative-design` or `/forge.design-spike` next steps; do not invent sign-offs.
6. Fold operator answers into docs/OQs after Phase 1.
7. When event-spawned: propose-only; do not Apply. Plan-delta includes Movement (status flip / OQ progress, or stay-put after idle fork).

## Outputs / stop conditions

Hand-off with gate table + optional status transitions, or parent idle AskQuestion when no HLD work. Stop if path/config unresolved.
