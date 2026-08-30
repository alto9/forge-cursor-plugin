---
name: new-initiative
description: >-
  Create initiatives/<slug>/ HLD stub from templates. No board tickets.
  Propose-only when event-spawned.
---

# new-initiative

## When to use

`/forge.new-initiative` when a large idea needs an HLD workspace.

## Steps

1. Confirm slug (kebab-case), title, and `user_facing` with the parent (Questions when ambiguous).
2. If `initiatives/<slug>/` already exists → stop; report conflict; do not overwrite.
3. Propose create from templates:
   - `initiative.md` — status `hld`, signoffs po/architect/security false; designer `na` if not user_facing else false
   - `open-questions.md`, `spec.md`, `design.md`, `security.md` (empty stubs)
   - `features/initiative.feature` from `skills/product-owner/templates/initiative.feature`
4. Optionally refresh `product/open-questions.md` rollup if empty seed missing (init-memory usually seeds it).
5. Proposed vendor actions: **none**.
6. When event-spawned: propose-only hand-off; do not Apply.

## Outputs / stop conditions

Initiative folder stub ready for `/forge.initiative-design`, or hard stop on path/config/slug conflict.
