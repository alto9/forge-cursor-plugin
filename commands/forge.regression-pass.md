---
name: forge.regression-pass
description: >-
  Per release; lead Quality Assurance. Forge event command.
---

# forge.regression-pass
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

Cadence: Per release
Lead: Quality Assurance
Gate:
Mode: plan
Pause when:
    Always — regression pass / fail / ship-with-known-issues call required
    test-plan.md or findings.md would change
    Open blockers that should stop launch-readiness
Instructions:
Run regression focus for the release against test-plan.md; not a full re-verification of every historical ticket.
Propose findings.md updates for new regressions only; delete cleared items; escalate Needs product call when acceptance is ambiguous.
Propose test-plan.md Regression focus / Environments updates when the release changes what must stay green; remove obsolete regression checks.
Propose queue.md cleanup: drop Approved items that are already shipped after the release call; don’t keep an approved archive.
Hand the regression call into launch-readiness-check; don’t invent product go/no-go here.
Release Manager: read release/status + checklist; propose Known issues / Blockers updates only when regression outcome changes ship readiness; leave version/publish steps to prepare-release / cut-release.
Docs:
<super-repo>/.ai/memory/<submodule>/qa/test-plan.md
<super-repo>/.ai/memory/<submodule>/qa/findings.md
<super-repo>/.ai/memory/<submodule>/qa/queue.md
<super-repo>/.ai/memory/<submodule>/product/specs/<feature>.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/project/milestones.md
<super-repo>/.ai/memory/<submodule>/release/status.md
<super-repo>/.ai/memory/<submodule>/release/checklist.md
<super-repo>/.ai/memory/<submodule>/release/notes.md
Agents:
Quality Assurance:
    skills/quality-assurance/regression-check/SKILL.md
    skills/quality-assurance/verify-acceptance/SKILL.md
    skills/quality-assurance/reproduce-bug/SKILL.md
    skills/quality-assurance/qa-pass-back/SKILL.md
    skills/quality-assurance/qa-approve-change/SKILL.md
Release Manager:
    skills/release-manager/release-checklist/SKILL.md
    skills/release-manager/write-release-notes/SKILL.md
