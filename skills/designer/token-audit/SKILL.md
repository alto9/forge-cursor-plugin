---
name: token-audit
description: >-
  designer procedure: token-audit. Propose-only when spawned from event commands;
  project Figma variables into design/tokens.md; flag gaps.
---

# token-audit

## When to use

Invoked by `/forge.design-system-audit` or the designer agent to refresh the token inventory from Figma.

## Steps

1. Load `figma-mcp`. Read bound theme from `memoryRoot/design/themes.md`.
2. Call `get_variable_defs` (and related tools as needed) for the theme file.
3. Propose updates to `memoryRoot/design/tokens.md` via template `skills/designer/templates/tokens.md`: fill `color`, `typography`, `spacing`, `radius`, `elevation` from Figma **values**. Put naming/structure misses in `design/structure.md` via `design-structure-check` — do not invent token values to fill structure gaps. Use `gaps[]` only for optional inventory notes (e.g. thin coverage within a present family), not required pattern failures.
4. When the parent wants structure compliance refreshed (audit, init after bind, refinement ai-ready gate), also run `design-structure-check` (loads `design-structure`).
5. Prefer Figma values over inventing tokens. If MCP fails, leave files alone (or note prior projection) and flag the blocker; do not invent values.
6. Bump `updated` on frontmatter change. Set theme `last_audited` when the parent also updates themes.
7. When event-spawned: return a hand-off blob. Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Proposed `design/tokens.md` (and optional themes last_audited / structure.md). Stop if no bound theme or path/config unresolved.
