---
name: architecture-review
description: >-
  Biweekly; lead Architect. Forge event command.
---

# architecture-review

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

Cadence: Biweekly
Lead: Architect
HITL:
Mode: approve-before-write
Pause when:
    overview.md / constraints.md / interfaces.md / risks.md would change
    New or superseded ADR in decisions.md
Instructions:
Reconcile architecture memory with code and near-term roadmap/plan — current shape only.
Propose overview.md updates when major components, data flow, or deployment shape drifted; remove obsolete components rather than archiving them in-file.
Propose constraints.md / interfaces.md rewrites to current truth; delete constraints/interfaces that no longer apply; clear finished Contracts in flight.
Propose risks.md updates for structural risks only (not delivery blockers — those stay in project/risks.md); delete resolved structural risks.
Propose decisions.md entries only when a decision actually landed or was superseded; do not narrate deliberation.
Read product roadmap and project plan as inputs; don’t edit product/project docs here (redirect to roadmap-review / plan-refresh).
Docs:
<super-repo>/.ai/memory/<submodule>/architecture/overview.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/architecture/interfaces.md
<super-repo>/.ai/memory/<submodule>/architecture/decisions.md
<super-repo>/.ai/memory/<submodule>/architecture/risks.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/project/plan.md
Agents:
Architect:
    skills/architect/system-design/SKILL.md
    skills/architect/constraint-mapping/SKILL.md
    skills/architect/interface-contracts/SKILL.md
    skills/architect/architecture-decision/SKILL.md
    skills/architect/technical-risk/SKILL.md
