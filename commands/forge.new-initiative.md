---
name: forge.new-initiative
description: >-
  On demand; lead Product Owner. Create initiatives/<slug>/ HLD stub — no board tickets.
---

# forge.new-initiative
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
- **Proposed vendor actions** — none (intake creates memory only)
- **Questions** — `None`
- **Left alone** — in-scope docs/actions intentionally unchanged
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else reshapes and pauses again (may re-open Questions). Never Apply a set the user has not seen.

## Event contract

Cadence: On demand
Lead: Product Owner
HITL:
Mode: approve-before-write
Pause when:
    Creating initiatives/<slug>/ stub
    Choosing slug / title / user_facing
Instructions:
Bind to the **active submodule** only.
Intake a large idea into HLD: create `initiatives/<slug>/` from templates — `initiative.md` (status=`hld`, signoffs false / designer `na` when not user-facing), `open-questions.md`, `spec.md`, `design.md`, `security.md`, `features/initiative.feature` stub.
Derive slug from title (kebab-case); confirm slug and user_facing under Questions when ambiguous.
Do **not** create board issues, milestones, or readiness labels.
Do **not** mark sign-offs true — that is `/forge.initiative-planning`.
Suggested next: `/forge.initiative-design` (incremental HLD) and weekly `/forge.initiative-planning`.
Docs:
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/initiative.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/open-questions.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/spec.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/design.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/security.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/features/initiative.feature
<super-repo>/.ai/memory/<submodule>/product/open-questions.md
Agents:
Product Owner:
    skills/product-owner/new-initiative/SKILL.md
    skills/product-owner/problem-framing/SKILL.md
    skills/product-owner/outcome-definition/SKILL.md
