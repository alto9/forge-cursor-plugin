---
name: build-test-plan
description: >-
  quality-assurance procedure: build test plan. For validate-ticket, build an
  ephemeral plan from the issue AC — do not write qa/test-plan.md. Other
  events may still propose memory updates.
---

# build-test-plan

## When to use

Invoked by Forge event commands or the quality-assurance agent for `quality-assurance/build-test-plan`.

## Steps

1. For `/forge.validate-ticket`: build an **ephemeral** check list from the issue body’s Acceptance criteria and Verification. Do **not** read or write `qa/test-plan.md`. Return the plan in the hand-off for this run only.
2. For other events that own durable test-plan memory: read in-scope memory under `memoryRoot/qa/`; propose updates via YAML frontmatter schemas (role template `doc` + schema_version 1); body is expansion-only; bump `updated` when frontmatter changes; empty fields OK.
3. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM is SoT.**
4. When event-spawned: return a hand-off blob. For validate-ticket, Proposed memory edits are none. Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Hand-off blob for the parent command (ephemeral plan and/or proposed memory edits). Stop if path/config unresolved (parent should have run resolve-paths).
