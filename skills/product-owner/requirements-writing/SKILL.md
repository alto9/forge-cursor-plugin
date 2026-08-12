---
name: requirements-writing
description: >-
  Expand Refinement briefs into full requirements and specs during /refinement
  (agent-ready bodies). Not used to mark Ready from grooming alone.
---

# requirements-writing

## When to use

`/refinement` (primary), launch-readiness spec edits, or deepening acceptance detail on an existing Ready ticket.

## Steps

1. Start from the board issue in **Refinement** (Intention + Acceptance criteria from grooming).
2. Expand to the full agent-ready body per **agent-ready-ticket** (Outcome, Scope, AC, Out of scope, Constraints, Verification, Open questions=None).
3. Acceptance criteria must be falsifiable; add edges that would change implementation.
4. For multi-area work, propose `product/specs/<feature>.md` from the template; clear Open questions before Ready.
5. Align backlog.md: leave in `# Refinement` until checklist passes, then `# Ready` with board statusIds.ready.
6. When event-spawned: propose-only hand-off; do not Apply.

## Outputs / stop conditions

Full issue bodies (+ optional specs) that pass agent-ready-ticket, or an explicit stay-in-Refinement with failing checklist items.
