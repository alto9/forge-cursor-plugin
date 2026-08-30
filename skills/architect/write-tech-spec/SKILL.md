---
name: write-tech-spec
description: >-
  Architect: propose Architect-owned sections of the Forge tech spec comment
  for ai-ready refinement. Propose-only; parent merges and posts.
---

# write-tech-spec

## When to use

During `/forge.refinement` when the proposed readiness label is **`ai-ready`**. Skip for `human-ready`. Invoked by the Architect agent; parent merges with Security sections and posts via `vendor-issues-comment`.

Template: `skills/forge/templates/tech-spec.md` (document format only — not GitHub Spec Kit tooling).

## Steps

1. Read the draft Ready **issue body** (product contract) and in-scope architecture memory under `memoryRoot/architecture/` (`constraints.md`, `interfaces.md`, `overview.md`, `decisions.md`, `risks.md` as needed). When the ticket belongs to an initiative, also read `initiatives/<slug>/spec.md` and **slice** relevant approach/interfaces/structure into the comment — do not link the memory path.
2. Propose Architect-owned sections of the tech spec comment, following the template structure and preserving the header marker `<!-- forge-tech-spec:v1 -->`:
   - Summary
   - Technical Context (all fields filled; no `[NEEDS CLARIFICATION]`)
   - Constitution Check (inline hard constraints and interface facts — copy facts; never link memory paths)
   - Project Structure (real submodule dirs + Structure Decision)
   - Interfaces / Change Impact (optional but preferred when seams move)
   - Complexity Tracking (only if a constitution violation needs justification)
3. Reuse judgment from `constraint-mapping`, `interface-contracts`, and `change-impact`. Facts must be self-contained in the comment.
4. If design gaps remain (unclear approach, missing interface, spike needed): **do not** mark Constitution Check as pass. Propose Questions for the parent and recommend `/forge.design-spike` instead of Ready.
5. When event-spawned: return a hand-off blob with Intent, Proposed memory edits (usually none for this skill), Proposed vendor actions (none — parent posts), Questions, Left alone, and the **proposed tech spec markdown** (Architect sections). Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Proposed Architect sections for the parent merge. Stop Ready promotion (via parent) when Constitution Check fails or clarifications remain. Stop if path/config unresolved (parent should have run resolve-paths).
