---
name: forge.prepare-release
description: >-
  Per release; lead Release Manager. Forge event command.
---

# forge.prepare-release
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
Lead: Release Manager
Gate:
Mode: plan
Pause when:
    Version target, checklist, notes, or release status would change
    Missing configured release.gates called out as blockers
Instructions:
Assemble the next release: version target, pre-ship checklist, notes draft, readiness status.
Read forge.json release.gates[] (if set) as this submodule's checklist — only require gates listed before cut-release; skip unlisted events.
When gates unset/empty: assemble notes/checklist from whatever inputs exist; do not invent a global pipeline.
Read configured gate outputs (QA queue, security findings, milestones, etc.) as inputs.
Propose release/checklist.md, notes.md, and status.md for the current cut only; clear leftover items from a prior shipped release.
Don’t publish/tag here — that’s cut-release after configured pre-cut gates are green (or explicitly waived).
Don’t rewrite product brief/roadmap; pull change summaries into notes.md Changes/Breaking/Known issues only.
Docs:
<super-repo>/.ai/memory/<submodule>/release/checklist.md
<super-repo>/.ai/memory/<submodule>/release/notes.md
<super-repo>/.ai/memory/<submodule>/release/status.md
<super-repo>/.ai/memory/<submodule>/qa/queue.md
<super-repo>/.ai/memory/<submodule>/qa/findings.md
<super-repo>/.ai/memory/<submodule>/security/findings.md
<super-repo>/.ai/memory/<submodule>/security/checklist.md
<super-repo>/.ai/memory/<submodule>/project/milestones.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
Agents:
Release Manager:
    skills/release-manager/version-plan/SKILL.md
    skills/release-manager/release-checklist/SKILL.md
    skills/release-manager/write-release-notes/SKILL.md
    skills/release-manager/rollback-plan/SKILL.md
Quality Assurance:
    skills/quality-assurance/qa-approve-change/SKILL.md
Security:
    skills/security/security-approve-change/SKILL.md
Product Owner:
    skills/product-owner/launch-readiness/SKILL.md
