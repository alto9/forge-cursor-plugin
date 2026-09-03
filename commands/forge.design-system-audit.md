---
name: forge.design-system-audit
description: >-
  Monthly; lead Designer. Audit Figma themes, tokens, screens, and components
  against design/ memory projections.
---

# forge.design-system-audit
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

Cadence: Monthly
Lead: Designer
Gate:
Mode: plan
Pause when:
    themes.md / structure.md / tokens.md / screens.md / components.md / principles.md would change
    Theme URL missing, stale, or MCP unreachable
    File-structure gaps (required pages, variable naming patterns, component categories)
Instructions:
Bind to the **active submodule** only. Audit that app's design theme. Re-examine themes/structure/tokens/screens/components as of this run.
If themes.md has no bound row for this app, run theme-bind first (ask for Figma URL if missing). Defer unbound only via explicit plan Accept; record structure fail / `"no theme bound"` in `design/structure.md`.
**Idle / gap fork:** Structure or inventory gaps must propose a next move in Movement — bind theme, fix required pages/naming/categories, or defer via Accept (stay put). Do not end with findings-only and no fork when the theme is unbound.
For each bound theme: run `design-structure-check` (pages, variable naming patterns, component categories — names not values), then token-audit, screen-inventory, and component-audit via Figma MCP (`figma-mcp`). Update memory projections to match Figma; list gaps (structure misses in `design/structure.md`; inventory notes in tokens/components; undocumented screens; orphan components; stale URL). Fail on missing structure; never fail because two apps use different brand colors.
Optionally refresh design-principles when a11y or interaction rules drifted.
Do not invent token or frame refs when MCP fails — flag blockers in Questions and leave projections alone or mark theme status stale. Token inventory stores names and Figma variable ids only (no resolved hex or sizes).
Do not mutate Figma in this event unless the orchestrator explicitly redirects to write tools under a new plan.
Docs:
<super-repo>/.ai/memory/<submodule>/design/themes.md
<super-repo>/.ai/memory/<submodule>/design/structure.md
<super-repo>/.ai/memory/<submodule>/design/tokens.md
<super-repo>/.ai/memory/<submodule>/design/screens.md
<super-repo>/.ai/memory/<submodule>/design/components.md
<super-repo>/.ai/memory/<submodule>/design/principles.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
Agents:
Designer:
    skills/designer/figma-mcp/SKILL.md
    skills/designer/theme-bind/SKILL.md
    skills/designer/design-structure/SKILL.md
    skills/designer/design-structure-check/SKILL.md
    skills/designer/token-audit/SKILL.md
    skills/designer/screen-inventory/SKILL.md
    skills/designer/component-audit/SKILL.md
    skills/designer/design-principles/SKILL.md
