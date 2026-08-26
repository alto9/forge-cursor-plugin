---
name: grooming-design-triage
description: >-
  designer procedure: grooming-design-triage. Propose-only; classify likely
  user-facing tickets during backlog-grooming; note Design required at
  refinement; warn if theme unbound. No Figma MCP required.
---

# grooming-design-triage

## When to use

During `/forge.backlog-grooming` when shaping Intention + AC into Refinement.
Lightweight attend only — not a second refinement pass. Invoked by the Designer
agent; PO still owns Intention + AC.

## Steps

1. Read the proposed grooming brief (Intention + Acceptance criteria + Notes) and `memoryRoot/design/themes.md` for the active app.
2. Classify likely **user-facing** (UI flows, visual states, accessibility, interaction) vs not. Prefer a short note over deep Figma work.
3. If **user-facing**: propose a Notes line such as `Design: required at refinement` (and optionally that frames/states will be inlined at Ready). Do not expand Scope/Verification or invent Figma node ids here.
4. If the active app theme is **unbound** (or missing) and any groomed item looks user-facing: add a Question or Notes warning that Ready for `ai-ready` will need a bound Figma theme + structure pass — do not block grooming or Refinement column move.
5. Do **not** require Figma MCP at grooming. Do not run `design-structure-check` unless the parent explicitly asks.
6. When event-spawned: return a hand-off blob with triage classification, proposed Notes deltas (via parent vendor issue update), Questions (theme unbound warning when relevant), Left alone. Do **not** Apply, HITL, or mutate SCM.

## Outputs / stop conditions

Triage signal for parent merge into issue Notes / Questions. Stop if path/config unresolved. Never claim design Ready gate here — that is `/forge.refinement`.
