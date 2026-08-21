---
name: security-approve-change
description: >-
  security procedure: approve change. When spawned from validate-ticket,
  return a verdict only — no memory edits.
---

# security-approve-change

## When to use

Invoked by Forge event commands or the security agent for `security/security-approve-change`.

## Steps

1. Verify the PR/MR against security expectations for this change (secrets, authn/z, config hardening as needed). Do **not** read or write `security/` memory for `/forge.validate-ticket`.
2. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM is SoT.**
3. Include a one-line **Security verdict** for the parent `/forge.validate-ticket` PR/MR comment (e.g. `Security: approve — checklist gates for this change passed`). Parent composes the combined PASS/FAIL comment and auto-Applies.
4. When event-spawned from validate-ticket: return Intent + Security verdict + Proposed vendor actions (none — parent posts the comment / merge). Do **not** propose memory edits. Do **not** Apply, HITL, or mutate SCM.
5. For other events that still use memory (e.g. security-review): propose template-shaped `security/` updates as those event Docs require.

## Outputs / stop conditions

Hand-off blob for the parent command (including Security verdict line). Stop if path/config unresolved (parent should have run resolve-paths).
