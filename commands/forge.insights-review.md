---
name: forge.insights-review
description: >-
  Monthly; lead Product Owner. Forge event command. (Renamed from forge.discovery.)
---

# forge.insights-review
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

Cadence: Monthly
Lead: Product Owner
HITL:
Mode: approve-before-write
Pause when:
    insights.md / personas.md / backlog.md / brief.md would change
    Promoting validated insights into backlog candidates
Instructions:
Synthesize insights against open questions and evidence; no work invented from thin anecdotes.
This is research synthesis (insights, personas, brief promotions) — **not** initiative intake. Large ideas → `/forge.new-initiative`.
Propose insights.md updates: replace stale Themes/Evidence/Implications; remove Open questions that are answered.
Propose personas.md edits only with durable evidence; delete personas/segments you are not actually designing for.
Propose backlog.md changes only for validated promotions; remove speculative items evidence disproved.
Propose brief.md edits only when who/problem clearly changed; otherwise leave brief.md alone.
Designer: attend with design-principles — sync persona UX implications into design/principles.md when who you design for moved; leave principles alone when personas did not move.
Docs:
<super-repo>/.ai/memory/<submodule>/product/insights.md
<super-repo>/.ai/memory/<submodule>/product/personas.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/design/principles.md
Agents:
Product Owner:
    skills/product-owner/insights-review/SKILL.md
    skills/product-owner/problem-framing/SKILL.md
    skills/product-owner/feedback-synthesis/SKILL.md
Designer:
    skills/designer/design-principles/SKILL.md
