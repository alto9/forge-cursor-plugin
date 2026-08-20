---
name: vendor-pulls-merge
description: >-
  Vendor MCP operation: pulls / merge.
---

# vendor-pulls-merge

## When to use

Invoked by Forge event commands or agents for `vendor/pulls/merge`.

1. resolve-paths + sync-memory + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in HITL hand-off before mutating unless parent Apply already approved them.
5. **Memory-repo refuse:** if the target repository is the memory-repo (checkout path `.ai/memory`, or remote URL matching the `.ai/memory` submodule), **STOP**. Never merge PRs/MRs for the memory-repo — memory has no PR/MR workflow.
6. **Delete source branch after merge** when called from `/forge.validate-ticket` (human already approved the merge): after the merge succeeds, delete the PR/MR head/source branch. Do **not** delete the default branch or a protected branch. If merge fails, leave the branch. GitLab: set `should_remove_source_branch: true` on `merge_merge_request` (or `delete_branch` if the branch remains). GitHub: `merge_pull_request` does not delete the head — follow with `vendor-branches-write`.

## MCP mapping

```
github MCP: merge_pull_request
gitlab MCP: merge_merge_request (should_remove_source_branch: true on validate-ticket)
```
