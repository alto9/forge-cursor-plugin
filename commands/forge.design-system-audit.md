---
name: forge.design-system-audit
description: >-
  Monthly; lead Designer. Audit Figma themes, tokens, screens, and components
  against design/ memory projections.
---

# forge.design-system-audit
## Parent execution model

1. Run skills `resolve-paths` → `sync-memory` → `resolve-config` (fail closed on path ambiguity or memory-repo sync failure).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRepoRoot, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.** Figma wins over stale design memory — update memory to match Figma.
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

Cadence: Monthly
Lead: Designer
HITL:
Mode: approve-before-write
Pause when:
    themes.md / structure.md / tokens.md / screens.md / components.md / principles.md would change
    Theme URL missing, stale, or MCP unreachable
    File-structure gaps (required pages, variable naming patterns, component categories)
Instructions:
Bind to the **active submodule** only. Audit that app's design theme.
If themes.md has no bound row for this app, run theme-bind first (ask for Figma URL if missing). Defer unbound only via explicit HITL; record structure fail / `"no theme bound"` in `design/structure.md`.
For each bound theme: run `design-structure-check` (pages, variable naming patterns, component categories — names not values), then token-audit, screen-inventory, and component-audit via Figma MCP (`figma-mcp`). Update memory projections to match Figma; list gaps (structure misses in `design/structure.md`; inventory notes in tokens/components; undocumented screens; orphan components; stale URL). Fail on missing structure; never fail because two apps use different brand colors.
Optionally refresh design-principles when a11y or interaction rules drifted.
Do not invent token or frame values when MCP fails — flag blockers in Questions and leave projections alone or mark theme status stale.
Do not mutate Figma in this event unless the orchestrator explicitly redirects to write tools under a new HITL.
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
