---
name: forge.feedback-triage
description: >-
  Weekly; lead Product Owner. Forge event command.
---

# forge.feedback-triage
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
- **Movement** — what this run advances, or operator-confirmed stay-put after an idle AskQuestion; when the pipeline is starved, suggested next from the forge.help state→command map
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
    Insights themes rewritten or removed
    Backlog candidates added, re-ranked, or dropped
    Experiments started or stopped
    Any GitHub/GitLab issue/ticket mutation
Instructions:
Pull new signal (issues, comments, usage, user feedback); do not paste raw threads into docs. Still invent no tickets from thin anecdotes.
Re-examine insights.md / Icebox as of this run — drop resolved themes; promote, park, or kill candidates that should move.
**Idle fork:** If there is no new signal, AskQuestion **before** CreatePlan over existing Icebox / insights open questions: promote toward a ticket or Now, park, drop, or stay put. Empty insights is a “what should we go look at” fork (or stay put), not a skip.
Propose insights.md updates: rewrite Themes/Open questions/Implications to current truth; remove themes that are resolved or no longer relevant.
Propose backlog.md changes only when triage creates, re-ranks, or drops a candidate; remove won't-do items rather than commenting them out.
Propose experiments.md changes only when triage starts/stops a bet; move stopped work out of Active (Concluded briefly, then drop when no longer actionable).
Designer: classify usability/UX signal vs product noise; propose design/principles.md edits only when triage changes durable a11y or interaction rules; leave design docs alone for pure product/priority signal.
Docs:
<super-repo>/.ai/memory/<submodule>/product/insights.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/product/experiments.md
<super-repo>/.ai/memory/<submodule>/design/principles.md
Agents:
Product Owner:
    skills/product-owner/feedback-synthesis/SKILL.md
    skills/product-owner/problem-framing/SKILL.md
    skills/product-owner/prioritization/SKILL.md
Designer:
    skills/designer/design-principles/SKILL.md
