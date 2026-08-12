---
name: implement-ticket
description: >-
  Implement one ai-ready board ticket in the submodule. Stop if not Ready,
  not ai-ready, or the issue body fails the Ready gate.
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
3. Optionally read architecture/memory for session context; never treat memory paths as ticket dependencies. Implement the smallest change that meets Acceptance criteria + Verification from the **issue body**.
4. Propose in-flight / QA queue updates per the parent command. **Board/SCM wins** over memory.
5. When event-spawned: propose-only hand-off; do not Apply until parent Apply.

## Outputs / stop conditions

Code/tests meeting acceptance, or a stop hand-off if not Ready + `ai-ready`.
