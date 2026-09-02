---
name: forge.initiative-design
description: >-
  On demand; lead Product Owner. Incremental HLD authoring for an initiative —
  roles contribute; no sign-off flip; no board tickets.
---

# forge.initiative-design
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

Cadence: On demand (during HLD; not one session)
Lead: Product Owner
Gate:
Mode: plan
Pause when:
    Material edits to initiative feature, spec, design, or security docs
    New open questions that need operator input
Instructions:
Bind to the **active submodule** and one `initiatives/<slug>/` with `status: hld` (or `intake` → treat as HLD).
PO: author/validate `features/initiative.feature` (Gherkin) via write-initiative-feature — one Feature file per initiative.
Architect: deepen `spec.md` (implementation details) via write-initiative-spec.
Designer: when `user_facing: true`, enrich `design.md` + Figma screen refs (pre-build screens); when false, leave design alone / keep designer sign-off `na`.
Security: deepen `security.md` (required for HLD exit).
Append unresolved items to `open-questions.md` with blocking true|false; do not invent answers.
Do **not** set signoffs.* to true — `/forge.initiative-planning` detects completeness and proposes sign-offs / status flip.
Do **not** create board tickets. If one structural/UX unknown blocks progress, recommend `/forge.design-spike`.
Docs:
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/initiative.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/open-questions.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/spec.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/design.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/security.md
<super-repo>/.ai/memory/<submodule>/initiatives/<slug>/features/initiative.feature
Agents:
Product Owner:
    skills/product-owner/write-initiative-feature/SKILL.md
    skills/product-owner/scope-control/SKILL.md
Architect:
    skills/architect/write-initiative-spec/SKILL.md
    skills/architect/constraint-mapping/SKILL.md
    skills/architect/interface-contracts/SKILL.md
Designer:
    skills/designer/initiative-design-check/SKILL.md
    skills/designer/figma-mcp/SKILL.md
    skills/designer/screen-inventory/SKILL.md
# Designer only when user_facing
Security:
    skills/security/initiative-security-spec/SKILL.md
    skills/security/threat-model/SKILL.md
