---
name: forge.design-spike
description: >-
  Per major bet; lead Architect. Forge event command.
---

# forge.design-spike
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

Cadence: Per major bet / during HLD when one unknown blocks sign-off
Lead: Architect
Gate:
Mode: plan
Pause when:
    Always — spike question, options, and recommendation require orchestrator call
    Any ADR, overview, interfaces, constraints, or risks change proposed
    Initiative spec/design updates proposed
    Recommendation implies roadmap/backlog/plan change (call out; prefer PO/PM events to apply those)
Instructions:
Frame one structural unknown: question, options, recommendation, done-when — then stop.
Read brief/roadmap and current architecture docs; prefer `initiatives/<slug>/spec.md` (and design.md for UX) over legacy `product/specs/<feature>.md`. Don’t invent product scope.
Propose tradeoff analysis in the hand-off; propose decisions.md only if the orchestrator locks a choice.
Propose overview/interfaces/constraints/risks updates only for what the spike settles; leave unsettled areas alone.
Fold settled answers into initiative `spec.md` / `design.md` / `open-questions.md` when an initiative is in scope.
If the bet is not ready to decide, propose a time-boxed spike entry (question + done-when) and no ADR.
**UX flow exploration:** when the unknown is product-surface (flows, states, frames) rather than structure, Designer attends with figma-mcp / screen-inventory / design-principles. Architect remains Lead for structural spikes; Designer leads UX findings in the hand-off merge under Lead (Architect) unless Instructions redirect.
Docs:
<super-repo>/.ai/memory/<submodule>/architecture/overview.md
<super-repo>/.ai/memory/<submodule>/architecture/constraints.md
<super-repo>/.ai/memory/<submodule>/architecture/interfaces.md
<super-repo>/.ai/memory/<submodule>/architecture/decisions.md
<super-repo>/.ai/memory/<submodule>/architecture/risks.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/spec.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/design.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/open-questions.md
<super-repo>/.ai/memory/<submodule>/product/specs/<feature>.md
<super-repo>/.ai/memory/<submodule>/design/themes.md
<super-repo>/.ai/memory/<submodule>/design/screens.md
<super-repo>/.ai/memory/<submodule>/design/principles.md
Agents:
Architect:
    skills/architect/spike-framing/SKILL.md
    skills/architect/tradeoff-analysis/SKILL.md
    skills/architect/tech-selection/SKILL.md
    skills/architect/change-impact/SKILL.md
    skills/architect/architecture-decision/SKILL.md
    skills/architect/write-initiative-spec/SKILL.md
Product Owner:
    skills/product-owner/scope-control/SKILL.md
Designer:
    skills/designer/figma-mcp/SKILL.md
    skills/designer/screen-inventory/SKILL.md
    skills/designer/design-principles/SKILL.md
    skills/designer/initiative-design-check/SKILL.md
# Designer when spike is UX/flow exploration; optional for pure structural spikes
Engineer:
    skills/engineer/implement-ticket/SKILL.md
    skills/engineer/debug/SKILL.md
