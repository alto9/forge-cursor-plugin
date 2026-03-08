import { describe, it, expect } from "vitest";
import { parseArgs, parseParentRef } from "../skills/gh-create-issue/scripts/gh-create-issue.js";

describe("gh-create-issue skill", () => {
  describe("parseArgs", () => {
    it("parses title only", () => {
      expect(parseArgs(["node", "script.js", "My Title"])).toEqual({
        title: "My Title",
        body: "",
        parentRef: null,
      });
    });

    it("parses title and body", () => {
      expect(parseArgs(["node", "script.js", "My Title", "Body text"])).toEqual({
        title: "My Title",
        body: "Body text",
        parentRef: null,
      });
    });

    it("parses title, body, and --parent", () => {
      expect(parseArgs(["node", "script.js", "My Title", "Body", "--parent", "123"])).toEqual({
        title: "My Title",
        body: "Body",
        parentRef: "123",
      });
    });

    it("parses title and --parent only", () => {
      expect(parseArgs(["node", "script.js", "My Title", "--parent", "5"])).toEqual({
        title: "My Title",
        body: "",
        parentRef: "5",
      });
    });

    it("parses body with multiple words", () => {
      expect(parseArgs(["node", "script.js", "Title", "Body with multiple words"])).toEqual({
        title: "Title",
        body: "Body with multiple words",
        parentRef: null,
      });
    });

    it("returns null when no title", () => {
      expect(parseArgs(["node", "script.js"])).toBeNull();
      expect(parseArgs(["node", "script.js", ""])).toBeNull();
    });
  });

  describe("parseParentRef", () => {
    const defaultRepo = "owner/repo";

    it("parses issue number with default repo", () => {
      expect(parseParentRef("123", defaultRepo)).toEqual({
        owner: "owner",
        repo: "repo",
        issueNumber: 123,
      });
    });

    it("parses owner/repo#number", () => {
      expect(parseParentRef("alto9/kube9-operator#42", defaultRepo)).toEqual({
        owner: "alto9",
        repo: "kube9-operator",
        issueNumber: 42,
      });
    });

    it("parses full GitHub URL", () => {
      expect(
        parseParentRef("https://github.com/owner/repo/issues/99", defaultRepo)
      ).toEqual({ owner: "owner", repo: "repo", issueNumber: 99 });
    });

    it("returns null for invalid ref", () => {
      expect(parseParentRef("not-valid", defaultRepo)).toBeNull();
      expect(parseParentRef("", defaultRepo)).toBeNull();
      expect(parseParentRef(null, defaultRepo)).toBeNull();
    });

    it("returns null for number without default repo", () => {
      expect(parseParentRef("123", null)).toBeNull();
    });
  });
});
