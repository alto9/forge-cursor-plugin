---
name: forge.refinement
description: >-
  On demand / as needed; lead Product Owner. Expand Refinement-column tickets into
  self-contained Ready work labeled ai-ready or human-ready.
---

# forge.refinement
Sibling to `/forge.backlog-grooming`. Grooming lands high-level Intention + Acceptance in **Refinement**; this event builds full low-level tickets and promotes to **Ready** with an executor label.

## Parent execution model

1. Run skills `resolve-paths` → `sync-memory` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRepoRoot, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM; then run `commit-memory` (push memory-repo `main`) if memory files changed. Never Apply invalid templates.


### Hand-off shape (required)

Two phases; see README Hand-off shape. Parent only; subagents propose-only.

**Phase 1 — Questions** (when forks exist): prefer host AskQuestion when available; else markdown. One named question per fork; lettered options with `(Recommended)` first. Nothing written. Letter / Other / freeform → redirect and ask again. Skip when no forks. Do not put approve all in the picker.

**Phase 2 — Apply-set** (after answers, or when Phase 1 skipped):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Questions** — `None`
- **Left alone** — in-scope docs/actions intentionally unchanged
- **Ready gate** — issue id | pass/fail | failing checklist items | proposed label (`ai-ready` | `human-ready`)
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else reshapes and pauses again (may re-open Questions). Never Apply a set the user has not seen.

## Event contract

Cadence: On demand (after grooming; before implement-ticket)
Lead: Product Owner
HITL:
Mode: approve-before-vendor
Pause when:
    Expanding issue bodies to self-contained Ready shape
    Moving board status Refinement → Ready (or back to Refinement/Blocked)
    Applying ai-ready / human-ready labels
    Memory spec projection created or materially edited
    Open product/tech decisions that block Ready
Instructions:
Bind to the **active submodule** only. Do not refine other configured projects in this run; the orchestrator invokes the command again per path.
Work the board **Refinement** column (forge.json statusIds.refinement) — pull issue ids from board + backlog.md # Refinement.
For each selected item: expand grooming brief into a full self-contained Ready body via skills/product-owner/agent-ready-ticket + requirements-writing. Issue body must stand alone — no links to memory paths.
Architect: propose Constraints / interface facts **to inline** into the issue body (from architecture docs); call out design gaps (may spawn design-spike instead of Ready).
Engineer (optional collaborator): propose Verification steps and flag missing implementation detail — propose-only, no coding here.
Classify executor: exactly one of `ai-ready` | `human-ready` (forge.json labels.aiReady / labels.humanReady).
Only checklist **pass** → vendor move to statusIds.ready, apply the readiness label (strip the other), + backlog.md # Ready. Failures stay Refinement or Blocked; never promote weak tickets.
Optionally create/edit product/specs/<feature>.md as a memory projection when multi-area — never link it from the issue. Open questions must be empty before Ready.
HITL must include Ready gate table (pass/fail + label). Do not claim ready for /forge.implement-ticket unless promoting with `ai-ready`.
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
