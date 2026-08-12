---
name: forge.dependency-audit
description: >-
  Monthly; lead Security. Forge event command.
---

# forge.dependency-audit
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

Cadence: Monthly
Lead: Security
HITL:
Mode: approve-before-write
Pause when:
    findings.md would gain/remove dependency issues
    checklist.md Dependencies gate would change
    Proposed upgrade/removal actions in the submodule (vendor/code) — escalate to approve-before-vendor before applying
Instructions:
Audit dependencies for known issues and risky upgrades; current posture only.
Propose findings.md updates for actionable dependency issues; delete noise and cleared items.
Propose checklist.md Dependencies updates when the recurring gate itself should change.
Recommend upgrade/remove actions in the hand-off; don’t silently bump deps — Engineer/implement-ticket or a dedicated change applies after approval.
Leave threat-model.md alone unless the dependency changes a trust boundary.
Docs:
<super-repo>/.ai/memory/<submodule>/security/findings.md
<super-repo>/.ai/memory/<submodule>/security/checklist.md
<super-repo>/.ai/memory/<submodule>/security/threat-model.md
Agents:
Security:
    skills/security/dependency-audit/SKILL.md
    skills/security/security-pass-back/SKILL.md
    skills/security/security-approve-change/SKILL.md
Engineer:
    skills/engineer/implement-ticket/SKILL.md
