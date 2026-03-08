# Agent Flow and Responsibility Delegation

This document describes the intended flow of responsibility among Forge agents. Use it to understand when to invoke which agent and how work should be delegated.

## Hierarchy

```
Visionary (vision.json)
    │
    ▼
Architect ──────────────────────────────────────────────────────────┐
    │                                                                 │
    │  Delegates to subject matter experts when scope matches         │
    │                                                                 │
    ├──► Runtime        (.forge/runtime/)                             │
    ├──► Business Logic (.forge/business_logic/)                      │
    ├──► Data           (.forge/data/)                                │
    ├──► Interface      (.forge/interface/)                           │
    ├──► Integration    (.forge/integration/)                         │
    └──► Operations     (.forge/operations/)                          │
                                                                      │
Planner (roadmap.json) ◄────────────────────────────────────────────┘
    │
    ▼
Scribe (decomposes tickets)
    │
    ▼
Build / Review (implementation and validation)
```

## Architect: Delegation-First

The Architect performs **high-level analysis** and **delegates** to domain subagents. It should:

1. **Analyze** the prompt to determine which domain(s) are affected
2. **Route** to the appropriate subagent(s) using `.forge/knowledge_map.json`
3. **Invoke** the domain subagent(s) to perform file updates and contract changes
4. **Avoid** making direct edits to domain contracts (`.forge/runtime/*`, `.forge/data/*`, etc.)

When the Architect is invoked, it should rarely write files itself—it should invoke Runtime, Data, Business Logic, Interface, Integration, or Operations when the subject matter warrants it.

## Domain Subagents: Subject Matter Experts

Each domain subagent owns its contracts and performs updates:

| Subagent | Owns | Responsibilities |
|----------|------|-------------------|
| **runtime** | `.forge/runtime/` | Configuration, startup, lifecycle, execution model |
| **business_logic** | `.forge/business_logic/` | Domain model, user stories, error handling |
| **data** | `.forge/data/` | Data model, persistence, serialization, consistency |
| **interface** | `.forge/interface/` | Input handling, presentation, interaction flow |
| **integration** | `.forge/integration/` | API contracts, external systems, messaging |
| **operations** | `.forge/operations/` | Build, deployment, observability, security |

Domain subagents are **invoked by the Architect** when work falls in their scope. They perform the actual file updates and contract maintenance.

## Knowledge Map

`.forge/knowledge_map.json` defines the structure of domain contracts. Use it to:

- Map domains to their primary docs and children
- Determine which subagent to invoke for a given file or topic
- Understand the boundaries between domains

## When to Invoke Which Agent

| Prompt concerns | Invoke |
|------------------|--------|
| Product vision, strategy, market | Visionary |
| Cross-domain architecture, technical direction, routing | Architect |
| Architect prompt touching runtime/config/lifecycle | Architect → runtime |
| Architect prompt touching data/persistence/schema | Architect → data |
| Architect prompt touching domain rules, user stories | Architect → business_logic |
| Architect prompt touching UI, inputs, presentation | Architect → interface |
| Architect prompt touching APIs, external systems | Architect → integration |
| Architect prompt touching build, deploy, security | Architect → operations |
| Milestones, roadmap sequencing | Planner |
| Ticket decomposition | Scribe |
| Implementation, tests | Build |
| Code review, security review | Review |
