import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  parseGitmodules,
  findSuperRepoRoot,
  resolveSubmodulePath,
  resolvePaths,
} from "../scripts/resolve-paths.js";

describe("parseGitmodules", () => {
  it("extracts paths", () => {
    const gm = `[submodule "a"]\n\tpath = apps/foo\n\turl = x\n[submodule "b"]\n\tpath = libs/bar\n`;
    expect(parseGitmodules(gm)).toEqual(["apps/foo", "libs/bar"]);
  });
});

describe("resolvePaths fixtures", () => {
  let tmp;
  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "forge-paths-"));
    fs.writeFileSync(
      path.join(tmp, ".gitmodules"),
      `[submodule "foo"]\n\tpath = apps/foo\n\turl = https://example.com/foo.git\n`
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
    const r = resolveSubmodulePath(tmp, path.join(tmp, "apps", "foo", "src"));
    expect(r.submodulePath).toBe("apps/foo");
  });

  it("resolvePaths ok", () => {
    const r = resolvePaths({ cwd: path.join(tmp, "apps", "foo") });
    expect(r.ok).toBe(true);
    expect(r.memoryRoot).toBe(path.join(tmp, ".ai", "memory", "apps", "foo"));
  });

  it("explicit submodule wins", () => {
    const r = resolvePaths({ cwd: tmp, submodule: "apps/foo" });
    expect(r.ok).toBe(true);
    expect(r.submodulePath).toBe("apps/foo");
  });
});
