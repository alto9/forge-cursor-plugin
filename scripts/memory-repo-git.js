#!/usr/bin/env node
/**
 * Memory-repo git protocol: sync (pull main) and commit (push main).
 *
 * Usage:
 *   node scripts/memory-repo-git.js sync --memory-repo-root <path>
 *   node scripts/memory-repo-git.js commit --memory-repo-root <path> [--message MSG] [--dry-run]
 *
 * Prints JSON { ok, action, ... }. Exit 0 on success; 1 on failure.
 *
 * For tests, pass { run } inject that mimics child_process.execFileSync
 * returning stdout string (or throw).
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

export const MEMORY_MAIN = "main";

function defaultRun(cwd, args) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function isGitCheckout(root) {
  return (
    fs.existsSync(path.join(root, ".git")) ||
    // submodule: .git may be a file pointing at .git/modules/...
    (fs.existsSync(root) && fs.existsSync(path.join(root, ".git")))
  );
}

export function currentBranch(memoryRepoRoot, run = defaultRun) {
  try {
    return run(memoryRepoRoot, ["rev-parse", "--abbrev-ref", "HEAD"]);
  } catch {
    return null;
  }
}

export function assertOnMain(memoryRepoRoot, run = defaultRun) {
  const branch = currentBranch(memoryRepoRoot, run);
  if (!branch) {
    return { ok: false, error: `Not a git checkout or detached: ${memoryRepoRoot}` };
  }
  if (branch === "HEAD") {
    return {
      ok: false,
      error: `Memory-repo is detached HEAD; checkout ${MEMORY_MAIN} first: ${memoryRepoRoot}`,
    };
  }
  if (branch !== MEMORY_MAIN) {
    return {
      ok: false,
      error: `Memory-repo must be on ${MEMORY_MAIN} (found "${branch}"): ${memoryRepoRoot}`,
    };
  }
  return { ok: true, branch };
}

/**
 * Ensure memory-repo is on main and fast-forward pull origin/main.
 */
export function syncMemory(memoryRepoRoot, { run = defaultRun } = {}) {
  if (!fs.existsSync(memoryRepoRoot)) {
    return {
      ok: false,
      action: "sync",
      error: `memoryRepoRoot does not exist: ${memoryRepoRoot}`,
    };
  }
  if (!isGitCheckout(memoryRepoRoot)) {
    return {
      ok: false,
      action: "sync",
      error:
        `memoryRepoRoot is not a git checkout: ${memoryRepoRoot}. ` +
        `Initialize the .ai/memory submodule.`,
    };
  }

  try {
    // Prefer explicit checkout main if possible
    const branch = currentBranch(memoryRepoRoot, run);
    if (branch === "HEAD") {
      try {
        run(memoryRepoRoot, ["checkout", MEMORY_MAIN]);
      } catch (e) {
        return {
          ok: false,
          action: "sync",
          error: `Detached HEAD and cannot checkout ${MEMORY_MAIN}: ${e.message || e}`,
        };
      }
    } else if (branch && branch !== MEMORY_MAIN) {
      return {
        ok: false,
        action: "sync",
        error: `Memory-repo must be on ${MEMORY_MAIN} (found "${branch}")`,
      };
    }

    const onMain = assertOnMain(memoryRepoRoot, run);
    if (!onMain.ok) {
      // Empty repo: no commits yet — allow sync no-op so init can commit-memory first
      try {
        run(memoryRepoRoot, ["rev-parse", "HEAD"]);
      } catch {
        return {
          ok: true,
          action: "sync",
          skipped: true,
          reason: "empty memory-repo (no commits yet); proceed to seed + commit-memory",
        };
      }
      return { ...onMain, action: "sync" };
    }

    try {
      run(memoryRepoRoot, ["pull", "--ff-only", "origin", MEMORY_MAIN]);
      return { ok: true, action: "sync", branch: MEMORY_MAIN };
    } catch (e) {
      const msg = String(e.stderr || e.message || e);
      // Remote may not have main until first push
      if (/couldn't find remote ref|does not exist|unknown revision|no such ref/i.test(msg)) {
        return {
          ok: true,
          action: "sync",
          skipped: true,
          reason: "origin/main not published yet; proceed to seed + commit-memory",
        };
      }
      return {
        ok: false,
        action: "sync",
        error: `sync-memory failed: ${msg}`,
      };
    }
  } catch (e) {
    return {
      ok: false,
      action: "sync",
      error: `sync-memory failed: ${e.stderr || e.message || e}`,
    };
  }
}

/**
 * After memory Apply: stage only under memoryRepoRoot, commit on main, push.
 * Paths in `files` are relative to memoryRepoRoot (optional; default all changes).
 */
export function commitMemory(
  memoryRepoRoot,
  {
    message = "chore(memory): apply harness memory updates",
    files,
    dryRun = false,
    run = defaultRun,
    maxPushRetries = 2,
  } = {}
) {
  if (!fs.existsSync(memoryRepoRoot)) {
    return {
      ok: false,
      action: "commit",
      error: `memoryRepoRoot does not exist: ${memoryRepoRoot}`,
    };
  }
  if (!isGitCheckout(memoryRepoRoot)) {
    return {
      ok: false,
      action: "commit",
      error: `memoryRepoRoot is not a git checkout: ${memoryRepoRoot}`,
    };
  }

  const onMain = assertOnMain(memoryRepoRoot, run);
  if (!onMain.ok) return { ...onMain, action: "commit" };

  try {
    if (files && files.length) {
      for (const f of files) {
        const rel = f.replace(/^\.\//, "");
        if (rel.startsWith("..") || path.isAbsolute(rel)) {
          return {
            ok: false,
            action: "commit",
            error: `Refusing path outside memory-repo: ${f}`,
          };
        }
        const abs = path.resolve(memoryRepoRoot, rel);
        if (!abs.startsWith(path.resolve(memoryRepoRoot) + path.sep) && abs !== path.resolve(memoryRepoRoot)) {
          return {
            ok: false,
            action: "commit",
            error: `Refusing path outside memory-repo: ${f}`,
          };
        }
      }
      if (!dryRun) run(memoryRepoRoot, ["add", "--", ...files]);
    } else if (!dryRun) {
      run(memoryRepoRoot, ["add", "-A", "--", "."]);
    }

    let status;
    try {
      status = run(memoryRepoRoot, ["status", "--porcelain"]);
    } catch (e) {
      return {
        ok: false,
        action: "commit",
        error: `git status failed: ${e.message || e}`,
      };
    }

    if (!status) {
      return { ok: true, action: "commit", skipped: true, reason: "nothing to commit" };
    }

    // Refuse if any staged path escapes (paranoia: status should be relative)
    for (const line of status.split("\n")) {
      const p = line.slice(3).trim();
      if (!p) continue;
      if (p.startsWith("..") || path.isAbsolute(p)) {
        return {
          ok: false,
          action: "commit",
          error: `Staged path escapes memory-repo: ${p}`,
        };
      }
    }

    if (dryRun) {
      return { ok: true, action: "commit", dryRun: true, status };
    }

    run(memoryRepoRoot, ["commit", "-m", message]);

    let lastErr;
    for (let i = 0; i <= maxPushRetries; i++) {
      try {
        run(memoryRepoRoot, ["push", "origin", MEMORY_MAIN]);
        return { ok: true, action: "commit", pushed: true, branch: MEMORY_MAIN };
      } catch (e) {
        lastErr = e;
        if (i === maxPushRetries) break;
        try {
          run(memoryRepoRoot, ["pull", "--rebase", "--autostash", "origin", MEMORY_MAIN]);
        } catch (re) {
          return {
            ok: false,
            action: "commit",
            error:
              `Push rejected and rebase failed (stop for HITL; do not create a branch): ` +
              `${re.stderr || re.message || re}`,
          };
        }
      }
    }
    return {
      ok: false,
      action: "commit",
      error: `push origin ${MEMORY_MAIN} failed: ${lastErr?.stderr || lastErr?.message || lastErr}`,
    };
  } catch (e) {
    return {
      ok: false,
      action: "commit",
      error: `commit-memory failed: ${e.stderr || e.message || e}`,
    };
  }
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--memory-repo-root") out.memoryRepoRoot = argv[++i];
    else if (a === "--message") out.message = argv[++i];
    else if (a === "--dry-run") out.dryRun = true;
    else if (a === "--file") {
      out.files = out.files || [];
      out.files.push(argv[++i]);
    } else if (!a.startsWith("-")) out._.push(a);
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv);
  const action = args._[0];
  if (!args.memoryRepoRoot) {
    console.log(
      JSON.stringify({
        ok: false,
        error: "Required: --memory-repo-root <path>",
      })
    );
    process.exit(1);
  }
  let result;
  if (action === "sync") {
    result = syncMemory(args.memoryRepoRoot);
  } else if (action === "commit") {
    result = commitMemory(args.memoryRepoRoot, {
      message: args.message,
      files: args.files,
      dryRun: args.dryRun,
    });
  } else {
    result = {
      ok: false,
      error: `Unknown action "${action}". Use sync | commit`,
    };
  }
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

if (process.argv[1] && process.argv[1].endsWith("memory-repo-git.js")) {
  main();
}
