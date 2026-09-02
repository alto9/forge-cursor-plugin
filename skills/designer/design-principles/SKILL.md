---
name: design-principles
description: >-
  designer procedure: design-principles. Propose-only when spawned from event
  commands; maintain design/principles.md (a11y, interaction patterns).
---

# design-principles

## When to use

Invoked by `/forge.insights-review`, `/forge.init-project`, `/forge.design-system-audit`, or the designer agent when UX/a11y rules need updating.

## Steps

1. Read `memoryRoot/design/principles.md`, related `product/personas.md` / `product/brief.md` when in event Docs. Match template `skills/designer/templates/principles.md`.
2. Propose updates to `principles`, `a11y_rules`, `interaction_patterns`, `anti_patterns` (string arrays). Current state only.
3. Do not invent product scope; align with brief/personas. Leave file alone if unchanged.
4. When event-spawned: return a plan-delta blob. Do **not** Apply, pause with the orchestrator, or mutate SCM.

## Outputs / stop conditions

Proposed `design/principles.md`. Stop if path/config unresolved.
