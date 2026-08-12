---
name: vendor-ci-run
description: >-
  Vendor MCP operation: ci / run.
---

# vendor-ci-run

## When to use

Invoked by Forge event commands or agents for `vendor/ci/run`.

1. resolve-paths + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in HITL hand-off before mutating unless parent Apply already approved them.

## MCP mapping

```
github MCP: (limited / extend when available)
gitlab MCP: create_pipeline, retry_pipeline, cancel_pipeline, play_pipeline_job, retry_pipeline_job, cancel_pipeline_job
```

