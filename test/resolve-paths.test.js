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

  it("resolves --group with members", () => {
    fs.mkdirSync(path.join(tmp, "apps", "bar"), { recursive: true });
    fs.mkdirSync(path.join(tmp, ".ai", "memory", "apps", "bar"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(tmp, ".gitmodules"),
      `[submodule "foo"]
\tpath = apps/foo
\turl = https://example.com/foo.git
[submodule "bar"]
\tpath = apps/bar
\turl = https://example.com/bar.git
[submodule "forge-memory"]
\tpath = .ai/memory
\turl = https://example.com/memory.git
\tbranch = main
`
    );
    fs.mkdirSync(path.join(tmp, ".ai", "memory", "groups", "acme"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(tmp, ".ai", "memory", "groups", "acme", "group.json"),
      JSON.stringify({ id: "acme", members: ["apps/foo", "apps/bar"] })
    );
    fs.writeFileSync(
      path.join(tmp, ".ai", "memory", "apps", "foo", "forge.json"),
      JSON.stringify({
        version: 1,
        path: "apps/foo",
        host: "github",
        github: { owner: "o", repo: "foo" },
        group: "acme",
      })
    );
    const r = resolvePaths({ cwd: tmp, group: "acme" });
    expect(r.ok).toBe(true);
    expect(r.scope).toBe("group");
    expect(r.groupId).toBe("acme");
    expect(r.members.map((m) => m.submodulePath)).toEqual([
      "apps/foo",
      "apps/bar",
    ]);
  });

  it("bare --target prefers group id", () => {
    fs.mkdirSync(path.join(tmp, ".ai", "memory", "groups", "acme"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(tmp, ".ai", "memory", "groups", "acme", "group.json"),
      JSON.stringify({ id: "acme", members: ["apps/foo"] })
    );
    const r = resolvePaths({ cwd: tmp, target: "acme" });
    expect(r.ok).toBe(true);
    expect(r.scope).toBe("group");
    expect(r.groupId).toBe("acme");
  });

  it("product scope attaches groupRoot from forge.json.group", () => {
    fs.mkdirSync(path.join(tmp, ".ai", "memory", "groups", "acme"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(tmp, ".ai", "memory", "groups", "acme", "group.json"),
      JSON.stringify({ id: "acme", members: ["apps/foo"] })
    );
    fs.writeFileSync(
      path.join(tmp, ".ai", "memory", "apps", "foo", "forge.json"),
      JSON.stringify({
        version: 1,
        path: "apps/foo",
        host: "github",
        github: { owner: "o", repo: "foo" },
        group: "acme",
        kind: "app",
      })
    );
    const r = resolvePaths({ cwd: path.join(tmp, "apps", "foo") });
    expect(r.ok).toBe(true);
    expect(r.scope).toBe("product");
    expect(r.groupId).toBe("acme");
    expect(r.groupRoot).toBe(path.join(tmp, ".ai", "memory", "groups", "acme"));
    expect(r.kind).toBe("app");
  });
});
