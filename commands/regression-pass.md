---
name: regression-pass
description: >-
  Per release; lead Quality Assurance. Forge event command.
---

# regression-pass

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

Cadence: Per release
Lead: Quality Assurance
HITL:
Mode: approve-before-write
Pause when:
    Always — regression pass / fail / ship-with-known-issues call required
    test-plan.md or findings.md would change
    Open blockers that should stop launch-readiness
Instructions:
Run regression focus for the release against test-plan.md; not a full re-verification of every historical ticket.
Propose findings.md updates for new regressions only; delete cleared items; escalate Needs product call when acceptance is ambiguous.
Propose test-plan.md Regression focus / Environments updates when the release changes what must stay green; remove obsolete regression checks.
Propose queue.md cleanup: drop Approved items that are already shipped after the release call; don’t keep an approved archive.
Hand the regression call into launch-readiness-check; don’t invent product go/no-go here.
Release Manager: read release/status + checklist; propose Known issues / Blockers updates only when regression outcome changes ship readiness; leave version/publish steps to prepare-release / cut-release.
Docs:
<super-repo>/.ai/memory/<submodule>/qa/test-plan.md
<super-repo>/.ai/memory/<submodule>/qa/findings.md
<super-repo>/.ai/memory/<submodule>/qa/queue.md
<super-repo>/.ai/memory/<submodule>/product/specs/<feature>.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/project/milestones.md
<super-repo>/.ai/memory/<submodule>/release/status.md
<super-repo>/.ai/memory/<submodule>/release/checklist.md
<super-repo>/.ai/memory/<submodule>/release/notes.md
Agents:
Quality Assurance:
    skills/quality-assurance/regression-check/SKILL.md
    skills/quality-assurance/verify-acceptance/SKILL.md
    skills/quality-assurance/reproduce-bug/SKILL.md
    skills/quality-assurance/qa-pass-back/SKILL.md
    skills/quality-assurance/qa-approve-change/SKILL.md
Release Manager:
    skills/release-manager/release-checklist/SKILL.md
    skills/release-manager/write-release-notes/SKILL.md
