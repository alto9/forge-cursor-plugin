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

1. Classify the ticket: user-facing vs not. If not user-facing, return design gate **N/A** and Left alone for design docs.
2. Load `figma-mcp`. Read `design/themes.md`, `design/screens.md`, `design/components.md`, `design/principles.md`. Ensure the active app theme is bound (`theme-bind` if unbound).
3. Use Figma MCP to find relevant frames/components for the Outcome/Scope. Prefer existing inventory; query Figma when inventory is thin.
4. Propose **inline** issue-body additions (PO owns product boundaries; Designer owns UX/interaction/Figma refs):
   - Scope: Figma file URL + node refs for primary screens
   - AC: visual states (empty, error, loading, success), responsive notes, a11y checks from `design/principles.md`
   - Verification: how to confirm against the linked frames
   - Facts must stand alone in the body — no links to memory paths
5. Propose Ready gate **design: pass / fail / N/A**:
   - **pass:** theme bound, relevant frames referenced, states covered, a11y in AC
   - **N/A:** non-user-facing
   - **fail:** missing theme, missing frames, or MCP blocker on an `ai-ready` user-facing ticket — stay Refinement
6. For **`human-ready`** user-facing tickets: design enrichment is recommended; do not hard-fail solely because Figma MCP is unavailable if a human executor owns UX — note the gap in Questions and prefer pass with explicit left-alone MCP gap, or fail only when frames/refs are required and missing.
7. UX gaps (unclear flows, missing states) → stay Refinement or recommend `/forge.design-spike` for **flow exploration**. Technical/structural gaps remain Architect’s (`write-tech-spec` / design-spike).
8. When event-spawned: return a hand-off blob with Intent, Proposed memory edits (usually none), Proposed vendor actions (none — parent writes issue body), Questions, Left alone, **proposed body deltas**, and **design gate**. Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Proposed inline body deltas + design Ready gate for the parent. Fail gate blocks Ready promotion for user-facing work that lacks design context. Stop if path/config unresolved.
