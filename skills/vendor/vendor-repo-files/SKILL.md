---
name: vendor-repo-files
description: >-
  Vendor MCP operation: repo / files.
---

# vendor-repo-files

## When to use

Invoked by Forge event commands or agents for `vendor/repo/files`.

1. resolve-paths + resolve-config first.
2. Prefer MCP tools for host in forge.json (github | gitlab).
3. Never invent ticket ids; board/SCM is source of truth.
4. Propose vendor actions in HITL hand-off before mutating unless parent Apply already approved them.

## MCP mapping

```
github MCP: get_file_contents, create_or_update_file, delete_file, push_files
gitlab MCP: get_file_contents, create_or_update_file, push_files, get_repository_tree
```

