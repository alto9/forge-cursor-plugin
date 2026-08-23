---
name: theme-bind
description: >-
  designer procedure: theme-bind. Propose-only when spawned from event commands;
  bind submodule app to a Figma theme URL in design/themes.md.
---

# theme-bind

## When to use

Invoked by Forge event commands or the designer agent when an app/submodule needs a Figma design theme URL, or when verifying an existing binding (`/forge.init-project`, `/forge.design-system-audit`, `/forge.refinement` when unbound).

## Steps

1. Read `memoryRoot/design/themes.md` and `forge.json.path` (submodulePath). Match template `skills/designer/templates/themes.md`.
2. Identify the theme row for this app (`app` = submodulePath). If missing, propose a new row.
3. Resolve `figma_url` from the user/orchestrator or existing memory. Parse `figma_file_key` via `figma-mcp`.
4. Verify the file is reachable with Figma MCP (`get_metadata` or `get_libraries`). On success set `status: bound`; on failure set `status: unbound` or `stale` and propose a Question.
5. Propose frontmatter updates (`doc: design.themes`); bump `updated`; leave other apps alone.
6. When event-spawned: return a hand-off blob. Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Proposed `design/themes.md` edit and binding status. Stop Ready promotion for user-facing tickets when the active app has no bound theme (parent Ready gate). Stop if path/config unresolved.
