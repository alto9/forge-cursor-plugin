---
name: figma-mcp
description: >-
  designer procedure: Figma MCP usage. Propose-only when spawned from event
  commands; query Figma via plugin-figma-figma; never invent tokens or frames.
---

# figma-mcp

## When to use

Invoked by Forge event commands or the designer agent whenever Figma is the source of truth for themes, tokens, screens, or components. Load this skill before any other designer Figma work.

## MCP namespace

Use **`plugin-figma-figma`**. Discover tool schemas before calling. Authenticate with `mcp_auth` only when the namespace reports needsAuth.

## Prerequisite Cursor skills (when available)

Load the matching Figma skill before the named tool:

| Before tool | Load skill |
|---|---|
| `use_figma` | figma-use |
| `get_design_context` | figma-design-to-code |
| `generate_diagram` | figma-generate-diagram |
| Design-system build | figma-generate-library |
| Code Connect | figma-code-connect |

## Tool selection (read / audit)

| Goal | Prefer |
|---|---|
| Variables / tokens | `get_variable_defs` |
| Component / style search | `search_design_system` |
| Screen / frame structure for a node | `get_design_context`, `get_metadata` |
| Visual check | `get_screenshot` |
| Library inventory | `get_libraries` |

Write tools (`use_figma`, `generate_figma_design`, `create_new_file`) only when the parent event and HITL explicitly ask to mutate Figma. Audit and refinement skills are **read-first**.

## URL parsing

From a Figma URL:

- `figma.com/design/:fileKey/:fileName?node-id=:nodeId` → fileKey; convert node-id `-` to `:`
- `figma.com/design/:fileKey/branch/:branchKey/...` → use branchKey as fileKey
- `figma.com/board/...` → FigJam; use `get_figjam` when needed

Store `figma_url` and `figma_file_key` on `design/themes.md` theme rows.

## Steps

1. Confirm the active submodule theme in `memoryRoot/design/themes.md` (or bind via `theme-bind` first).
2. Call Figma MCP tools for the goal; do not invent token names, node ids, or frame lists when MCP is available.
3. If MCP is unavailable or the file is inaccessible: propose memory-only notes and flag an explicit blocker (Ready gate fail or N/A with reason). Never fabricate Figma facts.
4. Project durable facts into `design/*` templates when the parent event owns those docs. **Figma wins** over stale memory; update memory to match Figma, do not “fix” Figma from memory.
5. When event-spawned: return a hand-off blob. Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

MCP-backed facts and/or explicit MCP blockers for the parent. Stop if path/config unresolved (parent should have run resolve-paths).
