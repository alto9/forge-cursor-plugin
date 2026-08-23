---
name: requirements-writing
description: >-
  Expand Refinement briefs into full product Ready bodies during /forge.refinement.
  Not used to mark Ready from grooming alone. Tech spec comments are Architect + Security.
---

# requirements-writing

## When to use

`/forge.refinement` (primary), launch-readiness deepening, or deepening acceptance detail on an existing Ready ticket.

## Steps

1. Start from the board issue in **Refinement** (Intention + Acceptance criteria from grooming).
2. Expand to the full Ready **product** body per **agent-ready-ticket** (Outcome, Scope, AC, Out of scope, Constraints, Verification, Open questions=None).
3. Acceptance criteria must be falsifiable; add edges that would change implementation.
4. **Inline** product constraints and verification into the issue body. Do not rely on or link memory paths. For `ai-ready`, keep body Constraints product-level; detailed stack/interfaces/security go in the tech spec comment (Architect + Security skills — not this skill). For `human-ready`, put enough operational detail in the body since there is no tech spec.
5. For multi-area work, optionally propose `product/specs/<feature>.md` as a memory projection only — never as a ticket dependency or link.
6. Classify executor: `ai-ready` vs `human-ready` (see agent-ready-ticket). Include the label in the hand-off. If `ai-ready`, parent must also complete the tech spec comment gate before promote.
7. Align backlog.md: leave in `# Refinement` until checklist passes, then `# Ready` with board statusIds.ready.
8. When event-spawned: propose-only hand-off; do not Apply.

## Outputs / stop conditions

Full product issue bodies that pass agent-ready-ticket (+ optional memory projections) and a readiness label, or an explicit stay-in-Refinement with failing checklist items.
