---
name: refinement-design-check
description: >-
  designer procedure: refinement-design-check. Propose-only; enrich Ready issue
  body inline with Figma refs, states, a11y AC; propose design Ready gate.
---

# refinement-design-check

## When to use

During `/forge.refinement` for **user-facing** tickets (UI flows, visual states, accessibility, interaction). Skip (propose design: **N/A**) for backend-only or non-visual work. Invoked by the Designer agent; parent merges into the issue body — **no** `<!-- forge-design-spec -->` comment.

## Steps

1. Classify the ticket: user-facing vs not. If not user-facing, return design gate **N/A**, structure **N/A**, and Left alone for design docs.
2. Load `figma-mcp`. Read `design/themes.md`, `design/structure.md`, `design/screens.md`, `design/components.md`, `design/principles.md`. Ensure the active app theme is bound (`theme-bind` if unbound).
3. For user-facing **`ai-ready`**: run `design-structure-check` (loads `design-structure`). Structural fail → design gate **fail**; list concrete gaps in Questions (e.g. missing Variables page, unbound theme).
4. Use Figma MCP to find relevant frames/components for the Outcome/Scope. Prefer existing inventory; query Figma when inventory is thin.
5. Propose **inline** issue-body additions (PO owns product boundaries; Designer owns UX/interaction/Figma refs):
   - Scope: Figma file URL + node refs for primary screens
   - AC: visual states (empty, error, loading, success), responsive notes, a11y checks from `design/principles.md`
   - Verification: how to confirm against the linked frames
   - Facts must stand alone in the body — no links to memory paths
6. Propose Ready gate **design: pass / fail / N/A** and **structure: pass / fail / N/A**:
   - **design pass** (user-facing): theme bound, relevant frames referenced, states covered, a11y in AC; for **`ai-ready`**, structure must also pass
   - **structure pass:** `design-structure-check` gaps empty (bound file, required pages, naming patterns, component categories)
   - **N/A:** non-user-facing (both rows)
   - **fail** (`ai-ready` user-facing): unbound/stale theme, MCP blocker, missing frames/states/a11y, or structural fail — stay Refinement
7. For **`human-ready`** user-facing tickets: design enrichment is recommended; do not hard-fail solely because Figma MCP is unavailable or structure is incomplete if a human executor owns UX — note gaps in Questions and prefer pass with explicit left-alone MCP/structure gap, or fail only when frames/refs are required and missing. Structure row may be **fail** (advisory) without blocking when the parent keeps the softer human-ready rule.
8. UX gaps (unclear flows, missing states) → stay Refinement or recommend `/forge.design-spike` for **flow exploration**. Technical/structural (Architect) gaps remain Architect’s (`write-tech-spec` / design-spike). File-structure gaps stay Designer’s.
9. When event-spawned: return a plan-delta blob with Intent, Proposed memory edits (usually `design/structure.md` when checked), Proposed vendor actions (none — parent writes issue body), Left alone, **proposed body deltas**, **design gate**, and **structure gate**. Do **not** Apply, pause with the orchestrator, or mutate SCM.

## Outputs / stop conditions

Proposed inline body deltas + design/structure Ready gates for the parent. For user-facing **`ai-ready`**, fail blocks Ready when theme, ticket design context, or file structure is insufficient. Content differences across apps never fail structure. Stop if path/config unresolved.
