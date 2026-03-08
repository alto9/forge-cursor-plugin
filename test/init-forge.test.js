import { describe, it, expect, afterEach } from "vitest";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import os from "os";
import { spawnSync } from "child_process";
import { collectPaths } from "../skills/init-forge/scripts/init-forge.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = path.resolve(__dirname, "..");
const SCRIPT_PATH = path.join(PLUGIN_ROOT, "skills", "init-forge", "scripts", "init-forge.js");

function runInitForge(args = []) {
  const result = spawnSync("node", [SCRIPT_PATH, ...args], {
    cwd: PLUGIN_ROOT,
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout || "", stderr: result.stderr || "" };
}

describe("init-forge collectPaths", () => {
  it("collects string paths", () => {
    const paths = collectPaths(".forge/vision.json");
    expect(paths).toEqual(new Set([".forge/vision.json"]));
  });

  it("collects from array of strings", () => {
    const paths = collectPaths([".forge/a.json", ".forge/b.md"]);
    expect(paths).toEqual(new Set([".forge/a.json", ".forge/b.md"]));
  });

  it("collects primary_doc from object", () => {
    const paths = collectPaths({ primary_doc: ".forge/vision.json" });
    expect(paths).toEqual(new Set([".forge/vision.json"]));
  });

  it("recursively collects from children", () => {
    const node = {
      primary_doc: ".forge/vision.json",
      children: [
        ".forge/project.json",
        { primary_doc: ".forge/runtime/index.md", children: [".forge/runtime/config.md"] },
      ],
    };
    const paths = collectPaths(node);
    expect(paths).toContain(".forge/vision.json");
    expect(paths).toContain(".forge/project.json");
    expect(paths).toContain(".forge/runtime/index.md");
    expect(paths).toContain(".forge/runtime/config.md");
  });

  it("collects from knowledge_map structure", () => {
    const data = {
      knowledge_map: [
        {
          name: "vision",
          primary_doc: ".forge/vision.json",
          children: [".forge/project.json", ".forge/roadmap.json"],
        },
      ],
    };
    const paths = collectPaths(data.knowledge_map);
    expect(paths).toContain(".forge/vision.json");
    expect(paths).toContain(".forge/project.json");
    expect(paths).toContain(".forge/roadmap.json");
  });
});

describe("init-forge integration", () => {
  let testDir;

  afterEach(() => {
    if (testDir && fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  it("--help exits 0 and prints Usage and knowledge_map", () => {
    const { status, stdout } = runInitForge(["--help"]);
    expect(status).toBe(0);
    expect(stdout).toContain("Usage");
    expect(stdout).toContain("knowledge_map");
  });

  it("scaffolds .forge in target directory", () => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), "init-forge-test-"));
    const { status } = runInitForge([testDir]);
    expect(status).toBe(0);
    expect(fs.existsSync(path.join(testDir, ".forge"))).toBe(true);
    expect(fs.existsSync(path.join(testDir, ".forge", "vision.json"))).toBe(true);
    expect(fs.existsSync(path.join(testDir, ".forge", "project.json"))).toBe(true);
    expect(fs.existsSync(path.join(testDir, ".forge", "roadmap.json"))).toBe(true);
    expect(fs.existsSync(path.join(testDir, ".forge", "skill_registry.json"))).toBe(true);
    expect(fs.existsSync(path.join(testDir, ".forge", "knowledge_map.json"))).toBe(true);
    expect(fs.existsSync(path.join(testDir, ".forge", "schemas"))).toBe(true);
  });

  it("creates domain folders", () => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), "init-forge-test-"));
    const { status } = runInitForge([testDir]);
    expect(status).toBe(0);
    expect(fs.existsSync(path.join(testDir, ".forge", "runtime", "index.md"))).toBe(true);
    expect(fs.existsSync(path.join(testDir, ".forge", "business_logic", "index.md"))).toBe(true);
    expect(fs.existsSync(path.join(testDir, ".forge", "data", "index.md"))).toBe(true);
  });
});
