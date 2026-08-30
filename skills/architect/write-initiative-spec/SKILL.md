---
name: write-initiative-spec
description: >-
  Architect: author initiatives/<slug>/spec.md (HLD technical implementation details).
---

# write-initiative-spec

## When to use

`/forge.initiative-design`, `/forge.initiative-planning` (assess completeness), `/forge.design-spike`.

## Steps

1. Read initiative.md, feature file, architecture constraints/interfaces as context.
2. Propose `spec.md` updates: summary, approach, interfaces, structure, constraints; leave open_questions empty when settled.
3. Do not post ticket tech-spec comments here — that is LLD `/forge.refinement` (slice from this doc).
4. Unsettled technical forks → `open-questions.md` on the initiative (blocking when they block HLD exit).
5. When event-spawned: propose-only; do not Apply; do not flip signoffs.

## Outputs / stop conditions

Updated `spec.md` proposal or explicit incomplete sections for the planning gate.
