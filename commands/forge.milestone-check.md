---
name: forge.milestone-check
description: >-
  Per milestone; lead Project Manager. Forge event command.
---

# forge.milestone-check
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

Cadence: Per milestone
Lead: Project Manager
HITL:
Mode: approve-before-write
Pause when:
    Always — met / at risk / slipped is a required orchestrator decision
    milestones.md, status.md, plan.md, or risks.md would change
Instructions:
Prefer host milestone state (GitHub/GitLab) as SoT; memory milestones.md is a projection.
Recommend milestone call: met, at risk, or slipped. Escalate scope/priority to PO events — don’t rewrite product intent here.
Propose host milestone close/reopen/date updates when needed; never create epic/umbrella issues.
Propose milestones.md updates to match host: remove met milestones from Active; move failed timing to Slipped then resolve (re-date into Upcoming or delete if abandoned). Reference host milestone URL + issue ids.
Propose status.md updates to match the call; clear finished in-flight work tied to a met milestone.
Propose plan.md / risks.md edits only when slip/risk changes execution; delete risks closed by meeting the milestone.
Docs:
<super-repo>/.ai/memory/<submodule>/project/milestones.md
<super-repo>/.ai/memory/<submodule>/project/status.md
<super-repo>/.ai/memory/<submodule>/project/plan.md
<super-repo>/.ai/memory/<submodule>/project/risks.md
Agents:
Project Manager:
    skills/project-manager/milestone-tracking/SKILL.md
    skills/project-manager/status-update/SKILL.md
    skills/project-manager/risk-tracking/SKILL.md
