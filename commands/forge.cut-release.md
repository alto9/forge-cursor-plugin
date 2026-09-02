---
name: forge.cut-release
description: >-
  Per release; lead Release Manager. Forge event command.
---

# forge.cut-release
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
- **Proposed memory edits** — per file: update / create / remove + the material change only
- **Proposed vendor actions** — none, or explicit list
- **Proposed submodule commits** — version/changelog/fix commits when this event writes application git
- **Left alone** — in-scope docs/actions intentionally unchanged
- Event extras when the command defines them as tables — not pasted tickets

After the plan exists, only three options:

- **Accept (build)** — Apply exactly this plan. Whole plan, last word.
- **Conversationally adjust** — stay in Plan, reshape, show a new whole plan.
- **Cancel (close)** — Apply nothing. End the event.

Never Apply a plan the user has not accepted as a whole. Headless: same three options in markdown (accept the whole plan / say what to change / cancel).

## Event contract

Cadence: Per release
Lead: Release Manager
Gate:
Mode: plan
Pause when:
    Always — explicit orchestrator OK to publish
    Tag/release/publish vendor actions
    Version bump or changelog commits in the submodule
    release/status.md would move to Shipped
    Waiving any unsatisfied pre-cut gate from release.gates[]
Instructions:
Publish the prepared release only when forge.json pre-cut gates (before cut-release in release.gates[]) are satisfied — or orchestrator explicitly waives gaps in the plan.
If release.gates is unset/empty: rely on release/checklist.md + orchestrator OK only (no implied QA/security/marketing order).
Propose vendor actions: tag, GitHub/GitLab release, any required release PR/commit — list them explicitly before Apply.
Propose release/status.md → Shipped and clear Blockers/Ready for this version; clear checklist Pre-ship items that are done; don’t keep prior release narratives.
Propose notes.md finalization for what actually shipped; remove planned items that didn’t make the cut.
After ship, leave submodule code/tag as source of truth; memory holds only current/next release posture.
Post-cut gates (e.g. launch-comms, outcomes-retro) are separate commands — cut-release does not run them.
Docs:
<super-repo>/.ai/memory/<submodule>/release/checklist.md
<super-repo>/.ai/memory/<submodule>/release/notes.md
<super-repo>/.ai/memory/<submodule>/release/status.md
<super-repo>/.ai/memory/<submodule>/qa/queue.md
<super-repo>/.ai/memory/<submodule>/security/checklist.md
<super-repo>/.ai/memory/<submodule>/project/milestones.md
Agents:
Release Manager:
    skills/release-manager/cut-release/SKILL.md
    skills/release-manager/publish-release/SKILL.md
    skills/release-manager/release-checklist/SKILL.md
    skills/release-manager/write-release-notes/SKILL.md
Engineer:
    skills/engineer/update-branch/SKILL.md
