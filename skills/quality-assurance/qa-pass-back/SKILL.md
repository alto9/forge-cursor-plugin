---
name: qa-pass-back
description: >-
  quality-assurance procedure: pass back. When spawned from validate-ticket,
  return a verdict only — no memory edits. SCM comment is the audit trail.
---

# qa-pass-back

## When to use

Invoked by Forge event commands or the quality-assurance agent for `quality-assurance/qa-pass-back`.

## Steps

1. Identify why the change fails acceptance. Do **not** read or write `qa/` memory for `/forge.validate-ticket` — the FAIL PR/MR comment is the audit trail.
2. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM is SoT.**
3. Include a one-line **QA verdict** for the parent `/forge.validate-ticket` PR/MR comment (e.g. `QA: pass back — <short reason>`). Parent composes the combined FAIL comment and auto-Applies. Board stays In Review.
4. When event-spawned from validate-ticket: return Intent + QA verdict + Proposed vendor actions (none — parent posts the comment). Do **not** propose memory edits. Do **not** Apply, HITL, or mutate SCM.
5. For other events that still use memory: propose template-shaped `qa/` updates as those event Docs require.

## Outputs / stop conditions

Hand-off blob for the parent command (including QA verdict line). Stop if path/config unresolved (parent should have run resolve-paths).
