---
name: forge.stakeholder-sync
description: >-
  Weekly; lead Product Owner. Forge event command.
---

# forge.stakeholder-sync
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
    brief.md / roadmap.md / backlog.md would change
    status.md or risks.md would drop or add material items
# Always pause for the “still true / changed” call even if proposed edits are empty.
Instructions:
Align on intent vs delivery; hand-off must lead with “still true / changed.”
Propose brief.md edits only when who/problem/goals/non-goals/current focus actually changed — not for status color commentary.
Propose roadmap.md / backlog.md edits only for decisions that change priority or cuts; remove killed items from Now/Ready rather than striking through.
Propose status.md and risks.md updates to current delivery truth; delete cleared blockers/risks/issues (do not keep resolved history in-file).
Docs:
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/project/status.md
<super-repo>/.ai/memory/<submodule>/project/risks.md
Agents:
Product Owner:
    skills/product-owner/stakeholder-alignment/SKILL.md
    skills/product-owner/roadmapping/SKILL.md
    skills/product-owner/decision-hygiene/SKILL.md
Project Manager:
    skills/project-manager/status-update/SKILL.md
    skills/project-manager/risk-tracking/SKILL.md
