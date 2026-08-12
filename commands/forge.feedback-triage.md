---
name: forge.feedback-triage
description: >-
  Weekly; lead Product Owner. Forge event command.
---

# forge.feedback-triage
## Parent execution model

1. Run skills `resolve-paths` then `resolve-config` (fail closed on path ambiguity).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run `validate-memory` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM. Never Apply invalid templates.


### Hand-off shape (required)

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Decisions needed** — yes/no or A/B
- **Left alone** — in-scope docs/actions intentionally unchanged

Orchestrator reply gates Apply: approve all | approve subset | reject | redirect.


## Event contract

Cadence: Weekly
Lead: Product Owner
HITL:
Mode: approve-before-vendor
Pause when:
    Insights themes rewritten or removed
    Backlog candidates added, re-ranked, or dropped
    Experiments started or stopped
    Any GitHub/GitLab issue/ticket mutation
Instructions:
Pull new signal (issues, comments, usage, user feedback); do not paste raw threads into docs.
Propose insights.md updates: rewrite Themes/Open questions/Implications to current truth; remove themes that are resolved or no longer relevant.
Propose backlog.md changes only when triage creates, re-ranks, or drops a candidate; remove won't-do items rather than commenting them out.
Propose experiments.md changes only when triage starts/stops a bet; move stopped work out of Active (Concluded briefly, then drop when no longer actionable).
Docs:
<super-repo>/.ai/memory/<submodule>/product/insights.md
<super-repo>/.ai/memory/<submodule>/product/backlog.md
<super-repo>/.ai/memory/<submodule>/product/experiments.md
Agents:
Product Owner:
    skills/product-owner/feedback-synthesis/SKILL.md
    skills/product-owner/problem-framing/SKILL.md
    skills/product-owner/prioritization/SKILL.md
