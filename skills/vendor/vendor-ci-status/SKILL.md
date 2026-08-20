---
name: vendor-ci-status
description: >-
  Vendor MCP operation: ci / status.
---

# vendor-ci-status

## When to use

Invoked by Forge event commands or agents for `vendor/ci/status`.

1. resolve-paths + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in HITL hand-off before mutating unless parent Apply already approved them.
5. **Wait until terminal** when called from `/forge.implement-ticket`: poll the PR/MR head SHA until every required check/pipeline is success, failure, or cancelled. Pending/running is not complete. Do not tight-loop. Conclude from a fresh status read, not a stale earlier poll.
6. No CI configured on the host for this PR/MR → treat as skipped (success for the implement-ticket gate). Failure or cancelled → not complete; Engineer fixes, pushes, and waits again.

## MCP mapping

```
github MCP: (via pull_request_read / checks as available)
gitlab MCP: list_pipelines, get_pipeline, list_pipeline_jobs, get_pipeline_job, get_pipeline_job_output
```

