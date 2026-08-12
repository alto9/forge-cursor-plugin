---
name: requirements-writing
description: >-
  Expand Refinement briefs into full requirements during /forge.refinement
  (self-contained Ready bodies). Not used to mark Ready from grooming alone.
---

# requirements-writing

## When to use

`/forge.refinement` (primary), launch-readiness deepening, or deepening acceptance detail on an existing Ready ticket.

## Steps

1. Start from the board issue in **Refinement** (Intention + Acceptance criteria from grooming).
2. Expand to the full Ready body per **agent-ready-ticket** (Outcome, Scope, AC, Out of scope, Constraints, Verification, Open questions=None).
3. Acceptance criteria must be falsifiable; add edges that would change implementation.
4. **Inline** all constraints and verification detail into the issue body. Do not rely on or link memory paths.
5. For multi-area work, optionally propose `product/specs/<feature>.md` as a memory projection only — never as a ticket dependency or link.
6. Classify executor: `ai-ready` vs `human-ready` (see agent-ready-ticket). Include the label in the hand-off.
7. Align backlog.md: leave in `# Refinement` until checklist passes, then `# Ready` with board statusIds.ready.
8. When event-spawned: propose-only hand-off; do not Apply.

## Outputs / stop conditions

Full self-contained issue bodies that pass agent-ready-ticket (+ optional memory projections) and a readiness label, or an explicit stay-in-Refinement with failing checklist items.
