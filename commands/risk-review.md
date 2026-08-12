---
name: risk-review
description: >-
  Weekly; lead Project Manager. Forge event command.
---

# risk-review

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
Lead: Project Manager
HITL:
Mode: propose
Pause when:
    Risks/issues/dependencies added or removed
    status.md or plan.md would change from risk posture
Instructions:
Keep risks.md as live posture only — not a history log.
Propose risks.md updates: add only active Risks/Issues/Dependencies/Assumptions; delete resolved, expired, or irrelevant rows (no “mitigated on …” archive).
Propose status.md / plan.md edits only when risk posture changes delivery (new blocker, resequence, handoff); otherwise leave them alone.
Docs:
<super-repo>/.ai/memory/<submodule>/project/risks.md
<super-repo>/.ai/memory/<submodule>/project/plan.md
<super-repo>/.ai/memory/<submodule>/project/status.md
Agents:
Project Manager:
    skills/project-manager/risk-tracking/SKILL.md
    skills/project-manager/dependency-management/SKILL.md
    skills/project-manager/blocker-resolution/SKILL.md
