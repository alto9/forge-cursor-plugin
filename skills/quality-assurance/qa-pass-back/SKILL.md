---
name: qa-pass-back
description: >-
  quality-assurance procedure: pass back. Propose-only when spawned from event commands; touch qa/ docs via templates.
---

# qa-pass-back

## When to use

Invoked by Forge event commands or the quality-assurance agent for `quality-assurance/qa-pass-back`.

## Steps

1. Read in-scope memory under `memoryRoot/qa/` (and related event Docs). Match templates in `skills/quality-assurance/templates/`.
2. Propose updates with required H2s only; empty sections OK; no extra H2s.
3. Current state only — remove stale items; leave files alone if unchanged.
4. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM wins** over memory.
5. Include a one-line **QA verdict** for the parent `/forge.validate-ticket` PR/MR comment (e.g. `QA: pass back — <short reason>; see qa/findings Open/Blockers`). Parent composes the combined FAIL comment.
6. When event-spawned: return a hand-off blob (Intent, Proposed memory edits, Proposed vendor actions, Decisions needed, Left alone). Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Hand-off blob for the parent command (including QA verdict line). Stop if path/config unresolved (parent should have run resolve-paths).
