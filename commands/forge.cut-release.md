---
name: forge.cut-release
description: >-
  Per release; lead Release Manager. Forge event command.
---

# forge.cut-release
## Parent execution model

1. Run skills `resolve-paths` → `sync-memory` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRepoRoot, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM; then run `commit-memory` (push memory-repo `main`) if memory files changed. Never Apply invalid templates.


### Hand-off shape (required)

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Decisions needed** — yes/no or A/B
- **Left alone** — in-scope docs/actions intentionally unchanged

Orchestrator reply gates Apply: approve all | approve subset | reject | redirect.


## Event contract

Cadence: Per release
Lead: Release Manager
HITL:
Mode: approve-before-vendor
Pause when:
    Always — explicit orchestrator OK to publish
    Tag/release/publish vendor actions
    Version bump or changelog commits in the submodule
    release/status.md would move to Shipped
    Waiving any unsatisfied pre-cut gate from release.gates[]
Instructions:
Publish the prepared release only when forge.json pre-cut gates (before cut-release in release.gates[]) are satisfied — or orchestrator explicitly waives gaps in HITL.
If release.gates is unset/empty: rely on release/checklist.md + orchestrator OK only (no implied QA/security/marketing order).
Propose vendor actions: tag, GitHub/GitLab release, any required release PR/commit — list them explicitly before Apply.
Propose release/status.md → Shipped and clear Blockers/Ready for this version; clear checklist Pre-ship items that are done; don’t keep prior release narratives.
Propose notes.md finalization for what actually shipped; remove planned items that didn’t make the cut.
After ship, leave submodule code/tag as source of truth; memory holds only current/next release posture.
Post-cut gates (e.g. launch-comms, outcomes-retro) are separate commands — cut-release does not run them.
Docs:
<super-repo>/.ai/memory/<submodule>/release/checklist.md
<super-repo>/.ai/memory/<submodule>/release/notes.md
<super-repo>/.ai/memory/<submodule>/release/status.md
<super-repo>/.ai/memory/<submodule>/qa/queue.md
<super-repo>/.ai/memory/<submodule>/security/checklist.md
<super-repo>/.ai/memory/<submodule>/project/milestones.md
Agents:
Release Manager:
    skills/release-manager/cut-release/SKILL.md
    skills/release-manager/publish-release/SKILL.md
    skills/release-manager/release-checklist/SKILL.md
    skills/release-manager/write-release-notes/SKILL.md
Engineer:
    skills/engineer/update-branch/SKILL.md
