import { describe, it, expect } from "vitest";
import { parseArgs } from "../skills/create-feature-branch/scripts/create-feature-branch.js";

describe("create-feature-branch skill", () => {
  describe("parseArgs", () => {
    it("parses branch-name and defaults root to main", () => {
      expect(parseArgs(["node", "script.js", "feature/foo"])).toEqual({
        branchName: "feature/foo",
        rootBranch: "main",
      });
    });

    it("parses branch-name and root-branch", () => {
      expect(parseArgs(["node", "script.js", "feature/foo", "develop"])).toEqual({
        branchName: "feature/foo",
        rootBranch: "develop",
      });
    });

    it("returns null when no branch name", () => {
      expect(parseArgs(["node", "script.js"])).toBeNull();
      expect(parseArgs(["node", "script.js", ""])).toBeNull();
      expect(parseArgs(["node", "script.js", "   "])).toBeNull();
    });

    it("returns null for non-array argv", () => {
      expect(parseArgs(null)).toBeNull();
      expect(parseArgs(undefined)).toBeNull();
    });

    it("trims whitespace from branch name", () => {
      expect(parseArgs(["node", "script.js", "  feature/foo  "])).toEqual({
        branchName: "feature/foo",
        rootBranch: "main",
      });
    });

    it("uses main when root-branch is empty string", () => {
      expect(parseArgs(["node", "script.js", "feature/foo", ""])).toEqual({
        branchName: "feature/foo",
        rootBranch: "main",
      });
    });
  });
});
