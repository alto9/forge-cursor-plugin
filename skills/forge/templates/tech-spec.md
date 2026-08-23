<!-- forge-tech-spec:v1 -->
# Technical Specification: [TICKET TITLE]

**Issue**: #[N] | **Date**: [DATE]

**Input**: Product contract from issue body (Outcome, Scope, AC)

## Summary

[Primary requirement from the issue body + technical approach]

## Technical Context

**Language/Version**: [e.g., TypeScript 5.x, Python 3.12]

**Primary Dependencies**: [libraries/frameworks this change uses]

**Storage**: [if applicable, e.g., PostgreSQL, files, N/A]

**Testing**: [e.g., vitest, pytest, go test]

**Target Platform**: [e.g., Node server, browser, CLI]

**Project Type**: [e.g., library, web service, plugin]

**Performance Goals**: [domain-specific, or N/A]

**Constraints**: [technical constraints inlined from architecture — no memory paths]

**Scale/Scope**: [domain-specific, or N/A]

## Constitution Check

*GATE: Must pass before Ready promotion for ai-ready. Re-check if design changed.*

| Gate | Status | Notes |
|------|--------|-------|
| Hard constraints respected | pass / fail | [inline facts] |
| Interfaces / boundaries honored | pass / fail | [inline facts] |
| No unresolved design gaps | pass / fail | [or recommend design-spike] |

## Project Structure

### Source Code (repository / submodule)

```text
[Real directories from the active submodule that this change touches]
```

**Structure Decision**: [Where code/tests live and why]

### Interfaces / Change Impact *(optional)*

- **Interfaces**: [contracts, APIs, seams this work touches]
- **Change impact**: [what else moves or must not break]

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| [e.g., new service] | [current need] | [why existing path is insufficient] |

## Security Context

[Assets, trust boundaries, and data sensitivity relevant to this ticket — inlined facts, no memory paths]

## Threat Considerations

- [Threat or abuse case this change introduces or mitigates]
- [How the design addresses it]

## Security Requirements

- **SR-001**: System MUST [specific security capability or control]
- **SR-002**: System MUST [authn/authz, secrets, data handling, etc.]

## Security Verification

- [ ] [How to prove SR items hold — commands, checks, or review steps]
