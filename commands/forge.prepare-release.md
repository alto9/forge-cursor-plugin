---
name: forge.prepare-release
description: >-
  Per release; lead Release Manager. Forge event command.
---

# forge.prepare-release
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
Mode: approve-before-write
Pause when:
    Version target, checklist, notes, or release status would change
    Missing configured release.gates called out as blockers
Instructions:
Assemble the next release: version target, pre-ship checklist, notes draft, readiness status.
Read forge.json release.gates[] (if set) as this submodule's checklist — only require gates listed before cut-release; skip unlisted events.
When gates unset/empty: assemble notes/checklist from whatever inputs exist; do not invent a global pipeline.
Read configured gate outputs (QA queue, security findings, milestones, etc.) as inputs.
Propose release/checklist.md, notes.md, and status.md for the current cut only; clear leftover items from a prior shipped release.
Don’t publish/tag here — that’s cut-release after configured pre-cut gates are green (or explicitly waived).
Don’t rewrite product brief/roadmap; pull change summaries into notes.md Changes/Breaking/Known issues only.
Docs:
<super-repo>/.ai/memory/<submodule>/release/checklist.md
<super-repo>/.ai/memory/<submodule>/release/notes.md
<super-repo>/.ai/memory/<submodule>/release/status.md
<super-repo>/.ai/memory/<submodule>/qa/queue.md
<super-repo>/.ai/memory/<submodule>/qa/findings.md
<super-repo>/.ai/memory/<submodule>/security/findings.md
<super-repo>/.ai/memory/<submodule>/security/checklist.md
<super-repo>/.ai/memory/<submodule>/project/milestones.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
Agents:
Release Manager:
    skills/release-manager/version-plan/SKILL.md
    skills/release-manager/release-checklist/SKILL.md
    skills/release-manager/write-release-notes/SKILL.md
    skills/release-manager/rollback-plan/SKILL.md
Quality Assurance:
    skills/quality-assurance/qa-approve-change/SKILL.md
Security:
    skills/security/security-approve-change/SKILL.md
Product Owner:
    skills/product-owner/launch-readiness/SKILL.md
