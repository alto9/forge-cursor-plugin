---
name: vendor-whoami
description: >-
  Vendor MCP operation: whoami.
---

# vendor-whoami

## When to use

Invoked by Forge event commands or agents for `vendor/whoami`.

1. resolve-paths + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in plan delta before mutating unless parent Apply already accepted them.

## MCP mapping

```
github MCP: get_me
gitlab MCP: whoami
```

