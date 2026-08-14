#!/usr/bin/env node
/**
 * Resolve Forge super-repo + submodule paths.
 *
 * Usage:
 *   node scripts/resolve-paths.js [--cwd DIR] [--submodule PATH] [--super-repo DIR]
 *
 * Prints JSON {
 *   ok, superRepoRoot, submodulePath, submoduleRoot,
 *   memoryRepoRoot, memoryRoot, memoryRepoInitialized?, error?
 * }
 */
import fs from "node:fs";
import path from "node:path";

/** Fixed checkout path for the agent-owned memory-repo submodule. */
export const MEMORY_REPO_PATH = ".ai/memory";

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
    error: `Ambiguous submodule. Pass --submodule. Known: ${codePaths.join(", ") || "(none)"}`,
  };
}

export function resolvePaths({
  cwd = process.cwd(),
  submodule,
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

  const sm = resolveSubmodulePath(sr.root, cwd, submodule, entries);
  if (sm.error) return { ok: false, error: sm.error, superRepoRoot: sr.root };

  const memoryRepoRoot = path.join(sr.root, ...MEMORY_REPO_PATH.split("/"));
  const submoduleRoot = path.join(sr.root, sm.submodulePath);
  const memoryRoot = path.join(memoryRepoRoot, sm.submodulePath);

  return {
    ok: true,
    superRepoRoot: sr.root,
    submodulePath: sm.submodulePath,
    submoduleRoot,
    memoryRepoRoot,
    memoryRoot,
    memoryRepoInitialized: fs.existsSync(path.join(memoryRepoRoot, ".git")) ||
      fs.existsSync(memoryRepoRoot),
    submoduleInitialized: fs.existsSync(submoduleRoot),
  };
}

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--cwd") out.cwd = argv[++i];
    else if (argv[i] === "--submodule") out.submodule = argv[++i];
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
