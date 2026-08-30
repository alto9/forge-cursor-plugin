---
name: initiative-design-check
description: >-
  Designer: enrich initiatives/<slug>/design.md and confirm Figma screens for user-facing HLD.
---

# initiative-design-check

## When to use

`/forge.initiative-design` and `/forge.initiative-planning` when `user_facing: true`.

## Steps

1. Skip (N/A) when initiative is not user-facing — leave design.md alone; signoffs.designer stays `na`.
2. When user-facing: use figma-mcp / screen-inventory as needed; propose `design.md` with figma_file, screens, states, a11y.
3. Prefer **pre-built screens** in Figma before HLD exit; note gaps as blocking open questions if screens missing.
4. When event-spawned: propose-only; do not Apply; do not flip signoffs.

## Outputs / stop conditions

Design.md proposal and/or blocking OQs for missing frames/states.
