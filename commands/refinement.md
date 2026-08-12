---
name: refinement
description: >-
  On demand / as needed; lead Product Owner. Expand Refinement-column tickets into agent-ready Ready work.
---

# refinement

Sibling to `backlog-grooming`. Grooming lands high-level Intention + Acceptance in **Refinement**; this event builds full low-level tickets and promotes to **Ready**.

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
- **Ready gate** — issue id | pass/fail | failing checklist items

Orchestrator reply gates Apply: approve all | approve subset | reject | redirect.


## Event contract

Cadence: On demand (after grooming; before implement-ticket)
Lead: Product Owner
HITL:
Mode: approve-before-vendor
Pause when:
    Expanding issue bodies to agent-ready shape
    Moving board status Refinement → Ready (or back to Refinement/Blocked)
    Spec created or materially edited
    Open product/tech decisions that block Ready
Instructions:
Work the board **Refinement** column (forge.json statusIds.refinement) — pull issue ids from board + backlog.md # Refinement.
For each selected item: expand grooming brief into full agent-ready body via skills/product-owner/agent-ready-ticket + requirements-writing.
Architect: propose Constraints / interface pointers from architecture docs; call out design gaps (may spawn design-spike instead of Ready).
Engineer (optional collaborator): propose Verification steps and flag missing implementation detail — propose-only, no coding here.
Only checklist **pass** → vendor move to statusIds.ready + backlog.md # Ready. Failures stay Refinement or Blocked; never promote weak tickets.
Create/edit product/specs/<feature>.md when multi-area; Open questions must be empty before Ready.
HITL must include Ready gate table. Do not claim ready for /implement-ticket unless promoting to Ready.
Do not run high-level prioritization/Icebox cleanup here — that is backlog-grooming.
Docs:
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/product/specs/<feature>.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/architecture/interfaces.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
Agents:
Product Owner:
    skills/product-owner/agent-ready-ticket/SKILL.md
    skills/product-owner/requirements-writing/SKILL.md
    skills/product-owner/scope-control/SKILL.md
Architect:
    skills/architect/constraint-mapping/SKILL.md
    skills/architect/interface-contracts/SKILL.md
    skills/architect/change-impact/SKILL.md
Engineer:
    skills/engineer/write-tests/SKILL.md
# Engineer here only to stress-test Verification / testability — no code or branch writes in this event
