#!/usr/bin/env node
/**
 * One-time bootstrap: generate agents, commands, skills, and templates from a
 * harness design dump. Prefers docs/harness-design.md (full design inventory).
 * After bootstrap, plugin files are the source of truth — do not re-run against
 * the slim README.md (it no longer contains Agents:/Events: blocks).
 * Leaf skill folder names are globally unique for Cursor discovery.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const designPath = [
  path.join(root, "docs/harness-design.md"),
  path.join(root, "README.md"),
].find((p) => fs.existsSync(p) && fs.readFileSync(p, "utf8").includes("\nAgents:\n"));
if (!designPath) {
  console.error(
    "No harness design dump found (need docs/harness-design.md or README.md with Agents:/Events:).\n" +
      "Plugin files under agents/, commands/, skills/ are already the source of truth."
  );
  process.exit(1);
}
const readme = fs.readFileSync(designPath, "utf8");
console.log(`Generating from ${path.relative(root, designPath)}`);

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content);
}

/** Map README skill path -> unique leaf folder name + on-disk path */
function mapSkillPath(readmePath) {
  // readmePath like product-owner/discovery or vendor/issues/list or quality-assurance/pass-back
  const parts = readmePath.split("/");
  if (parts[0] === "forge") {
    const leaf = parts[1];
    return { leaf, disk: `skills/forge/${leaf}`, readmePath };
  }
  if (parts[0] === "vendor") {
    const leaf = `vendor-${parts.slice(1).join("-")}`;
    return { leaf, disk: `skills/vendor/${leaf}`, readmePath };
  }
  const role = parts[0];
  const short = parts.slice(1).join("-");
  // Colliding short names across roles
  const collisions = new Set(["pass-back", "approve-change"]);
  const rolePrefix = {
    "quality-assurance": "qa",
    security: "security",
    "product-owner": "po",
    "project-manager": "pm",
    architect: "architect",
    engineer: "engineer",
    "marketing-manager": "marketing",
    "release-manager": "release",
  };
  const leaf = collisions.has(short)
    ? `${rolePrefix[role] || role}-${short}`
    : short;
  return {
    leaf,
    disk: `skills/${role}/${leaf}`,
    readmePath,
  };
}

// Build skill map from all SKILL.md references
const skillRefs = [...readme.matchAll(/skills\/([a-z0-9-]+(?:\/[a-z0-9-]+)*)\/SKILL\.md/g)].map(
  (m) => m[1]
);
const uniqueSkillRefs = [...new Set(skillRefs)];
const skillMap = new Map(uniqueSkillRefs.map((r) => [r, mapSkillPath(r)]));

// Detect leaf collisions and uniquify
const leaves = new Map();
for (const [k, v] of skillMap) {
  if (leaves.has(v.leaf)) {
    const parts = k.split("/");
    const rolePrefix = {
      "quality-assurance": "qa",
      security: "security",
      "product-owner": "po",
      "project-manager": "pm",
      architect: "architect",
      engineer: "engineer",
      "marketing-manager": "marketing",
      "release-manager": "release",
      vendor: "vendor",
      forge: "forge",
    };
    const prefix = rolePrefix[parts[0]] || parts[0];
    v.leaf = `${prefix}-${parts.slice(1).join("-")}`;
    v.disk =
      parts[0] === "vendor"
        ? `skills/vendor/${v.leaf}`
        : `skills/${parts[0]}/${v.leaf}`;
  }
  if (leaves.has(v.leaf)) {
    throw new Error(`Unresolved leaf collision: ${v.leaf}`);
  }
  leaves.set(v.leaf, k);
}

function mappedSkillPath(readmePath) {
  const key = readmePath.replace(/^skills\//, "").replace(/\/SKILL\.md$/, "");
  const m = skillMap.get(key);
  if (!m) return `skills/${key}/SKILL.md`;
  return `${m.disk}/SKILL.md`;
}

// --- Parse agents ---
const agentsMatch = readme.match(/^Agents:\n([\s\S]*?)\n---\n\nEvents:/m);
if (!agentsMatch) throw new Error("Agents section not found");
const agentsBlob = agentsMatch[1];

const agentBlocks = [];
const agentStarts = [
  ...agentsBlob.matchAll(/^    ([A-Za-z][A-Za-z ]+)\n        Description:\n/gm),
];
for (let i = 0; i < agentStarts.length; i++) {
  const title = agentStarts[i][1];
  const bodyStart = agentStarts[i].index + agentStarts[i][0].length;
  const bodyEnd =
    i + 1 < agentStarts.length ? agentStarts[i + 1].index : agentsBlob.length;
  agentBlocks.push({
    title,
    body: agentsBlob.slice(bodyStart, bodyEnd),
  });
}

function agentFileName(title) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

for (const agent of agentBlocks) {
  const name = agentFileName(agent.title);
  const descLine = agent.body
    .split("\n")
    .map((l) => l.replace(/^        /, ""))
    .find((l) => l.trim() && !l.startsWith("Docs:") && !l.startsWith("#"));
  const description = (descLine || agent.title).trim().slice(0, 200);

  // Remap skill paths in body
  let body = agent.body
    .split("\n")
    .map((l) => l.replace(/^        /, ""))
    .join("\n")
    .trim();
  body = body.replace(
    /skills\/([a-z0-9-]+(?:\/[a-z0-9-]+)*)\/SKILL\.md/g,
    (_, p) => mappedSkillPath(p)
  );

  const content = `---
name: ${name}
description: >-
  ${description}
---

# ${agent.title}

Spawned as a **propose-only** subagent by event commands. Do not Apply memory writes, do not HITL with the orchestrator, and do not call vendor mutations unless the parent command's Apply phase asks you to execute an already-approved action (normally the parent Applies).

${body}
`;
  writeFile(path.join(root, "agents", `${name}.md`), content);
}

// --- Parse templates from agent sections ---
const templateBlocks = [
  ...readme.matchAll(
    /skills\/([a-z0-9-]+)\/templates\/([a-z0-9-]+)\.md\n((?:                #.+\n)+)/g
  ),
];
for (const m of templateBlocks) {
  const role = m[1];
  const doc = m[2];
  const headings = m[3]
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("#"));
  const content = headings.join("\n\n") + "\n";
  writeFile(
    path.join(root, "skills", role, "templates", `${doc}.md`),
    content
  );
}

// --- Parse events ---
const eventsMatch = readme.match(/^Events:\n([\s\S]*)/m);
if (!eventsMatch) throw new Error("Events section not found");
const eventsBlob = eventsMatch[1];

// Split on event ids at 4-space indent that are kebab-case alone
const eventParts = eventsBlob.split(/\n(?=    [a-z0-9-]+\n)/);
const events = [];
for (const part of eventParts) {
  const m = part.match(/^    ([a-z0-9-]+)\n([\s\S]*)$/);
  if (!m) continue;
  // skip HITL / Execution model style blocks that aren't events — events have Cadence or Lead
  if (!/^\s+Cadence:/m.test(m[2]) && m[1] !== "help" && m[1] !== "forge.help") {
    if (!/^\s+Lead:/m.test(m[2])) continue;
  }
  if (["execution", "hitl"].includes(m[1])) continue;
  events.push({ id: m[1], body: m[2] });
}

const EXEC_MODEL = `## Parent execution model

1. Run skills \`resolve-paths\` → \`sync-memory\` → \`resolve-config\` (fail closed on path ambiguity or memory-repo sync failure).
2. Spawn each listed Agent as a **propose-only** subagent with: event id, superRepoRoot, submodulePath, memoryRepoRoot, memoryRoot, submoduleRoot, docs in scope, skills to use, and relevant Instructions. Subagents must not write memory, must not HITL, must not mutate vendor/SCM.
3. Merge subagent proposals into one hand-off. On conflict, Lead wins unless Instructions say otherwise. **Board/SCM wins over memory.**
4. HITL pause using the Mode / Pause when / hand-off shape below.
5. On orchestrator approve: run \`validate-memory\` on proposed memory files; Apply vendor/SCM ops first when both exist; then Apply memory to match SCM; then run \`commit-memory\` (push memory-repo \`main\`) if memory files changed. Never Apply invalid templates.
`;

const HITL_SHAPE = `### Hand-off shape (required)

- **Intent** — 1–2 sentences
- **Proposed memory edits** — per file: update / remove / create
- **Proposed vendor actions** — none, or explicit list
- **Decisions needed** — yes/no or A/B
- **Left alone** — in-scope docs/actions intentionally unchanged

Orchestrator reply gates Apply: approve all | approve subset | reject | redirect.
`;

for (const ev of events) {
  let body = ev.body
    .split("\n")
    .map((l) => l.replace(/^        /, "").replace(/^    /, ""))
    .join("\n")
    .trim();
  body = body.replace(
    /skills\/([a-z0-9-]+(?:\/[a-z0-9-]+)*)\/SKILL\.md/g,
    (_, p) => mappedSkillPath(p)
  );

  const cadence = (body.match(/Cadence:\s*(.+)/) || [])[1] || "On demand";
  const lead = (body.match(/Lead:\s*(.+)/) || [])[1] || "harness";
  const description = `${cadence}; lead ${lead}. Forge event command.`.slice(
    0,
    200
  );

  const bareId = ev.id.replace(/^forge\./, "");
  const cmdId = bareId.startsWith("forge.") ? bareId : `forge.${bareId}`;
  const isHelp = bareId === "help";
  const content = `---
name: ${cmdId}
description: >-
  ${description}
---

# ${cmdId}

${isHelp ? "Observe-only harness orientation. Do not spawn role subagents unless the user asks for a deep dive on one agent (still no writes)." : EXEC_MODEL}

${HITL_SHAPE}

## Event contract

${body}
`;
  writeFile(path.join(root, "commands", `${cmdId}.md`), content);
}

// --- Generate skills ---
const roleSkillMeta = {
  discovery: "Find and synthesize user/customer signal into product insights.",
  "problem-framing": "Turn fuzzy asks into crisp problem and outcome statements.",
  prioritization: "Rank work and cut scope against current intent.",
  "requirements-writing": "Write acceptance criteria and Ready-level specs.",
  roadmapping: "Maintain Now/Next/Later roadmap truth.",
  "stakeholder-alignment": "Align intent vs delivery for the orchestrator.",
  "outcome-definition": "Define and read success metrics for bets.",
  "scope-control": "Keep non-goals and cuts explicit.",
  "feedback-synthesis": "Turn feedback into themes and backlog implications.",
  "decision-hygiene": "Capture only decisions that change product posture.",
  "launch-readiness": "Product go/no-go for a release.",
};

for (const [readmePath, mapped] of skillMap) {
  const parts = readmePath.split("/");
  const kind = parts[0];
  let description = `Forge skill for ${mapped.leaf}.`;
  let steps = `Follow the harness contract for \`${mapped.leaf}\`. Prefer propose-only when invoked from an event subagent; the parent command Applies after HITL.\n`;

  if (kind === "forge") {
    description = `Forge harness: ${mapped.leaf}.`;
    steps = `See plugin README forge section and this skill's steps below. Implement the procedure exactly; fail closed on ambiguity.\n`;
  } else if (kind === "vendor") {
    description = `Vendor MCP operation: ${parts.slice(1).join(" / ")}.`;
    steps = `1. resolve-paths + sync-memory + resolve-config first.\n2. Prefer MCP tools for host in forge.json (github | gitlab).\n3. Never invent ticket ids; board/SCM is source of truth.\n4. Propose vendor actions in HITL hand-off before mutating unless parent Apply already approved them.\n5. Memory-repo refuse: if the target repo is the \`.ai/memory\` memory-repo (path or remote URL), **STOP** — no branches/PRs/MRs; use commit-memory on main only.\n`;
  } else {
    description =
      roleSkillMeta[parts[parts.length - 1]] ||
      `${kind} skill: ${mapped.leaf}.`;
    steps = `1. Read only in-scope memory docs for this skill/event.\n2. Propose updates matching role templates (required H2s only).\n3. Current state only — remove stale items; leave files alone if unchanged.\n4. When event-spawned: return a hand-off blob; do not Apply.\n`;
  }

  // Richer forge skill bodies
  if (mapped.leaf === "resolve-paths") {
    steps = `## Steps

1. Resolve **superRepoRoot**:
   - If \`FORGE_SUPER_REPO\` is set, use it (must contain \`.gitmodules\`).
   - Else walk upward from cwd for a directory containing \`.gitmodules\`.
   - Prefer a root that also has \`.ai/memory/\` when multiple ancestors match.
   - If zero or ambiguous: **STOP** and ask the orchestrator.
2. Require memory-repo submodule at path \`.ai/memory\`. If missing: **STOP** (\`git submodule add -b main <url> .ai/memory\`).
3. Resolve **submodulePath** (code only — never \`.ai/memory\`):
   - Explicit \`--submodule <path>\` wins (path as in \`.gitmodules\` code list).
   - Else if cwd is inside \`superRepoRoot/<code-gitmodules-path>/\`, use that path.
   - Else if cwd is inside \`.ai/memory/\`, do not treat memory-repo as code; fall through.
   - Else if exactly one code submodule has a tree under \`memoryRepoRoot\`, use it.
   - Else: **STOP** and list code \`.gitmodules\` paths for the orchestrator to pick.
4. Derive:
   - \`memoryRepoRoot = superRepoRoot / .ai/memory\`
   - \`submoduleRoot = superRepoRoot / submodulePath\`
   - \`memoryRoot = memoryRepoRoot / submodulePath\`
5. Sanity checks (fail closed): \`.gitmodules\` exists; code path listed; memory-repo present; memoryRoot under memoryRepoRoot (never under submoduleRoot).

## Outputs

\`superRepoRoot\`, \`submodulePath\`, \`submoduleRoot\`, \`memoryRepoRoot\`, \`memoryRoot\`
`;
  } else if (mapped.leaf === "sync-memory") {
    steps = `## Steps

1. Requires resolve-paths (\`memoryRepoRoot\`).
2. Ensure \`.ai/memory\` is a git checkout on \`main\`; \`git pull --ff-only origin main\`.
3. Fail closed if detached, on another branch, or pull is not fast-forward. Never create branches.
`;
  } else if (mapped.leaf === "commit-memory") {
    steps = `## Steps

1. After validated memory Apply under \`memoryRoot\`.
2. On memory-repo \`main\` only: stage under \`memoryRepoRoot\`, commit, \`git push origin main\`.
3. On push reject: rebase onto origin/main or STOP for HITL — never branch or open a PR/MR.
`;
  } else if (mapped.leaf === "resolve-config") {
    steps = `## Steps

1. Requires resolve-paths then sync-memory first.
2. Read \`memoryRoot/forge.json\`.
3. Ensure \`forge.json.path\` equals \`submodulePath\` (or note ensure-config must set it).
4. Expose host, github/gitlab identity, statusIds, release.gates.
5. Vendor identity comes from forge.json — do not parse remotes as authority.

## Outputs

Parsed forge config object for the active submodule.
`;
  } else if (mapped.leaf === "ensure-config") {
    steps = `## Steps

1. resolve-paths.
2. Look for \`memoryRoot/forge.json\`.
3. If missing, create a minimal stub with required fields: version, path, host, host identity; path frozen to submodulePath.
4. Conversationally populate with the user (board ids, statusIds, release.gates as needed).
5. Validate required fields; for board-sync events also require project/board + statusIds.
`;
  } else if (mapped.leaf === "init-memory") {
    steps = `## Steps

1. ensure-config first (forge.json must exist).
2. From plugin \`skills/<role>/templates/*.md\`, create missing files under memoryRoot:
   - product/, project/, architecture/, engineering/, qa/, security/, release/, marketing/
3. Map templates to memory paths using agent Docs conventions (e.g. product-owner brief → \`product/brief.md\`).
4. Do **not** overwrite non-empty existing memory files.
5. Safe to re-run (fills gaps only).
`;
  } else if (mapped.leaf === "validate-memory") {
    steps = `## Steps

1. For each proposed memory markdown file, load the matching role template from this plugin.
2. Require all template H2 headings present; forbid extra H2s; empty sections OK.
3. Validate forge.json: required fields; path == submodulePath; host block matches host.
4. On failure: include errors in HITL hand-off and **block Apply** for invalid files.
5. Prefer running \`node scripts/validate-memory.js\` when available.
`;
  } else if (mapped.leaf === "help") {
    steps = `## Steps

1. resolve-paths when possible; if ambiguous, explain \`FORGE_SUPER_REPO\` and \`--submodule\`. If \`.ai/memory\` memory-repo submodule is missing, say so.
2. Note memory is the shared memory-repo on \`main\` (sync-memory / commit-memory); do not pull/write on /forge.help.
3. Summarize SoT (board/SCM wins), memory layout, HITL, parent/subagent Apply rules.
4. List agents (one-liner) and event commands (cadence + lead), grouped.
5. Suggest 1–3 next commands from current state (missing memory-repo or forge.json → setup + /forge.init-project; etc.).
6. If topic arg provided, expand that agent/event contract.
7. **Never** write memory or call vendor mutations.
`;
  }

  // Vendor MCP mapping snippet from README if present
  if (kind === "vendor") {
    const esc = readmePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const block = readme.match(
      new RegExp(
        `skills/${esc}/SKILL\\.md\\n((?:        .+\\n)+)`
      )
    );
    if (block) {
      steps +=
        "\n## MCP mapping\n\n```\n" +
        block[1]
          .split("\n")
          .map((l) => l.replace(/^        /, ""))
          .join("\n")
          .trim() +
        "\n```\n";
    }
  }

  const skillMd = `---
name: ${mapped.leaf}
description: >-
  ${description.replace(/\n/g, " ").slice(0, 300)}
---

# ${mapped.leaf}

## When to use

Invoked by Forge event commands or agents for \`${readmePath}\`.

${steps}
`;
  writeFile(path.join(root, mapped.disk, "SKILL.md"), skillMd);
}

// Write skill naming map
const namingLines = [
  "# Skill naming map",
  "",
  "Cursor requires `name` in SKILL.md frontmatter to match the folder containing SKILL.md.",
  "Leaf folders are globally unique. README paths map as follows:",
  "",
  "| README path | Disk folder | Skill name |",
  "|---|---|---|",
];
for (const [k, v] of [...skillMap.entries()].sort()) {
  namingLines.push(`| skills/${k}/SKILL.md | ${v.disk}/ | ${v.leaf} |`);
}
writeFile(path.join(root, "docs/skill-naming.md"), namingLines.join("\n") + "\n");

// Inventory JSON for checklists
writeFile(
  path.join(root, "docs/inventory.json"),
  JSON.stringify(
    {
      agents: agentBlocks.map((a) => agentFileName(a.title)),
      events: events.map((e) => e.id),
      skills: [...skillMap.values()].map((v) => v.disk),
    },
    null,
    2
  ) + "\n"
);

console.log(
  JSON.stringify(
    {
      agents: agentBlocks.length,
      events: events.length,
      skills: skillMap.size,
      templates: templateBlocks.length,
    },
    null,
    2
  )
);
