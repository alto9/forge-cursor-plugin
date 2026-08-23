---
name: init-memory
description: >-
  Seed missing Forge memory markdown files from plugin templates without overwriting existing content.
---

# init-memory

## When to use

Launching or repairing `memoryRoot` for a submodule (`init-project`, or gap-fill) inside the **memory-repo** checkout (`.ai/memory`).

## Steps

1. Run **ensure-config** first (`forge.json` must exist under `memoryRoot`).
2. For each mapping below, if the memory file is missing, copy the template content into `memoryRoot/<memory path>`.
3. Do **not** overwrite non-empty existing files.
4. Safe to re-run (fills gaps only).
5. Specs (`product/specs/<feature>.md`) are **not** seeded here — optional memory projections may be created during `/forge.refinement` (or launch-readiness) when multi-area; Ready tickets never link to them.
6. Parent Apply + **commit-memory** publish seeds to memory-repo `origin/main` (this skill only proposes/writes local files when invoked by the parent).

## Template → memory map

| Memory path | Template |
|---|---|
| product/brief.md | skills/product-owner/templates/brief.md |
| product/roadmap.md | skills/product-owner/templates/roadmap.md |
| product/backlog.md | skills/product-owner/templates/backlog.md |
| product/metrics.md | skills/product-owner/templates/metrics.md |
| product/insights.md | skills/product-owner/templates/insights.md |
| product/competitive.md | skills/product-owner/templates/competitive.md |
| product/personas.md | skills/product-owner/templates/personas.md |
| product/experiments.md | skills/product-owner/templates/experiments.md |
| project/plan.md | skills/project-manager/templates/plan.md |
| project/status.md | skills/project-manager/templates/status.md |
| project/risks.md | skills/project-manager/templates/risks.md |
| project/milestones.md | skills/project-manager/templates/milestones.md |
| architecture/overview.md | skills/architect/templates/overview.md |
| architecture/constraints.md | skills/architect/templates/constraints.md |
| architecture/interfaces.md | skills/architect/templates/interfaces.md |
| architecture/decisions.md | skills/architect/templates/decisions.md |
| architecture/risks.md | skills/architect/templates/risks.md |
| engineering/in-flight.md | skills/engineer/templates/in-flight.md |
| qa/queue.md | skills/quality-assurance/templates/queue.md |
| qa/findings.md | skills/quality-assurance/templates/findings.md |
| qa/test-plan.md | skills/quality-assurance/templates/test-plan.md |
| security/threat-model.md | skills/security/templates/threat-model.md |
| security/findings.md | skills/security/templates/findings.md |
| security/checklist.md | skills/security/templates/checklist.md |
| release/checklist.md | skills/release-manager/templates/checklist.md |
| release/notes.md | skills/release-manager/templates/notes.md |
| release/status.md | skills/release-manager/templates/status.md |
| marketing/positioning.md | skills/marketing-manager/templates/positioning.md |
| marketing/messaging.md | skills/marketing-manager/templates/messaging.md |
| marketing/voice.md | skills/marketing-manager/templates/voice.md |
| marketing/calendar.md | skills/marketing-manager/templates/calendar.md |
| marketing/social-queue.md | skills/marketing-manager/templates/social-queue.md |

Same map is encoded in `scripts/validate-memory.js` (`DOC_TEMPLATE_MAP`). All `product/*` paths (and `product/specs/*.md`) are seeded from templates and validated via frontmatter schemas (`SCHEMA_DOC_MAP` / `schemaEntryForPath`), not heading match.
