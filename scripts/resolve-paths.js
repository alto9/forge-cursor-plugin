#!/usr/bin/env node
/**
 * Resolve Forge super-repo + event target (product or group).
 *
 * Usage:
 *   node scripts/resolve-paths.js [--cwd DIR] [--submodule PATH] [--product PATH]
 *     [--group ID] [--target NAME] [--super-repo DIR]
 *
 * Prints JSON. Product scope includes submodulePath + optional groupId/groupRoot.
 * Group scope includes groupId, groupRoot, members[] (no single submodulePath).
 */
import fs from "node:fs";
import path from "node:path";

/** Fixed checkout path for the agent-owned memory-repo submodule. */
export const MEMORY_REPO_PATH = ".ai/memory";

/** Reserved memory-repo folder for shared product-family docs (not a code submodule). */
export const GROUPS_DIR = "groups";

/** Docs that live under groups/<id>/ when a product has forge.json.group set. */
export const GROUP_OWNED_DOCS = [
  "marketing/positioning.md",
  "marketing/messaging.md",
  "marketing/voice.md",
  "marketing/calendar.md",
  "marketing/social-queue.md",
  "product/personas.md",
  "product/competitive.md",
  "design/principles.md",
];

/**
 * Parse .gitmodules into submodule entries.
 * @returns {{ path: string, url?: string, branch?: string }[]}
 */
export function parseGitmodules(content) {
  const entries = [];
  let current = null;
  for (const line of content.split(/\r?\n/)) {
    const section = line.match(/^\s*\[submodule\s+"[^"]+"\]\s*$/);
    if (section) {
      current = {};
      entries.push(current);
      continue;
    }
    if (!current) continue;
    const kv = line.match(/^\s*([a-zA-Z0-9_-]+)\s*=\s*(.+)$/);
    if (!kv) continue;
    const key = kv[1].trim();
    const value = kv[2].trim();
    if (key === "path") current.path = value;
    else if (key === "url") current.url = value;
    else if (key === "branch") current.branch = value;
  }
  return entries.filter((e) => e.path);
}

/** Path list only (code + memory). Prefer parseGitmodules for full entries. */
export function parseGitmodulesPaths(content) {
  return parseGitmodules(content).map((e) => e.path);
}

export function findMemoryRepoEntry(entries) {
  return entries.find((e) => e.path === MEMORY_REPO_PATH) || null;
}

export function codeSubmodulePaths(entries) {
  return entries
    .map((e) => e.path)
    .filter((p) => p !== MEMORY_REPO_PATH);
}

export function findSuperRepoRoot(startDir, explicit) {
  if (explicit) {
    const root = path.resolve(explicit);
    if (!fs.existsSync(path.join(root, ".gitmodules"))) {
      return { error: `FORGE_SUPER_REPO/explicit root missing .gitmodules: ${root}` };
    }
    return { root };
  }
  let dir = path.resolve(startDir);
  const candidates = [];
  for (;;) {
    if (fs.existsSync(path.join(dir, ".gitmodules"))) {
      candidates.push(dir);
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  if (candidates.length === 0) {
    return { error: "No .gitmodules found walking up from cwd; set FORGE_SUPER_REPO" };
  }
  const withMemory = candidates.filter((c) =>
    fs.existsSync(path.join(c, ".ai", "memory"))
  );
  const pool = withMemory.length ? withMemory : candidates;
  if (pool.length > 1) {
    return {
      error: `Ambiguous super-repo roots: ${pool.join(", ")}. Set FORGE_SUPER_REPO.`,
    };
  }
  return { root: pool[0] };
}

export function listGroupIds(memoryRepoRoot) {
  const groupsRoot = path.join(memoryRepoRoot, GROUPS_DIR);
  if (!fs.existsSync(groupsRoot)) return [];
  return fs
    .readdirSync(groupsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((id) => fs.existsSync(path.join(groupsRoot, id, "group.json")));
}

export function readGroupJson(memoryRepoRoot, groupId) {
  const groupPath = path.join(memoryRepoRoot, GROUPS_DIR, groupId, "group.json");
  if (!fs.existsSync(groupPath)) {
    return { error: `Missing groups/${groupId}/group.json` };
  }
  try {
    const obj = JSON.parse(fs.readFileSync(groupPath, "utf8"));
    if (!obj?.id || obj.id !== groupId) {
      return {
        error: `groups/${groupId}/group.json id must equal folder name "${groupId}"`,
      };
    }
    if (!Array.isArray(obj.members) || obj.members.length === 0) {
      return { error: `groups/${groupId}/group.json members[] required` };
    }
    return { group: obj };
  } catch (e) {
    return { error: `groups/${groupId}/group.json parse error: ${e.message}` };
  }
}

export function readForgeJson(memoryRoot) {
  const forgePath = path.join(memoryRoot, "forge.json");
  if (!fs.existsSync(forgePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(forgePath, "utf8"));
  } catch {
    return null;
  }
}

function productMember(superRepoRoot, memoryRepoRoot, submodulePath) {
  const memoryRoot = path.join(memoryRepoRoot, submodulePath);
  const forge = readForgeJson(memoryRoot);
  return {
    submodulePath,
    submoduleRoot: path.join(superRepoRoot, submodulePath),
    memoryRoot,
    forge,
    kind: forge?.kind || "app",
  };
}

function attachGroupIfMember(memoryRepoRoot, member) {
  const groupId = member.forge?.group;
  if (!groupId) return {};
  const g = readGroupJson(memoryRepoRoot, groupId);
  if (g.error) return { groupError: g.error };
  return {
    groupId,
    groupRoot: path.join(memoryRepoRoot, GROUPS_DIR, groupId),
  };
}

export function resolveSubmodulePath(superRepoRoot, cwd, explicitSubmodule, entries) {
  const codePaths = codeSubmodulePaths(entries);
  if (explicitSubmodule) {
    const p = explicitSubmodule.replace(/^\.\//, "").replace(/\/$/, "");
    if (p === MEMORY_REPO_PATH) {
      return {
        error: `".ai/memory" is the memory-repo, not a code submodule. Pass a code path. Known: ${codePaths.join(", ") || "(none)"}`,
      };
    }
    if (!codePaths.includes(p)) {
      return {
        error: `submodule "${p}" not in .gitmodules code list. Known: ${codePaths.join(", ") || "(none)"}`,
      };
    }
    return { submodulePath: p };
  }
  const rel = path.relative(superRepoRoot, path.resolve(cwd));
  if (rel && !rel.startsWith("..")) {
    // cwd inside memory-repo must not resolve as a code submodule
    if (rel === MEMORY_REPO_PATH || rel.startsWith(MEMORY_REPO_PATH + path.sep)) {
      // fall through to configured / unique code submodule
    } else {
      const match = codePaths
        .filter((s) => rel === s || rel.startsWith(s + path.sep))
        .sort((a, b) => b.length - a.length)[0];
      if (match) return { submodulePath: match };
    }
  }
  const memoryRepoRoot = path.join(superRepoRoot, ...MEMORY_REPO_PATH.split("/"));
  const configured = codePaths.filter((s) =>
    fs.existsSync(path.join(memoryRepoRoot, s))
  );
  if (configured.length === 1) return { submodulePath: configured[0] };
  if (codePaths.length === 1) return { submodulePath: codePaths[0] };
  return {
    error: `Ambiguous submodule. Pass --submodule / --product, or --group. Known products: ${codePaths.join(", ") || "(none)"}; groups: ${listGroupIds(memoryRepoRoot).join(", ") || "(none)"}`,
  };
}

/**
 * Resolve bare reference: group id first, then exact code path, then unique basename match.
 * Never guess when both a group and a path could apply.
 */
export function resolveBareTarget(memoryRepoRoot, codePaths, name) {
  const n = name.replace(/^\.\//, "").replace(/\/$/, "");
  const groupIds = listGroupIds(memoryRepoRoot);
  const groupHit = groupIds.includes(n);
  const pathHit = codePaths.includes(n);
  const baseHits = codePaths.filter(
    (p) => p === n || p.endsWith("/" + n) || path.basename(p) === n
  );

  if (groupHit && (pathHit || baseHits.length > 0)) {
    return {
      error: `Ambiguous target "${n}" — matches group and product path. Pass --group ${n} or --submodule <path>.`,
    };
  }
  if (groupHit) return { scope: "group", groupId: n };
  if (pathHit) return { scope: "product", submodulePath: n };
  if (baseHits.length === 1) return { scope: "product", submodulePath: baseHits[0] };
  if (baseHits.length > 1) {
    return {
      error: `Ambiguous product "${n}": ${baseHits.join(", ")}. Pass full --submodule path.`,
    };
  }
  return {
    error: `Unknown target "${n}". Groups: ${groupIds.join(", ") || "(none)"}; products: ${codePaths.join(", ") || "(none)"}`,
  };
}

export function resolveGroupScope(superRepoRoot, memoryRepoRoot, groupId, codePaths) {
  const g = readGroupJson(memoryRepoRoot, groupId);
  if (g.error) return { ok: false, error: g.error };
  const members = [];
  for (const m of g.group.members) {
    if (!codePaths.includes(m)) {
      return {
        ok: false,
        error: `groups/${groupId}/group.json member "${m}" not in .gitmodules code list`,
      };
    }
    members.push(productMember(superRepoRoot, memoryRepoRoot, m));
  }
  return {
    ok: true,
    scope: "group",
    superRepoRoot,
    memoryRepoRoot,
    groupId,
    groupRoot: path.join(memoryRepoRoot, GROUPS_DIR, groupId),
    members,
    memoryRepoInitialized:
      fs.existsSync(path.join(memoryRepoRoot, ".git")) ||
      fs.existsSync(memoryRepoRoot),
  };
}

export function resolveProductScope(superRepoRoot, memoryRepoRoot, submodulePath) {
  const member = productMember(superRepoRoot, memoryRepoRoot, submodulePath);
  const groupBits = attachGroupIfMember(memoryRepoRoot, member);
  if (groupBits.groupError) {
    return { ok: false, error: groupBits.groupError, superRepoRoot };
  }
  return {
    ok: true,
    scope: "product",
    superRepoRoot,
    submodulePath,
    submoduleRoot: member.submoduleRoot,
    memoryRepoRoot,
    memoryRoot: member.memoryRoot,
    kind: member.kind,
    forge: member.forge,
    ...groupBits,
    memoryRepoInitialized:
      fs.existsSync(path.join(memoryRepoRoot, ".git")) ||
      fs.existsSync(memoryRepoRoot),
    submoduleInitialized: fs.existsSync(member.submoduleRoot),
  };
}

export function resolvePaths({
  cwd = process.cwd(),
  submodule,
  product,
  group,
  target,
  superRepo = process.env.FORGE_SUPER_REPO,
} = {}) {
  const sr = findSuperRepoRoot(cwd, superRepo);
  if (sr.error) return { ok: false, error: sr.error };

  let entries;
  try {
    const gm = fs.readFileSync(path.join(sr.root, ".gitmodules"), "utf8");
    entries = parseGitmodules(gm);
  } catch (e) {
    return { ok: false, error: `Cannot read .gitmodules: ${e.message}`, superRepoRoot: sr.root };
  }

  const memoryEntry = findMemoryRepoEntry(entries);
  if (!memoryEntry) {
    return {
      ok: false,
      error:
        `Missing memory-repo submodule at path "${MEMORY_REPO_PATH}". ` +
        `Add it: git submodule add -b main <url> .ai/memory`,
      superRepoRoot: sr.root,
    };
  }

  const memoryRepoRoot = path.join(sr.root, ...MEMORY_REPO_PATH.split("/"));
  const codePaths = codeSubmodulePaths(entries);
  const productPath = product || submodule;

  if (group && (productPath || target)) {
    return {
      ok: false,
      error: "Pass only one of --group or --submodule/--product/--target",
      superRepoRoot: sr.root,
    };
  }

  if (group) {
    return resolveGroupScope(sr.root, memoryRepoRoot, group, codePaths);
  }

  if (target && !productPath) {
    const bare = resolveBareTarget(memoryRepoRoot, codePaths, target);
    if (bare.error) return { ok: false, error: bare.error, superRepoRoot: sr.root };
    if (bare.scope === "group") {
      return resolveGroupScope(sr.root, memoryRepoRoot, bare.groupId, codePaths);
    }
    return resolveProductScope(sr.root, memoryRepoRoot, bare.submodulePath);
  }

  const sm = resolveSubmodulePath(sr.root, cwd, productPath, entries);
  if (sm.error) return { ok: false, error: sm.error, superRepoRoot: sr.root };
  return resolveProductScope(sr.root, memoryRepoRoot, sm.submodulePath);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--cwd") out.cwd = argv[++i];
    else if (argv[i] === "--submodule") out.submodule = argv[++i];
    else if (argv[i] === "--product") out.product = argv[++i];
    else if (argv[i] === "--group") out.group = argv[++i];
    else if (argv[i] === "--target") out.target = argv[++i];
    else if (argv[i] === "--super-repo") out.superRepo = argv[++i];
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv);
  const result = resolvePaths(args);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

if (process.argv[1] && process.argv[1].endsWith("resolve-paths.js")) {
  main();
}
