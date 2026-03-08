# Forge Cursor Plugin

A Cursor plugin that adds **Forge**—a structured development workflow—to your projects. Forge combines domain-driven documentation, GitHub-integrated skills, and staged build/review agents so AI-assisted development stays consistent and traceable.

---

## What is Forge?

Forge is a lightweight framework for organizing project knowledge and workflows:

- **`.forge/`** — Structured docs: vision, roadmap, and domain folders (runtime, data, integration, etc.)
- **Skills** — Reusable scripts (GitHub CLI, git, testing) that agents invoke via a registry
- **Agents** — Specialized subagents (Visionary, Architect, Planner, Scribe, Build, Review) with clear contracts
- **Commands** — High-level workflows like “start issue build” or “start PR review”

Projects using Forge get predictable structure, schema-validated JSON, and a shared vocabulary for both humans and AI.

---

## What This Plugin Provides

| Component | Purpose |
|-----------|---------|
| **Skills** | 20+ scripts: `init-forge`, `gh-create-pr`, `gh-get-issue`, `commit`, `create-feature-branch`, `unit-test`, `lint-test`, `fetch-url`, and more |
| **Agents** | 15+ subagent definitions: Visionary, Architect, Planner, Scribe, Build stages, Review stages, domain agents |
| **Commands** | `start-issue-build`, `start-pr-review` — orchestrate skills and agents from an issue or PR |
| **Hooks** | JSON schema validation for `.forge/vision.json`, `project.json`, `roadmap.json` on edit |

### Skill Categories

- **gh_cli** — GitHub issues, PRs, milestones, project items
- **git_flow** — Branches, commits, push
- **npm_wrapper** — Unit test, lint, integration test
- **research** — URL fetching for vision/architect research

---

## Quick Start

### 1. Add the Plugin to Your Project

Copy the plugin contents into your repo (or add as a submodule):

```
your-project/
├── .cursor/
│   ├── agents/      ← from plugin agents/
│   ├── skills/      ← from plugin skills/
│   ├── commands/   ← from plugin commands/
│   └── hooks/       ← from plugin hooks/
├── .cursor-plugin/
│   └── plugin.json
└── hooks.json       ← from plugin root
```

Or symlink/copy from this repo into your project’s `.cursor/` and root.

### 2. Initialize Forge Structure

```bash
node .cursor/skills/init-forge/scripts/init-forge.js .
```

This creates `.forge/` with `vision.json`, `project.json`, `roadmap.json`, domain folders, and schemas.

### 3. Use Commands and Skills

- **Start issue build**: Run the `start-issue-build` command with an issue reference (e.g. `123` or `owner/repo#123`)
- **Start PR review**: Run the `start-pr-review` command with a PR reference
- **Skills**: Agents resolve skills from `.forge/skill_registry.json` and execute the registered scripts

---

## Structure

```
forge-cursor-plugin/
├── agents/           # Subagent definitions (visionary, architect, build, review, etc.)
├── commands/         # Command definitions (start-issue-build, start-pr-review)
├── hooks/            # Hooks (validate-json-schema.js)
├── hooks.json        # Hook configuration
├── skills/           # Skill definitions + scripts
│   ├── init-forge/   # Scaffold .forge from knowledge map
│   ├── gh-*/        # GitHub CLI wrappers
│   ├── commit/      # Conventional commit
│   ├── create-feature-branch/
│   ├── fetch-url/
│   ├── unit-test/, lint-test/, integration-test/
│   └── ...
└── .cursor-plugin/
    └── plugin.json   # Plugin metadata
```

---

## Requirements

- **Node.js** — For hooks (validate-json-schema.js) and skill scripts that use Node
- **GitHub CLI (`gh`)** — For GitHub skills (create PR, get issue, etc.)
- **Cursor** — With agent/command support

---

## Testing

The plugin includes unit tests to validate skill functionality:

```bash
npm install
npm test
```

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests (unit + skills) |
| `npm run test:unit` | Vitest tests for the JSON schema validation hook |
| `npm run test:skills` | Bats tests for shell script skills (init-forge) |

**Unit tests** cover the `validate-json-schema` hook and Node skills (commit, create-feature-branch, fetch-url, gh-create-issue): payload parsing, path resolution, schema inference, validation rules, and argument parsing.

**Skills tests** cover argument validation, usage output, and init-forge scaffolding. Skills that call external tools (e.g. `gh`, `git`) are tested for input validation only; full integration requires a real environment.

---

## License

MIT
