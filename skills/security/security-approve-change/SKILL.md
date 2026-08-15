---
name: security-approve-change
description: >-
  security procedure: approve change. Propose-only when spawned from event commands; touch security/ docs via templates.
---

# security-approve-change

## When to use

Invoked by Forge event commands or the security agent for `security/security-approve-change`.

## Steps

1. Read in-scope memory under `memoryRoot/security/` (and related event Docs). Match templates in `skills/security/templates/`.
2. Propose updates with required H2s only; empty sections OK; no extra H2s.
3. Current state only — remove stale items; leave files alone if unchanged.
4. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM wins** over memory.
5. Include a one-line **Security verdict** for the parent `/forge.validate-ticket` PR/MR comment (e.g. `Security: approve — checklist gates for this change passed`). Parent composes the combined PASS/FAIL comment.
6. When event-spawned: return a hand-off blob (Intent, Proposed memory edits, Proposed vendor actions, Decisions needed, Left alone). Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Hand-off blob for the parent command (including Security verdict line). Stop if path/config unresolved (parent should have run resolve-paths).
