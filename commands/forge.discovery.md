---
name: forge.discovery
description: >-
  Monthly; lead Product Owner. Forge event command.
---

# forge.discovery
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

Cadence: Monthly
Lead: Product Owner
HITL:
Mode: approve-before-write
Pause when:
    insights.md / personas.md / backlog.md / brief.md would change
    Promoting discovery into backlog candidates
Instructions:
Run or synthesize discovery against open questions; no work invented from thin anecdotes.
Propose insights.md updates: replace stale Themes/Evidence/Implications; remove Open questions that are answered.
Propose personas.md edits only with durable evidence; delete personas/segments you are not actually designing for.
Propose backlog.md changes only for validated promotions; remove speculative items discovery disproved.
Propose brief.md edits only when who/problem clearly changed; otherwise leave brief.md alone.
Docs:
<super-repo>/.ai/memory/<submodule>/product/insights.md
<super-repo>/.ai/memory/<submodule>/product/personas.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
Agents:
Product Owner:
    skills/product-owner/discovery/SKILL.md
    skills/product-owner/problem-framing/SKILL.md
    skills/product-owner/feedback-synthesis/SKILL.md
