---
name: forge.launch-readiness-check
description: >-
  Per release; lead Product Owner. Forge event command.
---

# forge.launch-readiness-check
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
Lead: Product Owner
HITL:
Mode: approve-before-write
Pause when:
    Always — go / no-go / ship-with-exceptions is a required orchestrator decision
    Any memory edit proposed for specs, backlog, status, milestones, brief, metrics, architecture, qa, security, or release docs
Instructions:
Recommend go / no-go / ship-with-exceptions; hand off to release/QA/security owners after Apply.
Read brief.md and metrics.md for intended outcome; propose edits only if launch forces a scope/success-metric correction.
Propose specs/<feature>.md updates so Requirements/Acceptance/Out of scope match what is actually shipping; remove acceptance items you are explicitly not shipping.
Propose backlog.md updates: pull must-haves still open into focus; remove or Icebox items cut from this release.
Propose status.md / milestones.md updates to reflect ship reality; clear met milestones and finished in-flight items after the call.
Architect: structural go/no-go — read overview/constraints/interfaces/risks; propose architecture/risks or decisions updates only if ship reality changes the locked shape; flag unresolved structural risks that should block launch.
QA: report queue/findings/test-plan posture for the release; open blockers or unapproved Ready-for-QA items should weigh against go; propose qa doc edits only to clear stale Approved/Passed back noise for this ship call.
Security: report threat-model/findings/checklist posture; open Blockers should weigh against go; propose security doc edits only for release-gate truth.
Release Manager: report checklist/notes/status for the version target; call out ship blockers and missing notes; propose release doc edits to match the go/no-go call (not the vendor publish — that’s cut-release).
Docs:
<super-repo>/.ai/memory/<submodule>/product/specs/<feature>.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/product/metrics.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/project/status.md
<super-repo>/.ai/memory/<submodule>/project/milestones.md
<super-repo>/.ai/memory/<submodule>/architecture/overview.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/architecture/interfaces.md
<super-repo>/.ai/memory/<submodule>/architecture/risks.md
<super-repo>/.ai/memory/<submodule>/architecture/decisions.md
<super-repo>/.ai/memory/<submodule>/qa/queue.md
<super-repo>/.ai/memory/<submodule>/qa/findings.md
<super-repo>/.ai/memory/<submodule>/qa/test-plan.md
<super-repo>/.ai/memory/<submodule>/security/threat-model.md
<super-repo>/.ai/memory/<submodule>/security/findings.md
<super-repo>/.ai/memory/<submodule>/security/checklist.md
<super-repo>/.ai/memory/<submodule>/release/checklist.md
<super-repo>/.ai/memory/<submodule>/release/notes.md
<super-repo>/.ai/memory/<submodule>/release/status.md
Agents:
Product Owner:
    skills/product-owner/launch-readiness/SKILL.md
    skills/product-owner/scope-control/SKILL.md
Project Manager:
    skills/project-manager/status-update/SKILL.md
    skills/project-manager/handoff-coordination/SKILL.md
Architect:
    skills/architect/review-design/SKILL.md
    skills/architect/technical-risk/SKILL.md
    skills/architect/constraint-mapping/SKILL.md
Quality Assurance:
    skills/quality-assurance/verify-acceptance/SKILL.md
    skills/quality-assurance/regression-check/SKILL.md
    skills/quality-assurance/qa-approve-change/SKILL.md
Security:
    skills/security/security-review/SKILL.md
    skills/security/security-approve-change/SKILL.md
    skills/security/security-pass-back/SKILL.md
Release Manager:
    skills/release-manager/release-checklist/SKILL.md
    skills/release-manager/write-release-notes/SKILL.md
    skills/release-manager/version-plan/SKILL.md
