import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import {
  parsePayload,
  resolveTargetPath,
  inferSchemaPath,
  resolveLocalRef,
  typeName,
  matchesType,
  validate,
  runValidation,
} from "../hooks/validate-json-schema-lib.js";

describe("parsePayload", () => {
  it("returns {} for empty or whitespace input", () => {
    expect(parsePayload("")).toEqual({});
    expect(parsePayload("   ")).toEqual({});
    expect(parsePayload(null)).toEqual({});
  });

  it("parses valid JSON object", () => {
    expect(parsePayload('{"file_path": ".forge/vision.json"}')).toEqual({
      file_path: ".forge/vision.json",
    });
  });

  it("returns {} for invalid JSON", () => {
    expect(parsePayload("not json")).toEqual({});
    expect(parsePayload("{ broken }")).toEqual({});
  });

  it("returns {} for non-object JSON", () => {
    expect(parsePayload("123")).toEqual({});
    expect(parsePayload('"string"')).toEqual({});
  });
});

describe("resolveTargetPath", () => {
  const repoRoot = "/tmp/repo";

  it("returns null when no path in payload or argv", () => {
    expect(resolveTargetPath({}, repoRoot, [])).toBeNull();
    expect(resolveTargetPath({}, repoRoot, ["node", "script"])).toBeNull();
  });

  it("prefers file_path from payload", () => {
    const result = resolveTargetPath(
      { file_path: ".forge/vision.json" },
      repoRoot,
      []
    );
    expect(result).toBe(path.resolve(repoRoot, ".forge/vision.json"));
  });

  it("accepts filePath (camelCase)", () => {
    const result = resolveTargetPath(
      { filePath: ".forge/project.json" },
      repoRoot,
      []
    );
    expect(result).toBe(path.resolve(repoRoot, ".forge/project.json"));
  });

  it("uses argv[2] when payload has no path", () => {
    const result = resolveTargetPath(
      {},
      repoRoot,
      ["node", "script", ".forge/roadmap.json"]
    );
    expect(result).toBe(path.resolve(repoRoot, ".forge/roadmap.json"));
  });
});

describe("inferSchemaPath", () => {
  const repoRoot = "/tmp/repo";

  it("returns null for paths outside .forge", () => {
    expect(inferSchemaPath(repoRoot, "/tmp/repo/other/file.json")).toBeNull();
    expect(inferSchemaPath(repoRoot, "/tmp/forge/vision.json")).toBeNull();
  });

  it("maps vision.json to vision.schema.json", () => {
    const result = inferSchemaPath(
      repoRoot,
      path.join(repoRoot, ".forge/vision.json")
    );
    expect(result).toBe(path.join(repoRoot, ".forge/schemas/vision.schema.json"));
  });

  it("maps project.json to project.schema.json", () => {
    const result = inferSchemaPath(
      repoRoot,
      path.join(repoRoot, ".forge/project.json")
    );
    expect(result).toBe(path.join(repoRoot, ".forge/schemas/project.schema.json"));
  });

  it("maps roadmap.json to roadmap.schema.json", () => {
    const result = inferSchemaPath(
      repoRoot,
      path.join(repoRoot, ".forge/roadmap.json")
    );
    expect(result).toBe(path.join(repoRoot, ".forge/schemas/roadmap.schema.json"));
  });

  it("returns null for unknown .forge files", () => {
    expect(
      inferSchemaPath(repoRoot, path.join(repoRoot, ".forge/other.json"))
    ).toBeNull();
  });
});

describe("resolveLocalRef", () => {
  const schema = {
    type: "object",
    properties: {
      name: { type: "string" },
      nested: { $ref: "#/definitions/Item" },
    },
    definitions: {
      Item: { type: "object", properties: { id: { type: "integer" } } },
    },
  };

  it("returns null for non-#/ refs", () => {
    expect(resolveLocalRef(schema, "http://example.com/schema")).toBeNull();
    expect(resolveLocalRef(schema, "")).toBeNull();
  });

  it("resolves #/definitions/Item", () => {
    const result = resolveLocalRef(schema, "#/definitions/Item");
    expect(result).toEqual({ type: "object", properties: { id: { type: "integer" } } });
  });

  it("resolves #/properties/name", () => {
    const result = resolveLocalRef(schema, "#/properties/name");
    expect(result).toEqual({ type: "string" });
  });

  it("returns null for missing path", () => {
    expect(resolveLocalRef(schema, "#/definitions/Missing")).toBeNull();
  });
});

describe("typeName", () => {
  it("returns type names correctly", () => {
    expect(typeName(null)).toBe("null");
    expect(typeName([])).toBe("array");
    expect(typeName({})).toBe("object");
    expect(typeName("")).toBe("string");
    expect(typeName(42)).toBe("number");
    expect(typeName(true)).toBe("boolean");
  });
});

describe("matchesType", () => {
  it("validates object type", () => {
    expect(matchesType({}, "object")).toBe(true);
    expect(matchesType(null, "object")).toBe(false);
    expect(matchesType([], "object")).toBe(false);
  });

  it("validates string type", () => {
    expect(matchesType("hello", "string")).toBe(true);
    expect(matchesType(123, "string")).toBe(false);
  });

  it("validates integer type", () => {
    expect(matchesType(42, "integer")).toBe(true);
    expect(matchesType(3.14, "integer")).toBe(false);
  });

  it("validates array type", () => {
    expect(matchesType([], "array")).toBe(true);
    expect(matchesType({}, "array")).toBe(false);
  });

  it("validates boolean and null", () => {
    expect(matchesType(true, "boolean")).toBe(true);
    expect(matchesType(null, "null")).toBe(true);
  });
});

describe("validate", () => {
  it("reports missing required property", () => {
    const schema = { type: "object", required: ["name"], properties: { name: { type: "string" } } };
    const errors = [];
    validate({}, schema, "$", errors, schema);
    expect(errors).toContain('$: missing required property "name"');
  });

  it("reports type mismatch", () => {
    const schema = { type: "object", properties: { count: { type: "integer" } } };
    const errors = [];
    validate({ count: "not a number" }, schema, "$", errors, schema);
    expect(errors).toContain("$.count: expected integer, got string");
  });

  it("reports value not in enum", () => {
    const schema = { type: "string", enum: ["a", "b"] };
    const errors = [];
    validate("c", schema, "$", errors, schema);
    expect(errors.some((e) => e.includes("enum"))).toBe(true);
  });

  it("reports string too short for minLength", () => {
    const schema = { type: "string", minLength: 5 };
    const errors = [];
    validate("ab", schema, "$", errors, schema);
    expect(errors).toContain("$: string length must be >= 5");
  });

  it("reports unexpected property when additionalProperties is false", () => {
    const schema = {
      type: "object",
      properties: { a: { type: "string" } },
      additionalProperties: false,
    };
    const errors = [];
    validate({ a: "ok", extra: "bad" }, schema, "$", errors, schema);
    expect(errors).toContain('$: unexpected property "extra"');
  });

  it("passes valid instance", () => {
    const schema = { type: "object", required: ["name"], properties: { name: { type: "string" } } };
    const errors = [];
    validate({ name: "test" }, schema, "$", errors, schema);
    expect(errors).toHaveLength(0);
  });
});

describe("runValidation", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "forge-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns ok: true for valid JSON matching schema", () => {
    const forgeDir = path.join(tmpDir, ".forge");
    const schemasDir = path.join(forgeDir, "schemas");
    fs.mkdirSync(schemasDir, { recursive: true });

    const schemaPath = path.join(schemasDir, "vision.schema.json");
    fs.writeFileSync(
      schemaPath,
      JSON.stringify({
        type: "object",
        properties: { description: { type: "string" } },
      })
    );

    const targetPath = path.join(forgeDir, "vision.json");
    fs.writeFileSync(targetPath, JSON.stringify({ description: "Test" }));

    const result = runValidation(tmpDir, targetPath, schemaPath);
    expect(result.ok).toBe(true);
  });

  it("returns ok: false with errors for invalid instance", () => {
    const forgeDir = path.join(tmpDir, ".forge");
    const schemasDir = path.join(forgeDir, "schemas");
    fs.mkdirSync(schemasDir, { recursive: true });

    const schemaPath = path.join(schemasDir, "vision.schema.json");
    fs.writeFileSync(
      schemaPath,
      JSON.stringify({
        type: "object",
        required: ["description"],
        properties: { description: { type: "string" } },
      })
    );

    const targetPath = path.join(forgeDir, "vision.json");
    fs.writeFileSync(targetPath, JSON.stringify({}));

    const result = runValidation(tmpDir, targetPath, schemaPath);
    expect(result.ok).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors.some((e) => e.includes("description"))).toBe(true);
  });

  it("returns ok: false with error for invalid JSON file", () => {
    const forgeDir = path.join(tmpDir, ".forge");
    const schemasDir = path.join(forgeDir, "schemas");
    fs.mkdirSync(schemasDir, { recursive: true });

    const schemaPath = path.join(schemasDir, "vision.schema.json");
    fs.writeFileSync(schemaPath, '{"type":"object"}');

    const targetPath = path.join(forgeDir, "vision.json");
    fs.writeFileSync(targetPath, "{ invalid json");

    const result = runValidation(tmpDir, targetPath, schemaPath);
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });
});
