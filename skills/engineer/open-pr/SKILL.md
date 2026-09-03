---
name: open-pr
description: >-
  engineer procedure: open pr. For implement-ticket, parent auto-Applies;
  no memory. Other events may still propose engineering memory updates.
---

# open-pr

## When to use

Invoked by Forge event commands or the engineer agent for `engineer/open-pr`.

## Steps

1. For `/forge.implement-ticket`:
   - Before open/update: confirm the branch tip has the freshly fetched **host** default SHA as an ancestor (`git merge-base --is-ancestor <host-main-sha> HEAD` or equivalent). **Fail closed** if not — do not open or update the PR/MR (stacked branch, stale fork parent, or wrong parent after squash).
   - PR/MR **base** is the host default branch from `forge.json` identity, not fork main or a previous ticket branch.
   - Propose opening/updating the PR/MR against the host remote. Do **not** read or write memory. Parent auto-Applies vendor actions.
2. For other events that still use engineering memory: read in-scope memory under `memoryRoot/engineering/`; propose template-shaped updates as those event Docs require.
3. Reference board issue ids/URLs; never invent parallel ticket numbers. **Board/SCM is SoT.**
4. When event-spawned: return Intent + Proposed vendor actions (open/update PR). For implement-ticket, Proposed memory edits are none. Do **not** Apply, pause with the orchestrator, or mutate SCM unless the parent asks you to execute an already-decided Apply step.

## Outputs / stop conditions

Plan-delta blob for the parent command. Stop if path/config unresolved (parent should have run resolve-paths).
