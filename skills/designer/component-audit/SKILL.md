---
name: component-audit
description: >-
  designer procedure: component-audit. Propose-only when spawned from event
  commands; project design-system components into design/components.md.
---

# component-audit

## When to use

Invoked by `/forge.design-system-audit` or the designer agent to inventory design-system components and flag orphans or duplicates.

## Steps

1. Load `figma-mcp`. Read bound theme, `design/screens.md`, and `design/components.md`.
2. Use `search_design_system` and `get_libraries` to list components and variants.
3. Propose `components[]` objects: `name`, `figma_node_id`, `variants[]`, `used_in_screens[]`. Match template `skills/designer/templates/components.md`.
4. Flag gaps in the hand-off Questions: orphans (unused), duplicates, or screens with no component coverage.
5. Prefer Figma over inventing component names. If MCP fails, flag blocker; do not invent inventory.
6. When event-spawned: return a hand-off blob. Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Proposed `design/components.md` and gap list. Stop if no bound theme or path/config unresolved.
