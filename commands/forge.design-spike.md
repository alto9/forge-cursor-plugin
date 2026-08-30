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

Two phases; see README Hand-off shape. Parent only; subagents propose-only.

**Phase 1 — Questions** (when forks exist): prefer host AskQuestion when available; else markdown. One named question per fork; lettered options with `(Recommended)` first. Nothing written. Letter / Other / freeform → redirect and ask again. Skip when no forks. Do not put approve all in the picker.

**Phase 2 — Apply-set** (after answers, or when Phase 1 skipped):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Questions** — `None`
- **Left alone** — in-scope docs/actions intentionally unchanged
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else reshapes and pauses again (may re-open Questions). Never Apply a set the user has not seen.

## Event contract

Cadence: Per major bet / during HLD when one unknown blocks sign-off
Lead: Architect
HITL:
Mode: approve-before-write
Pause when:
    Always — spike question, options, and recommendation require orchestrator call
    Any ADR, overview, interfaces, constraints, or risks change proposed
    Initiative spec/design updates proposed
    Recommendation implies roadmap/backlog/plan change (call out; prefer PO/PM events to apply those)
Instructions:
Frame one structural unknown: question, options, recommendation, done-when — then stop.
Read brief/roadmap and current architecture docs; prefer `initiatives/<slug>/spec.md` (and design.md for UX) over legacy `product/specs/<feature>.md`. Don’t invent product scope.
Propose tradeoff analysis in the hand-off; propose decisions.md only if the orchestrator locks a choice.
Propose overview/interfaces/constraints/risks updates only for what the spike settles; leave unsettled areas alone.
Fold settled answers into initiative `spec.md` / `design.md` / `open-questions.md` when an initiative is in scope.
If the bet is not ready to decide, propose a time-boxed spike entry (question + done-when) and no ADR.
**UX flow exploration:** when the unknown is product-surface (flows, states, frames) rather than structure, Designer attends with figma-mcp / screen-inventory / design-principles. Architect remains Lead for structural spikes; Designer leads UX findings in the hand-off merge under Lead (Architect) unless Instructions redirect.
Docs:
<super-repo>/.ai/memory/<submodule>/architecture/overview.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/architecture/interfaces.md
<super-repo>/.ai/memory/<submodule>/architecture/decisions.md
<super-repo>/.ai/memory/<submodule>/architecture/risks.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/spec.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/design.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/open-questions.md
<super-repo>/.ai/memory/<submodule>/product/specs/<feature>.md
<super-repo>/.ai/memory/<submodule>/design/themes.md
<super-repo>/.ai/memory/<submodule>/design/screens.md
<super-repo>/.ai/memory/<submodule>/design/principles.md
Agents:
Architect:
    skills/architect/spike-framing/SKILL.md
    skills/architect/tradeoff-analysis/SKILL.md
    skills/architect/tech-selection/SKILL.md
    skills/architect/change-impact/SKILL.md
    skills/architect/architecture-decision/SKILL.md
    skills/architect/write-initiative-spec/SKILL.md
Product Owner:
    skills/product-owner/scope-control/SKILL.md
Designer:
    skills/designer/figma-mcp/SKILL.md
    skills/designer/screen-inventory/SKILL.md
    skills/designer/design-principles/SKILL.md
    skills/designer/initiative-design-check/SKILL.md
# Designer when spike is UX/flow exploration; optional for pure structural spikes
Engineer:
    skills/engineer/implement-ticket/SKILL.md
    skills/engineer/debug/SKILL.md
