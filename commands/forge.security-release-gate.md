---
name: forge.security-release-gate
description: >-
  Per release; lead Security. Forge event command.
---

# forge.security-release-gate
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

Cadence: Per release
Lead: Security
HITL:
Mode: approve-before-write
Pause when:
    Always — security OK / not OK / ship-with-exceptions for this release
    findings.md Blockers or checklist Release gates would change
Instructions:
Gate the release from a security lens using findings + checklist Release gates + threat-model relevance.
Propose findings.md cleanup: blockers that remain vs cleared; delete resolved items.
Propose checklist.md Release gates truth for this cut only; don’t invent a new threat model here.
Hand the security call into launch-readiness-check / prepare-release; don’t cut the release here.
Docs:
<super-repo>/.ai/memory/<submodule>/security/findings.md
<super-repo>/.ai/memory/<submodule>/security/checklist.md
<super-repo>/.ai/memory/<submodule>/security/threat-model.md
<super-repo>/.ai/memory/<submodule>/release/checklist.md
<super-repo>/.ai/memory/<submodule>/release/status.md
<super-repo>/.ai/memory/<submodule>/qa/findings.md
Agents:
Security:
    skills/security/security-review/SKILL.md
    skills/security/secret-scan/SKILL.md
    skills/security/dependency-audit/SKILL.md
    skills/security/security-approve-change/SKILL.md
    skills/security/security-pass-back/SKILL.md
Release Manager:
    skills/release-manager/release-checklist/SKILL.md
