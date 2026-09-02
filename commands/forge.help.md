---
name: forge.help
description: >-
  On demand; lead (harness — no role Lead). Forge event command.
---

# forge.help
Observe-only harness orientation. Do not spawn role subagents unless the user asks for a deep dive on one agent (still no writes).

### Plan shape (required)

Observe only — report shape below; **no plan Accept gate, no Apply**. See README Plan shape.

- **Intent** — 1–2 sentences
- **Proposed memory edits** — none
- **Proposed vendor actions** — none
- **Left alone** — all (read-only)

## Event contract

Cadence: On demand
Lead: (harness — no role Lead)
Gate:
Mode: observe
Pause when:
    Never required — report only; no Apply
Instructions:
Answer “what is this harness and what should I run?” using skills/forge/help/SKILL.md.
Do not spawn role subagents unless the user asks for a deep dive on one agent (then explain that agent only — still no writes).
Resolve paths when possible; if the target is ambiguous, list groups and .gitmodules paths and how to pass --group / --submodule. Suggested next is for the active target; a group target is one plan across members.
Default output sections:
    Where you are          # superRepoRoot, target (group or product), memoryRepoRoot, memoryRoot / groupRoot (or “unresolved” / missing memory-repo)
    How this works         # SoT, memory-repo on main vs code PRs, Plan Mode Accept/adjust/Cancel, parent/subagent Apply rules (short)
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
