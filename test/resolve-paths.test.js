import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  parseGitmodules,
  parseGitmodulesPaths,
  findMemoryRepoEntry,
  codeSubmodulePaths,
  findSuperRepoRoot,
  resolveSubmodulePath,
  resolvePaths,
  MEMORY_REPO_PATH,
} from "../scripts/resolve-paths.js";

describe("parseGitmodules", () => {
  it("extracts entries with path url branch", () => {
    const gm = `[submodule "a"]
\tpath = apps/foo
\turl = x
[submodule "mem"]
\tpath = .ai/memory
\turl = https://example.com/memory.git
\tbranch = main
`;
    expect(parseGitmodules(gm)).toEqual([
      { path: "apps/foo", url: "x" },
      {
        path: ".ai/memory",
        url: "https://example.com/memory.git",
        branch: "main",
      },
    ]);
  });

  it("parseGitmodulesPaths returns path list", () => {
    const gm = `[submodule "a"]\n\tpath = apps/foo\n\turl = x\n[submodule "b"]\n\tpath = libs/bar\n`;
    expect(parseGitmodulesPaths(gm)).toEqual(["apps/foo", "libs/bar"]);
  });
});

describe("memory-repo helpers", () => {
  it("findMemoryRepoEntry and codeSubmodulePaths", () => {
    const entries = [
      { path: "apps/foo", url: "x" },
      { path: ".ai/memory", url: "y", branch: "main" },
    ];
    expect(findMemoryRepoEntry(entries)?.path).toBe(MEMORY_REPO_PATH);
    expect(codeSubmodulePaths(entries)).toEqual(["apps/foo"]);
  });
});

describe("resolvePaths fixtures", () => {
  let tmp;
  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "forge-paths-"));
    fs.writeFileSync(
      path.join(tmp, ".gitmodules"),
      `[submodule "foo"]
\tpath = apps/foo
\turl = https://example.com/foo.git
[submodule "forge-memory"]
\tpath = .ai/memory
\turl = https://example.com/memory.git
\tbranch = main
`
    );
    fs.mkdirSync(path.join(tmp, "apps", "foo"), { recursive: true });
    fs.mkdirSync(path.join(tmp, ".ai", "memory", "apps", "foo"), {
      recursive: true,
    });
  });
  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("finds super-repo from cwd inside submodule", () => {
    const r = findSuperRepoRoot(path.join(tmp, "apps", "foo"));
    expect(r.root).toBe(tmp);
  });

  it("resolves submodule from cwd", () => {
    const gm = fs.readFileSync(path.join(tmp, ".gitmodules"), "utf8");
    const entries = parseGitmodules(gm);
    const r = resolveSubmodulePath(
      tmp,
      path.join(tmp, "apps", "foo", "src"),
      undefined,
      entries
    );
    expect(r.submodulePath).toBe("apps/foo");
  });

  it("resolvePaths ok with memoryRepoRoot", () => {
    const r = resolvePaths({ cwd: path.join(tmp, "apps", "foo") });
    expect(r.ok).toBe(true);
    expect(r.memoryRepoRoot).toBe(path.join(tmp, ".ai", "memory"));
    expect(r.memoryRoot).toBe(path.join(tmp, ".ai", "memory", "apps", "foo"));
  });

  it("explicit submodule wins", () => {
    const r = resolvePaths({ cwd: tmp, submodule: "apps/foo" });
    expect(r.ok).toBe(true);
    expect(r.submodulePath).toBe("apps/foo");
  });

  it("fails when memory-repo submodule is missing", () => {
    fs.writeFileSync(
      path.join(tmp, ".gitmodules"),
      `[submodule "foo"]\n\tpath = apps/foo\n\turl = https://example.com/foo.git\n`
    );
    const r = resolvePaths({ cwd: path.join(tmp, "apps", "foo") });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/Missing memory-repo/);
  });

  it("excludes .ai/memory from code submodule resolution via cwd", () => {
    const r = resolvePaths({
      cwd: path.join(tmp, ".ai", "memory", "apps", "foo"),
    });
    expect(r.ok).toBe(true);
    expect(r.submodulePath).toBe("apps/foo");
  });

  it("refuses --submodule .ai/memory", () => {
    const r = resolvePaths({ cwd: tmp, submodule: ".ai/memory" });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/memory-repo/);
  });
});
