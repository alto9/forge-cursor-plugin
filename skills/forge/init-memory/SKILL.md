---
name: init-memory
description: >-
  Seed missing Forge memory markdown files from plugin templates without overwriting existing content.
  Honors kind (site subset) and group-owned docs under groups/<id>/.
---

# init-memory

## When to use

Launching or repairing `memoryRoot` for a submodule (`init-project`, or gap-fill) inside the **memory-repo** checkout (`.ai/memory`). Also seeds `groupRoot` docs when creating or joining a group.

## Steps

1. Run **ensure-config** first (`forge.json` must exist under `memoryRoot` for product init).
2. Read `forge.json.kind` (`app` default | `site` | `library`) and optional `forge.json.group`.
3. Choose the seed set:
   - **`kind: site`:** only `product/brief.md` + `design/*` (themes, structure, tokens, screens, components, principles). Do **not** seed marketing, architecture, engineering, QA, security, release, roadmap/backlog, etc.
   - **`kind: app` / `library` / default:** full map below, except group-owned docs when `group` is set.
4. When `forge.json.group` is set (or group-only init):
   - Ensure `groups/<id>/group.json` exists (`{ "id", "members": [...] }`).
   - Seed missing files under `groupRoot` from the **group-owned** map (marketing/*, personas, competitive, design/principles).
   - Do **not** seed those paths under `memoryRoot` for group members.
5. For each mapping in scope, if the memory file is missing, copy the template content. Do **not** overwrite non-empty existing files.
6. Safe to re-run (fills gaps only).
7. Specs (`product/specs/<feature>.md`) are **not** seeded here — deprecated soft; new work uses `initiatives/<slug>/` created by `/forge.new-initiative`. Ready tickets never link to memory paths.
8. `product/open-questions.md` is seeded empty for app/library (rollup for initiative-planning). Initiative folders are **not** seeded at init — created by `/forge.new-initiative`.
9. Parent Apply + **commit-memory** publish seeds to memory-repo `origin/main` (this skill only proposes/writes local files when invoked by the parent).

## Template → memory map (product `memoryRoot`, standalone or non-group-owned)

| Memory path | Template | Notes |
|---|---|---|
| product/brief.md | skills/product-owner/templates/brief.md | Always (incl. site) |
| product/roadmap.md | skills/product-owner/templates/roadmap.md | Skip site |
| product/backlog.md | skills/product-owner/templates/backlog.md | Skip site |
| product/metrics.md | skills/product-owner/templates/metrics.md | Skip site |
| product/insights.md | skills/product-owner/templates/insights.md | Skip site |
| product/competitive.md | skills/product-owner/templates/competitive.md | Standalone only; else groupRoot |
| product/personas.md | skills/product-owner/templates/personas.md | Standalone only; else groupRoot |
| product/experiments.md | skills/product-owner/templates/experiments.md | Skip site |
| product/open-questions.md | skills/product-owner/templates/open-questions-index.md | Skip site |
| project/plan.md | skills/project-manager/templates/plan.md | Skip site |
| project/status.md | skills/project-manager/templates/status.md | Skip site |
| project/risks.md | skills/project-manager/templates/risks.md | Skip site |
| project/milestones.md | skills/project-manager/templates/milestones.md | Skip site |
| architecture/overview.md | skills/architect/templates/overview.md | Skip site |
| architecture/constraints.md | skills/architect/templates/constraints.md | Skip site |
| architecture/interfaces.md | skills/architect/templates/interfaces.md | Skip site |
| architecture/decisions.md | skills/architect/templates/decisions.md | Skip site |
| architecture/risks.md | skills/architect/templates/risks.md | Skip site |
| engineering/in-flight.md | skills/engineer/templates/in-flight.md | Skip site |
| qa/queue.md | skills/quality-assurance/templates/queue.md | Skip site |
| qa/findings.md | skills/quality-assurance/templates/findings.md | Skip site |
| qa/test-plan.md | skills/quality-assurance/templates/test-plan.md | Skip site |
| security/threat-model.md | skills/security/templates/threat-model.md | Skip site |
| security/findings.md | skills/security/templates/findings.md | Skip site |
| security/checklist.md | skills/security/templates/checklist.md | Skip site |
| release/checklist.md | skills/release-manager/templates/checklist.md | Skip site |
| release/notes.md | skills/release-manager/templates/notes.md | Skip site |
| release/status.md | skills/release-manager/templates/status.md | Skip site |
| marketing/positioning.md | skills/marketing-manager/templates/positioning.md | Standalone only; else groupRoot |
| marketing/messaging.md | skills/marketing-manager/templates/messaging.md | Standalone only; else groupRoot |
| marketing/voice.md | skills/marketing-manager/templates/voice.md | Standalone only; else groupRoot |
| marketing/calendar.md | skills/marketing-manager/templates/calendar.md | Standalone only; else groupRoot |
| marketing/social-queue.md | skills/marketing-manager/templates/social-queue.md | Standalone only; else groupRoot |
| design/themes.md | skills/designer/templates/themes.md | Always (per-app) |
| design/structure.md | skills/designer/templates/structure.md | Always (per-app) |
| design/tokens.md | skills/designer/templates/tokens.md | Always (per-app) |
| design/screens.md | skills/designer/templates/screens.md | Always (per-app) |
| design/components.md | skills/designer/templates/components.md | Always (per-app) |
| design/principles.md | skills/designer/templates/principles.md | Standalone only; else groupRoot |

## Group-owned map (`groupRoot = .ai/memory/groups/<id>/`)

| Memory path | Template |
|---|---|
| marketing/positioning.md | skills/marketing-manager/templates/positioning.md |
| marketing/messaging.md | skills/marketing-manager/templates/messaging.md |
| marketing/voice.md | skills/marketing-manager/templates/voice.md |
| marketing/calendar.md | skills/marketing-manager/templates/calendar.md |
| marketing/social-queue.md | skills/marketing-manager/templates/social-queue.md |
| product/personas.md | skills/product-owner/templates/personas.md |
| product/competitive.md | skills/product-owner/templates/competitive.md |
| design/principles.md | skills/designer/templates/principles.md |

Same maps are encoded in `scripts/validate-memory.js` (`DOC_TEMPLATE_MAP`, `GROUP_DOC_TEMPLATE_MAP`, `SITE_DOC_PATHS`). All seeded memory paths are validated via frontmatter schemas (`SCHEMA_DOC_MAP` / `schemaEntryForPath`), not heading match.
