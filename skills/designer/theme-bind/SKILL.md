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
3. Resolve `figma_url` from the user/orchestrator or existing memory. Ask for the Figma URL for user-facing apps. Defer unbound only via explicit HITL (“no Figma file yet”); then propose `design/structure.md` with `structure_status: fail` and gap `"no theme bound"`.
4. Parse `figma_file_key` via `figma-mcp`. When `status: bound`, `figma_url` and `figma_file_key` must both be non-empty.
5. Verify the file is reachable with Figma MCP (`get_metadata` or `get_libraries`). On success set `status: bound`; on failure set `status: unbound` or `stale` and propose a Question.
6. Propose frontmatter updates (`doc: design.themes`); bump `updated`; leave other apps alone.
7. After a successful bind (init-project, audit, or refinement repair), run `design-structure-check` to seed/refresh `design/structure.md`.
8. When event-spawned: return a hand-off blob. Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Proposed `design/themes.md` edit, binding status, and optional `design/structure.md`. Stop Ready promotion for user-facing **`ai-ready`** tickets when the active app has no bound theme or structure fails (parent Ready gate). Stop if path/config unresolved.
