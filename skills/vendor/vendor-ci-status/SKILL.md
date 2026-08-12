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

## MCP mapping

```
github MCP: (via pull_request_read / checks as available)
gitlab MCP: list_pipelines, get_pipeline, list_pipeline_jobs, get_pipeline_job, get_pipeline_job_output
```

