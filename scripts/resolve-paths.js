#!/usr/bin/env node
/**
 * Resolve Forge super-repo + submodule paths.
 *
 * Usage:
 *   node scripts/resolve-paths.js [--cwd DIR] [--submodule PATH] [--super-repo DIR]
 *
 * Prints JSON { ok, superRepoRoot, submodulePath, submoduleRoot, memoryRoot, error? }
 */
import fs from "node:fs";
import path from "node:path";

export function parseGitmodules(content) {
  const paths = [];
  for (const m of content.matchAll(/^\s*path\s*=\s*(.+)$/gm)) {
    paths.push(m[1].trim());
  }
  return paths;
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

export function resolveSubmodulePath(superRepoRoot, cwd, explicitSubmodule) {
  const gm = fs.readFileSync(path.join(superRepoRoot, ".gitmodules"), "utf8");
  const submodules = parseGitmodules(gm);
  if (explicitSubmodule) {
    const p = explicitSubmodule.replace(/^\.\//, "").replace(/\/$/, "");
    if (!submodules.includes(p)) {
      return {
        error: `submodule "${p}" not in .gitmodules. Known: ${submodules.join(", ")}`,
      };
    }
    return { submodulePath: p };
  }
  const rel = path.relative(superRepoRoot, path.resolve(cwd));
  if (rel && !rel.startsWith("..")) {
    const match = submodules
      .filter((s) => rel === s || rel.startsWith(s + path.sep))
      .sort((a, b) => b.length - a.length)[0];
    if (match) return { submodulePath: match };
  }
  const memoryRoot = path.join(superRepoRoot, ".ai", "memory");
  const configured = submodules.filter((s) =>
    fs.existsSync(path.join(memoryRoot, s))
  );
  if (configured.length === 1) return { submodulePath: configured[0] };
  if (submodules.length === 1) return { submodulePath: submodules[0] };
  return {
    error: `Ambiguous submodule. Pass --submodule. Known: ${submodules.join(", ")}`,
  };
}

export function resolvePaths({
  cwd = process.cwd(),
  submodule,
  superRepo = process.env.FORGE_SUPER_REPO,
} = {}) {
  const sr = findSuperRepoRoot(cwd, superRepo);
  if (sr.error) return { ok: false, error: sr.error };
  const sm = resolveSubmodulePath(sr.root, cwd, submodule);
  if (sm.error) return { ok: false, error: sm.error, superRepoRoot: sr.root };
  const submoduleRoot = path.join(sr.root, sm.submodulePath);
  const memoryRoot = path.join(sr.root, ".ai", "memory", sm.submodulePath);
  return {
    ok: true,
    superRepoRoot: sr.root,
    submodulePath: sm.submodulePath,
    submoduleRoot,
    memoryRoot,
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
