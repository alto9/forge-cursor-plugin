---
name: qa-approve-change
description: >-
  quality-assurance procedure: approve change. When spawned from
  validate-ticket, return a verdict only — no memory edits.
---

# qa-approve-change

## When to use

Invoked by Forge event commands or the quality-assurance agent for `quality-assurance/qa-approve-change`.

## Steps

1. Verify the change against the issue body’s acceptance criteria and any ephemeral checks from this run. Do **not** read or write `qa/` memory for `/forge.validate-ticket`.
2. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM is SoT.**
3. Include a one-line **QA verdict** for the parent `/forge.validate-ticket` PR/MR comment (e.g. `QA: approve — acceptance checks passed`). Parent composes the combined PASS/FAIL comment and auto-Applies.
4. When event-spawned from validate-ticket: return Intent + QA verdict + Proposed vendor actions (none — parent posts the comment). Do **not** propose memory edits. Do **not** Apply, pause with the orchestrator, or mutate SCM.
5. For other events that still use memory (e.g. regression-pass): propose template-shaped `qa/` updates as those event Docs require.

## Outputs / stop conditions

Plan-delta blob for the parent command (including QA verdict line). Stop if path/config unresolved (parent should have run resolve-paths).
