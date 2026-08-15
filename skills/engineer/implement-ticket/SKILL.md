---
name: implement-ticket
description: >-
  Implement one ai-ready board ticket in the submodule. Stop if not Ready,
  not ai-ready, or the issue body fails the Ready gate. Claim In Progress
  immediately after the gate; move to In Review when the PR/MR is ready.
---

# implement-ticket

## When to use

`/forge.implement-ticket` or Engineer agent when taking Ready + `ai-ready` work.

## Steps

1. Load the board issue body (vendor get). The issue body is the sole contract — do not require linked memory specs.
2. Gate:
   - Status must be Ready (`statusIds.ready`).
   - Label must be `ai-ready` (or `forge.json` `labels.aiReady`). If `human-ready` (or missing readiness label) → **stop**; hand off that a human must execute (or send back to `/forge.refinement` to classify).
   - Body must pass `skills/product-owner/agent-ready-ticket`. If Refinement or checklist fail → **stop**. Hand off to `/forge.refinement`; do not invent scope.
3. **Claim (parent Applies immediately, no HITL):** After gate pass, parent Applies board → `statusIds.in_progress` via `vendor-issues-write`, then mirrors memory (`engineering/in-flight.md` `# Active`, `product/backlog.md` `# In progress`). If gate failed, do **not** claim.
4. Optionally read architecture/memory for session context; never treat memory paths as ticket dependencies. Implement the smallest change that meets Acceptance criteria + Verification from the **issue body**.
5. When ready for verification: propose PR/MR open/update, board → `statusIds.in_review`, in-flight remove from `# Active` + set `# Review state`, qa/queue.md → Ready for QA. Keep backlog under `# In progress` until merge. HITL gates this step; on approve, Apply vendor/SCM first then memory. Next command: `/forge.validate-ticket`.
6. When event-spawned: propose-only for coding/PR/In Review hand-offs; do not Apply until parent Apply (except the parent’s early In Progress claim).

## Outputs / stop conditions

Code/tests meeting acceptance with board In Progress → In Review, or a stop hand-off if not Ready + `ai-ready`.
