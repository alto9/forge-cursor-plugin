---
name: forge.initiative-planning
description: >-
  Weekly; lead Product Owner. Cycle HLD initiatives — open-question Q&A,
  recommendations, detect all role sign-offs green → propose status lld.
---

# forge.initiative-planning
## Parent execution model

1. Run skills `resolve-paths` → `sync-memory` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRepoRoot, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM; then run `commit-memory` (push memory-repo `main`) if memory files changed. Never Apply invalid templates.


### Hand-off shape (required)

Two phases; see README Hand-off shape. Parent only; subagents propose-only.

**Phase 1 — Questions** (when forks exist): prefer host AskQuestion when available; else markdown. One named question per fork; lettered options with `(Recommended)` first. Nothing written. Letter / Other / freeform → redirect and ask again. Skip when no forks. Do not put approve all in the picker. Prefer surfacing **blocking** open questions from HLD initiatives.

**Phase 2 — Apply-set** (after answers, or when Phase 1 skipped):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create (include OQ answers folded into docs; rollup refresh; sign-offs / status when all green)
- **Proposed vendor actions** — none
- **Questions** — `None`
- **HLD gate** — per initiative: sign-offs table (po|architect|designer|security) + blocking OQs remaining
- **Left alone** — in-scope docs/actions intentionally unchanged
- **How to reply** — required footer; see README Hand-off shape

Reply: **approve all** / **approve subset** Applies this set; **reject** Applies nothing; anything else reshapes and pauses again (may re-open Questions). Never Apply a set the user has not seen.

## Event contract

Cadence: Weekly
Lead: Product Owner
HITL:
Mode: approve-before-write
Pause when:
    Answering or deferring open questions
    Proposing sign-off flips or status hld → lld
    Recommendations that change priority across initiatives
Instructions:
Bind to the **active submodule** only.
List all `initiatives/*/initiative.md` with `status: hld` (and `intake` if any).
Run open-questions-rollup → refresh `product/open-questions.md` from per-initiative `open-questions.md`.
Surface blocking open questions to Phase 1; fold answers into initiative docs and remove/answer OQ entries; deferred stay with status deferred.
Recommend next `/forge.initiative-design` targets and stale initiatives.
**HLD exit (all green):** for an initiative, propose `signoffs` true (designer true or `na` when not user_facing) and `status: lld` only when:
  - PO: `features/initiative.feature` has real scenarios (not stub-only)
  - Architect: `spec.md` summary/approach non-empty and open_questions empty or non-blocking
  - Designer: screens/Figma present when user_facing, else signoffs.designer remains `na`
  - Security: `security.md` summary non-empty
  - No blocking questions with status open
Do not create board tickets here — LLD starts with `/forge.backlog-grooming` after status is `lld`.
Suggested next after HLD→LLD: `/forge.backlog-grooming` for that initiative.
Docs:
<super-repo>/.ai/memory/<submodule>/initiatives/*/initiative.md
<super-repo>/.ai/memory/<submodule>/initiatives/*/open-questions.md
<super-repo>/.ai/memory/<submodule>/initiatives/*/spec.md
<super-repo>/.ai/memory/<submodule>/initiatives/*/design.md
<super-repo>/.ai/memory/<submodule>/initiatives/*/security.md
<super-repo>/.ai/memory/<submodule>/initiatives/*/features/initiative.feature
<super-repo>/.ai/memory/<submodule>/product/open-questions.md
Agents:
Product Owner:
    skills/product-owner/initiative-planning/SKILL.md
    skills/product-owner/open-questions-rollup/SKILL.md
    skills/product-owner/decision-hygiene/SKILL.md
Architect:
    skills/architect/write-initiative-spec/SKILL.md
# Attend to assess whether spec is complete enough for sign-off
Designer:
    skills/designer/initiative-design-check/SKILL.md
# Attend when any HLD initiative is user_facing
Security:
    skills/security/initiative-security-spec/SKILL.md
