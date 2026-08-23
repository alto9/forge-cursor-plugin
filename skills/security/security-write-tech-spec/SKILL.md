---
name: security-write-tech-spec
description: >-
  Security: propose Security-owned sections of the Forge tech spec comment
  for ai-ready refinement. Propose-only; parent merges and posts.
---

# security-write-tech-spec

## When to use

During `/forge.refinement` when the proposed readiness label is **`ai-ready`**. Skip for `human-ready`. Invoked by the Security agent; parent merges with Architect sections and posts via `vendor-issues-comment`.

Template: `skills/forge/templates/tech-spec.md` (document format only — not GitHub Spec Kit tooling).

## Steps

1. Read the draft Ready **issue body** and in-scope security memory under `memoryRoot/security/` (`threat-model.md`, `findings.md`, `checklist.md` as needed). Related architecture/product docs are **read-only** for context.
2. Propose Security-owned sections of the tech spec comment, matching the template:
   - Security Context (assets, trust boundaries, data sensitivity — inlined facts; no memory paths)
   - Threat Considerations
   - Security Requirements (`SR-001` … — concrete, checkable)
   - Security Verification (how each SR is proven)
3. Fill every mandatory Security section; no `[NEEDS CLARIFICATION]` placeholders. If a safety decision is blocked on product or architecture, put it under Questions for the parent (escalate to PO/Architect) rather than inventing scope.
4. Do **not** rewrite product or architecture memory during this skill unless the parent event separately proposes those edits. Prefer leaving security memory alone unless a finding must be recorded as a projection.
5. When event-spawned: return a hand-off blob with Intent, Proposed memory edits (usually none), Proposed vendor actions (none — parent posts), Questions, Left alone, and the **proposed Security sections** markdown. Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Proposed Security sections for the parent merge. Incomplete Security sections → parent must not promote as `ai-ready`. Stop if path/config unresolved (parent should have run resolve-paths).
