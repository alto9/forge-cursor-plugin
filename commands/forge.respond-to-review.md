---
name: forge.respond-to-review
description: >-
  On demand; lead Engineer. Forge event command.
---

# forge.respond-to-review
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

Cadence: On demand
Lead: Engineer
HITL:
Mode: approve-before-vendor
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
