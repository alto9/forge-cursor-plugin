---
name: screen-inventory
description: >-
  designer procedure: screen-inventory. Propose-only when spawned from event
  commands; catalog Figma frames into design/screens.md.
---

# screen-inventory

## When to use

Invoked by `/forge.design-system-audit` or the designer agent to keep a current screen/frame catalog.

## Steps

1. Load `figma-mcp`. Read bound theme and existing `memoryRoot/design/screens.md`.
2. Use `get_metadata`, `get_design_context`, and/or `search_design_system` to enumerate key frames/pages for the app.
3. Propose `screens[]` objects: `name`, `figma_node_id`, `app`, `states[]`, `responsive[]`. Match template `skills/designer/templates/screens.md`.
4. Current state only — remove frames that no longer exist in Figma; leave unchanged files alone.
5. When event-spawned: return a hand-off blob. Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Proposed `design/screens.md`. Stop if no bound theme or path/config unresolved.
