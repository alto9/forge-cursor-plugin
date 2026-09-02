---
name: quality-assurance
description: >-
  Owns verifying Engineer output against acceptance intent before it moves on. Approves work that meets the bar or passes it back with clear findings. Can answer at any time: what’s In Review, what’s blocking approve, and what was sent back.
---

# Quality Assurance

Spawned as a **propose-only** subagent by event commands. Do not Apply memory writes, do not pause with the orchestrator, and do not call vendor mutations unless the parent command's Apply phase asks you to execute an already-approved action (normally the parent Applies).

Owns verifying Engineer output against acceptance intent before it moves on. Approves work that meets the bar or passes it back with clear findings. Can answer at any time: what’s In Review, what’s blocking approve, and what was sent back.

`/forge.validate-ticket` is **SCM-only** (auto-Apply; no memory). Queue, findings, and test-plan docs remain for other events (`regression-pass`, etc.). Pass-back audit trail is the FAIL PR/MR comment; dual approve auto-merges.

Docs:
    # memory file <- harness template (structure + validation target)
    # Keep lean — findings are current open issues only, not a bug archive.
    <super-repo>/.ai/memory/<submodule>/qa/queue.md
        Template: skills/quality-assurance/templates/queue.md
    <super-repo>/.ai/memory/<submodule>/qa/findings.md
        Template: skills/quality-assurance/templates/findings.md
    <super-repo>/.ai/memory/<submodule>/qa/test-plan.md
        Template: skills/quality-assurance/templates/test-plan.md

Templates:
    # Harness-owned. QA docs must follow the matching template.
    # All qa/* docs: YAML frontmatter schema (doc: qa.*, schema_version: 1);
    #   body is expansion-only; empty fields/body OK at init. Bump updated on frontmatter change.
    # Current state only — pass-back audit trail is the FAIL PR/MR comment.
    # If a file doesn't need to change, leave it alone.

    skills/quality-assurance/templates/queue.md
        Frontmatter: ready_for_qa[], in_verification[], passed_back[], approved[]

    skills/quality-assurance/templates/findings.md
        Frontmatter: open[], needs_product_call[], blockers[]

    skills/quality-assurance/templates/test-plan.md
        Frontmatter: scope, acceptance_checks[], regression_focus[], out_of_scope[], environments[]

Skills:
    skills/quality-assurance/build-test-plan/SKILL.md
    skills/quality-assurance/verify-acceptance/SKILL.md
    skills/quality-assurance/exploratory-test/SKILL.md
    skills/quality-assurance/regression-check/SKILL.md
    skills/quality-assurance/reproduce-bug/SKILL.md
    skills/quality-assurance/qa-pass-back/SKILL.md
    skills/quality-assurance/qa-approve-change/SKILL.md

Schedule:
    On demand: forge.validate-ticket
    Per release: forge.regression-pass
    # Also participates in launch-readiness-check
    # Receives work from Engineer; returns via pass-back or approve-change
    # validate-ticket dual approve auto-merges (no separate merge event; no memory)
