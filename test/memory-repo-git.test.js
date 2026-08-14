import { describe, it, expect } from "vitest";
import {
  syncMemory,
  commitMemory,
  assertOnMain,
  MEMORY_MAIN,
} from "../scripts/memory-repo-git.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function makeRun(script) {
  let i = 0;
  return (cwd, args) => {
    const key = args.join(" ");
    const step = script[i++];
    if (!step) throw new Error(`Unexpected git call: ${key} in ${cwd}`);
    if (step.match && !step.match.test(key)) {
      throw new Error(`Expected /${step.match}/ got: ${key}`);
    }
    if (step.throw) {
      const err = new Error(step.throw);
      err.stderr = step.throw;
      throw err;
    }
    return step.out ?? "";
  };
}

describe("assertOnMain", () => {
  it("ok on main", () => {
    const run = makeRun([{ match: /rev-parse/, out: "main" }]);
    expect(assertOnMain("/mem", run).ok).toBe(true);
  });

  it("rejects other branch", () => {
    const run = makeRun([{ match: /rev-parse/, out: "feature" }]);
    const r = assertOnMain("/mem", run);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/must be on main/);
  });

  it("rejects detached HEAD", () => {
    const run = makeRun([{ match: /rev-parse/, out: "HEAD" }]);
    const r = assertOnMain("/mem", run);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/detached/i);
  });
});

describe("syncMemory", () => {
  let tmp;
  it("pulls ff-only on main", () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "forge-mem-"));
    fs.mkdirSync(path.join(tmp, ".git"));
    const run = makeRun([
      { match: /rev-parse/, out: "main" },
      { match: /rev-parse/, out: "main" },
      { match: /pull --ff-only origin main/, out: "Already up to date." },
    ]);
    const r = syncMemory(tmp, { run });
    expect(r.ok).toBe(true);
    expect(r.action).toBe("sync");
    expect(r.branch).toBe(MEMORY_MAIN);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("refuses non-main branch", () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "forge-mem-"));
    fs.mkdirSync(path.join(tmp, ".git"));
    const run = makeRun([{ match: /rev-parse/, out: "dev" }]);
    const r = syncMemory(tmp, { run });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/must be on main/);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("skips pull when origin/main missing", () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "forge-mem-"));
    fs.mkdirSync(path.join(tmp, ".git"));
    const run = makeRun([
      { match: /rev-parse/, out: "main" },
      { match: /rev-parse/, out: "main" },
      { match: /pull --ff-only/, throw: "couldn't find remote ref main" },
    ]);
    const r = syncMemory(tmp, { run });
    expect(r.ok).toBe(true);
    expect(r.skipped).toBe(true);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("fails if path missing", () => {
    const r = syncMemory("/tmp/forge-memory-does-not-exist-xyz");
    expect(r.ok).toBe(false);
  });
});

describe("commitMemory", () => {
  let tmp;
  it("refuses absolute file paths", () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "forge-mem-"));
    fs.mkdirSync(path.join(tmp, ".git"));
    const run = makeRun([{ match: /rev-parse/, out: "main" }]);
    const r = commitMemory(tmp, {
      files: ["/etc/passwd"],
      run,
    });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/outside memory-repo/);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("refuses .. paths", () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "forge-mem-"));
    fs.mkdirSync(path.join(tmp, ".git"));
    const run = makeRun([{ match: /rev-parse/, out: "main" }]);
    const r = commitMemory(tmp, { files: ["../escape.md"], run });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/outside memory-repo/);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("commits and pushes on main", () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "forge-mem-"));
    fs.mkdirSync(path.join(tmp, ".git"));
    const run = makeRun([
      { match: /rev-parse/, out: "main" },
      { match: /^add /, out: "" },
      { match: /status --porcelain/, out: "M  apps/foo/product/brief.md" },
      { match: /^commit /, out: "" },
      { match: /push origin main/, out: "" },
    ]);
    const r = commitMemory(tmp, {
      files: ["apps/foo/product/brief.md"],
      message: "chore(memory): test",
      run,
    });
    expect(r.ok).toBe(true);
    expect(r.pushed).toBe(true);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("no-ops when nothing to commit", () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "forge-mem-"));
    fs.mkdirSync(path.join(tmp, ".git"));
    const run = makeRun([
      { match: /rev-parse/, out: "main" },
      { match: /^add /, out: "" },
      { match: /status --porcelain/, out: "" },
    ]);
    const r = commitMemory(tmp, { files: ["apps/foo/x.md"], run });
    expect(r.ok).toBe(true);
    expect(r.skipped).toBe(true);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("refuses non-main", () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "forge-mem-"));
    fs.mkdirSync(path.join(tmp, ".git"));
    const run = makeRun([{ match: /rev-parse/, out: "topic" }]);
    const r = commitMemory(tmp, { run });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/must be on main/);
    fs.rmSync(tmp, { recursive: true, force: true });
  });
});
