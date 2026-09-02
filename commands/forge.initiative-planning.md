---
name: forge.initiative-planning
description: >-
  Weekly; lead Product Owner. Cycle HLD initiatives — open-question Q&A,
  recommendations, detect all role sign-offs green → propose status lld.
---

# forge.initiative-planning
## Parent execution model

1. Resolve target via `resolve-paths` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure). Prefer Cursor **Plan Mode** for research and the plan delta (request SwitchMode to `plan` if invoked in Agent without an accepted plan for this event). Do **not** write memory or mutate vendor/SCM during Plan. Skip `sync-memory` until Accept — Apply pulls then.
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath (or group members), memoryRepoRoot, memoryRoot / groupRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not pause with the orchestrator, must not mutate vendor/SCM.
3. Merge subagent proposals into one plan delta. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
4. AskQuestion on forks when needed; then present the **plan delta** via CreatePlan when available, else markdown. See Plan shape below. Nothing is written yet.
5. After **Accept (build):** run `sync-memory` first; if pulled files diverge from the accepted plan, fail closed and return to Plan. Then `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM; then run `commit-memory` (push memory-repo `main`) if memory files changed. Never Apply invalid templates. **Adjust** reshapes the plan; **Cancel** Applies nothing.

### Plan shape (required)

Cursor **Plan Mode** when available; markdown fallback otherwise (CLI / Auto / cloud). Parent only; subagents propose-only. See README Plan shape. No writes until Accept.

**Plan delta** (reviewable — not a full file dump):

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / create / remove + the material change only (include high-stakes wording when Accept must mean that copy)
- **Proposed vendor actions** — none, or explicit list
- **Left alone** — in-scope docs/actions intentionally unchanged
- Event extras when the command defines them (Ready gate, HLD gate, Refinement queue, …) as tables — not pasted tickets

After the plan exists, only three options:

- **Accept (build)** — Apply exactly this plan. Whole plan, last word.
- **Conversationally adjust** — stay in Plan, reshape, show a new whole plan. Dropping a line is an adjust, not a partial Apply.
- **Cancel (close)** — Apply nothing. End the event.

Never Apply a plan the user has not accepted as a whole. Headless: same three options in markdown (accept the whole plan / say what to change / cancel).

## Event contract

Cadence: Weekly
Lead: Product Owner
Gate:
Mode: plan
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
