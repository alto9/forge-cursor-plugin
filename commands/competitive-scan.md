---
name: competitive-scan
description: >-
  Monthly; lead Product Owner. Forge event command.
---

# competitive-scan

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

Cadence: Monthly
Lead: Product Owner
HITL:
Mode: approve-before-write
Pause when:
    competitive.md would change
    brief.md or roadmap.md would change from implications
Instructions:
Refresh competitive truth; not a feature-parity checklist.
Propose competitive.md updates in place: update Alternatives/win/lose; remove Watch list entries that no longer matter; rewrite Implications to what matters now.
Propose brief.md / roadmap.md edits only when implications change a real bet; otherwise leave them alone.
Marketing: propose positioning/messaging Differentiator or Words we use/avoid only when competitive implications change the external story; optionally queue one competitive-angle post in social-queue.md Holding — not a feature-parity rant.
Docs:
<super-repo>/.ai/memory/<submodule>/product/competitive.md
<super-repo>/.ai/memory/<submodule>/product/brief.md
<super-repo>/.ai/memory/<submodule>/product/roadmap.md
<super-repo>/.ai/memory/<submodule>/marketing/positioning.md
<super-repo>/.ai/memory/<submodule>/marketing/messaging.md
<super-repo>/.ai/memory/<submodule>/marketing/social-queue.md
Agents:
Product Owner:
    skills/product-owner/discovery/SKILL.md
    skills/product-owner/feedback-synthesis/SKILL.md
Marketing Manager:
    skills/marketing-manager/competitive-angle/SKILL.md
    skills/marketing-manager/positioning/SKILL.md
    skills/marketing-manager/messaging/SKILL.md
    skills/marketing-manager/social-post/SKILL.md
