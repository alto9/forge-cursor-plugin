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
3. Propose updates to `memoryRoot/design/tokens.md` via template `skills/designer/templates/tokens.md`: fill `color`, `typography`, `spacing`, `radius`, `elevation`; list missing expected sets in `gaps`.
4. Prefer Figma values over inventing tokens. If MCP fails, leave files alone (or note prior projection) and flag the blocker; do not invent values.
5. Bump `updated` on frontmatter change. Set theme `last_audited` when the parent also updates themes.
6. When event-spawned: return a hand-off blob. Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Proposed `design/tokens.md` (and optional themes last_audited). Stop if no bound theme or path/config unresolved.
