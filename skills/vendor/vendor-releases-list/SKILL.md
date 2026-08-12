---
name: vendor-releases-list
description: >-
  Vendor MCP operation: releases / list.
---

# vendor-releases-list

## When to use

Invoked by Forge event commands or agents for `vendor/releases/list`.

1. resolve-paths + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in HITL hand-off before mutating unless parent Apply already approved them.

## MCP mapping

```
github MCP: list_releases, get_latest_release, get_release_by_tag, list_tags, get_tag
gitlab MCP: list_deployments, get_deployment
    # GitLab release surface is thinner here; extend when MCP adds parity
```

