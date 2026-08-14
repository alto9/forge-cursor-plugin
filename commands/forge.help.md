---
name: forge.help
description: >-
  On demand; lead (harness — no role Lead). Forge event command.
---

# forge.help
Observe-only harness orientation. Do not spawn role subagents unless the user asks for a deep dive on one agent (still no writes).

### Hand-off shape (required)

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Decisions needed** — yes/no or A/B
- **Left alone** — in-scope docs/actions intentionally unchanged

Orchestrator reply gates Apply: approve all | approve subset | reject | redirect.


## Event contract

Cadence: On demand
Lead: (harness — no role Lead)
HITL:
Mode: observe
Pause when:
    Never required — report only; no Apply
Instructions:
Answer “what is this harness and what should I run?” using skills/forge/help/SKILL.md.
Do not spawn role subagents unless the user asks for a deep dive on one agent (then explain that agent only — still no writes).
Resolve paths when possible; if submodule is ambiguous, list .gitmodules paths and how to pass --submodule.
Default output sections:
    Where you are          # superRepoRoot, submodulePath, memoryRepoRoot, memoryRoot (or “unresolved” / missing memory-repo)
    How this works         # SoT, memory-repo on main vs code PRs, HITL, parent/subagent Apply rules (short)
    Agents                 # name + one-line description
    Event commands         # id, cadence, lead (group by: setup, product, delivery, build, quality, security, release, marketing)
    Suggested next         # 1–3 commands from current state, or New project path if uninitialized
    Topic focus            # if user passed a topic/event/agent, expand that contract
Keep it scannable — links/paths over essays. No memory edits, no vendor calls.
Docs:
# Read-only references (plugin README / event contracts / forge.json when present)
<super-repo>/.ai/memory/<submodulePath>/forge.json
Agents:
# None by default — parent runs skills/forge/help/SKILL.md directly
