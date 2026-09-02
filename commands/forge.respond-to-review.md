---
name: forge.respond-to-review
description: >-
  On demand; lead Engineer. Forge event command.
---

# forge.respond-to-review
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

Cadence: On demand
Lead: Engineer
Gate:
Mode: plan
Pause when:
    Pushing review fixes
    Replying to or resolving review threads
    Expanding scope beyond the review ask
    in-flight.md Review state would change
Instructions:
Clear open PR/MR review feedback and/or QA/Security pass-back for the active change — reply, fix, or explicitly defer with reason. Pass-back context comes from the FAIL PR comment and review threads; board stays `statusIds.in_review`. Re-run `/forge.validate-ticket` when fixes are pushed — no queue move required.
Don’t turn review response into unrelated refactors or new features; escalate scope fights to PO/Architect.
Board status stays `statusIds.in_review` — do not move back to In Progress.
Propose in-flight.md Review state / Blockers updates; clear Review state when merge-ready or when waiting on others.
When fixing pass-backs that still touch memory from older runs, propose findings.md removals only for items actually fixed.
Propose vendor actions (push, reply, resolve threads, re-request review) in the hand-off before mutating the host.
Leave product/architecture docs alone unless a review reveals a real contract/spec mismatch (then call it out; don’t silently rewrite).
Next human command when ready to re-gate: `/forge.validate-ticket`.
Docs:
<super-repo>/.ai/memory/<submodule>/engineering/in-flight.md
<super-repo>/.ai/memory/<submodule>/product/specs/<feature>.md
<super-repo>/.ai/memory/<submodule>/architecture/interfaces.md
<super-repo>/.ai/memory/<submodule>/project/status.md
<super-repo>/.ai/memory/<submodule>/qa/queue.md
<super-repo>/.ai/memory/<submodule>/qa/findings.md
Agents:
Engineer:
    skills/engineer/respond-to-review/SKILL.md
    skills/engineer/fix-bug/SKILL.md
    skills/engineer/write-tests/SKILL.md
    skills/engineer/debug/SKILL.md
    skills/engineer/update-branch/SKILL.md
