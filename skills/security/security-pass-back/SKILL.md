---
name: security-pass-back
description: >-
  security procedure: pass back. When spawned from validate-ticket, return a
  verdict only — no memory edits. SCM comment is the audit trail.
---

# security-pass-back

## When to use

Invoked by Forge event commands or the security agent for `security/security-pass-back`.

## Steps

1. Identify why the change fails security expectations. Do **not** read or write `security/` memory for `/forge.validate-ticket` — the FAIL PR/MR comment is the audit trail.
2. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM is SoT.**
3. Include a one-line **Security verdict** for the parent `/forge.validate-ticket` PR/MR comment (e.g. `Security: pass back — <short reason>`). Parent composes the combined FAIL comment and auto-Applies. Board stays In Review; Security vetoes merge.
4. When event-spawned from validate-ticket: return Intent + Security verdict + Proposed vendor actions (none — parent posts the comment). Do **not** propose memory edits. Do **not** Apply, pause with the orchestrator, or mutate SCM.
5. For other events that still use memory: propose template-shaped `security/` updates as those event Docs require.

## Outputs / stop conditions

Plan-delta blob for the parent command (including Security verdict line). Stop if path/config unresolved (parent should have run resolve-paths).
