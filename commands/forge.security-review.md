---
name: forge.security-review
description: >-
  On demand; lead Security. Forge event command.
---

# forge.security-review
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

Cadence: On demand
Lead: Security
HITL:
Mode: approve-before-write
Pause when:
    Always — security approve or pass-back required
    findings.md / checklist.md / threat-model.md would change
    Vendor comments or secret-scan follow-ups proposed
# If mutating GitHub/GitLab (comments, alerts), escalate Mode to approve-before-vendor.
Instructions:
Review a change or surface (PR/MR, config, dependency bump) for security issues against checklist + threat-model.
Call: approve or pass back — no silent OK.
On approve: propose clearing related Open findings; note checklist gates that passed for this change only if durable.
On pass-back: propose findings.md Open/Blockers with impact + fix intent; remove findings that no longer apply.
Propose threat-model.md updates only when assets/boundaries/threats actually changed; delete obsolete threats/mitigations.
Don’t rewrite product/architecture docs; escalate design-level issues to Architect/PO events.
Docs:
<super-repo>/.ai/memory/<submodule>/security/findings.md
<super-repo>/.ai/memory/<submodule>/security/checklist.md
<super-repo>/.ai/memory/<submodule>/security/threat-model.md
<super-repo>/.ai/memory/<submodule>/engineering/in-flight.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/product/specs/<feature>.md
Agents:
Security:
    skills/security/security-review/SKILL.md
    skills/security/secret-scan/SKILL.md
    skills/security/harden-config/SKILL.md
    skills/security/security-pass-back/SKILL.md
    skills/security/security-approve-change/SKILL.md
Engineer:
    skills/engineer/respond-to-review/SKILL.md
