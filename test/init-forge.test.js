import { describe, it, expect } from "vitest";
import { collectPaths } from "../skills/init-forge/scripts/init-forge.js";

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
