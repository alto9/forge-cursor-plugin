---
name: forge.design-spike
description: >-
  Per major bet; lead Architect. Forge event command.
---

# forge.design-spike
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
- **Decisions needed** — `None`, or listed options (exactly one marked **already in this apply-set** when options exist)
- **Left alone** — in-scope docs/actions intentionally unchanged
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else (letter, new idea, freeform) reshapes and pauses again. Never Apply a set the user has not seen.

## Event contract

Cadence: Per major bet
Lead: Architect
HITL:
Mode: approve-before-write
Pause when:
    Always — spike question, options, and recommendation require orchestrator call
    Any ADR, overview, interfaces, constraints, or risks change proposed
    Recommendation implies roadmap/backlog/plan change (call out; prefer PO/PM events to apply those)
Instructions:
Frame one structural unknown: question, options, recommendation, done-when — then stop.
Read brief/roadmap/spec and current architecture docs; don’t invent product scope.
Propose tradeoff analysis in the hand-off; propose decisions.md only if the orchestrator locks a choice.
Propose overview/interfaces/constraints/risks updates only for what the spike settles; leave unsettled areas alone.
If the bet is not ready to decide, propose a time-boxed spike entry (question + done-when) and no ADR.
Docs:
<super-repo>/.ai/memory/<submodule>/architecture/overview.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/architecture/interfaces.md
<super-repo>/.ai/memory/<submodule>/architecture/decisions.md
<super-repo>/.ai/memory/<submodule>/architecture/risks.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/product/specs/<feature>.md
Agents:
Architect:
    skills/architect/spike-framing/SKILL.md
    skills/architect/tradeoff-analysis/SKILL.md
    skills/architect/tech-selection/SKILL.md
    skills/architect/change-impact/SKILL.md
    skills/architect/architecture-decision/SKILL.md
Product Owner:
    skills/product-owner/scope-control/SKILL.md
Engineer:
    skills/engineer/implement-ticket/SKILL.md
    skills/engineer/debug/SKILL.md
