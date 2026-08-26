---
name: design-structure-check
description: >-
  designer procedure: design-structure-check. Propose-only when spawned from
  event commands; verify bound Figma file against design-structure expectations
  via MCP; project compliance into design/structure.md.
---

# design-structure-check

## When to use

Invoked by `/forge.design-system-audit`, `/forge.init-project` (after theme-bind),
`/forge.refinement` (via `refinement-design-check` for user-facing `ai-ready`),
and by `token-audit` / `component-audit` when structure compliance must be refreshed.
Load `figma-mcp` and `design-structure` first.

## Steps

1. Read `memoryRoot/design/themes.md`. Identify the theme row for this app (`app` = submodulePath).
2. If no row or `status` is `unbound` (or missing URL/key): structure **fail**. Propose `design/structure.md` with `structure_status: fail`, gap `"no theme bound"`, empty found lists, and today's `last_checked`. Stop Ready promotion for user-facing `ai-ready` (parent gate).
3. If `status: stale` or MCP cannot open the file: structure **fail**; gap describing MCP/theme blocker; set or keep theme stale as needed. Do not invent pages or tokens.
4. With a bound reachable file, load `design-structure` expectations and verify via MCP:
   - Pages: `get_metadata` (and related) — fuzzy-match required page roles
   - Variables: `get_variable_defs` — fuzzy-match naming pattern families (names only)
   - Components: `search_design_system` / `get_libraries` — fuzzy-match Button, Text input, Link categories
5. Build `structure_gaps[]` as short human-readable strings (e.g. `"missing Tokens/Variables page"`, `"no semantic color variables matching color/*"`, `"missing Button category"`).
6. Propose `memoryRoot/design/structure.md` matching template `skills/designer/templates/structure.md`:
   - `structure_status`: `pass` if gaps empty; else `fail`
   - `structure_gaps`, `required_pages_found`, `required_variable_patterns_missing`, `required_component_categories_missing`
   - `last_checked`: today (YYYY-MM-DD); bump `updated`
7. Prefer Figma over inventing inventory. If MCP fails mid-check, leave prior structure projection alone (or mark fail with MCP gap) and flag the blocker in Questions.
8. When event-spawned: return a hand-off blob with structural pass/fail + gaps. Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Proposed `design/structure.md` and structural pass/fail for the parent. For user-facing **`ai-ready`** tickets, structural **fail** blocks Ready (`design: fail`). Content differences (colors, logos) never fail this check. Stop if path/config unresolved.
