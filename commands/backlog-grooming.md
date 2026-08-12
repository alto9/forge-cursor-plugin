---
name: backlog-grooming
description: >-
  Weekly; lead Product Owner. Forge event command.
---

# backlog-grooming

## Parent execution model

1. Run skills `resolve-paths` then `resolve-config` (fail closed on path ambiguity).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM. Never Apply invalid templates.


### Hand-off shape (required)

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Decisions needed** — yes/no or A/B
- **Left alone** — in-scope docs/actions intentionally unchanged

Orchestrator reply gates Apply: approve all | approve subset | reject | redirect.


## Event contract

Cadence: Weekly
Lead: Product Owner
HITL:
Mode: approve-before-write
Pause when:
    Ready/In progress priority changes
    Items removed (won't-do / delete) or moved to Icebox
    Spec created or deleted
    plan.md sequence changes
# If vendor ticket updates are in scope for the session, escalate Mode to approve-before-vendor.
Instructions:
# Primary path to fine detail: repeat until Ready items have clear acceptance (spec when needed).
Read roadmap.md for focus; propose roadmap edits only if grooming exposes a clear conflict (otherwise leave for roadmap-review).
Propose backlog.md changes: re-rank In progress/Ready; remove shipped, duplicate, or won't-do items (no done archive here — delete or Icebox).
Propose create/edit specs/<feature>.md only for Ready work that lacks acceptance detail; propose delete for killed work or features no longer in flight.
Propose plan.md Sequence/Dependencies only when backlog order changes delivery order; otherwise leave plan.md alone.
Coarse items from init-project are expected — split, clarify, or Icebox them here; don’t require perfect specs on day one.
Docs:
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/product/specs/<feature>.md
<super-repo>/.ai/memory/<submodule>/project/plan.md
Agents:
Product Owner:
    skills/product-owner/prioritization/SKILL.md
    skills/product-owner/requirements-writing/SKILL.md
    skills/product-owner/scope-control/SKILL.md
Project Manager:
    skills/project-manager/sequencing/SKILL.md
    skills/project-manager/work-planning/SKILL.md
