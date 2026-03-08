import { describe, it, expect } from "vitest";
import { isProtectedBranch } from "../skills/lib/git-utils.js";
import { parseCommitArgs } from "../skills/commit/scripts/commit.js";

describe("commit skill", () => {
  describe("isProtectedBranch", () => {
    it("returns true for main, master, develop", () => {
      expect(isProtectedBranch("main")).toBe(true);
      expect(isProtectedBranch("master")).toBe(true);
      expect(isProtectedBranch("develop")).toBe(true);
    });

    it("returns false for feature branches", () => {
      expect(isProtectedBranch("feature/foo")).toBe(false);
      expect(isProtectedBranch("fix/bar")).toBe(false);
      expect(isProtectedBranch("123-branch")).toBe(false);
    });

    it("handles trimmed input", () => {
      expect(isProtectedBranch("  main  ")).toBe(true);
    });

    it("returns false for non-string or empty", () => {
      expect(isProtectedBranch("")).toBe(false);
      expect(isProtectedBranch(null)).toBe(false);
      expect(isProtectedBranch(undefined)).toBe(false);
    });
  });

  describe("parseCommitArgs", () => {
    it("parses -m message", () => {
      expect(parseCommitArgs(["node", "commit.js", "-m", "feat: add x"])).toEqual({
        message: "feat: add x",
      });
    });

    it("returns null when -m is missing", () => {
      expect(parseCommitArgs(["node", "commit.js"])).toBeNull();
      expect(parseCommitArgs(["node", "commit.js", "foo"])).toBeNull();
    });

    it("returns null when -m has no value", () => {
      expect(parseCommitArgs(["node", "commit.js", "-m"])).toBeNull();
      expect(parseCommitArgs(["node", "commit.js", "-m", ""])).toBeNull();
    });

    it("parses message with spaces", () => {
      expect(parseCommitArgs(["node", "commit.js", "-m", "feat: add feature"])).toEqual({
        message: "feat: add feature",
      });
    });

    it("returns null for non-array argv", () => {
      expect(parseCommitArgs(null)).toBeNull();
      expect(parseCommitArgs(undefined)).toBeNull();
    });
  });
});
