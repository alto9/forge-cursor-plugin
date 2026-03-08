import { describe, it, expect } from "vitest";
import { parseArgs } from "../skills/fetch-url/scripts/fetch-url.js";

describe("fetch-url skill", () => {
  describe("parseArgs", () => {
    it("parses url with defaults", () => {
      expect(parseArgs(["node", "script.js", "https://example.com"])).toEqual({
        url: "https://example.com",
        timeoutSec: 15,
        maxChars: 24000,
      });
    });

    it("parses --timeout and --max-chars", () => {
      expect(
        parseArgs(["node", "script.js", "https://x.com", "--timeout", "30", "--max-chars", "5000"])
      ).toEqual({ url: "https://x.com", timeoutSec: 30, maxChars: 5000 });
    });

    it("returns null for invalid URL (no http)", () => {
      expect(parseArgs(["node", "script.js", "ftp://x.com"])).toBeNull();
      expect(parseArgs(["node", "script.js", "example.com"])).toBeNull();
    });

    it("returns null for invalid --timeout", () => {
      expect(parseArgs(["node", "script.js", "https://x.com", "--timeout", "abc"])).toBeNull();
      expect(parseArgs(["node", "script.js", "https://x.com", "--timeout", "0"])).toBeNull();
    });

    it("returns null for invalid --max-chars", () => {
      expect(parseArgs(["node", "script.js", "https://x.com", "--max-chars", "zero"])).toBeNull();
    });

    it("returns { help: true } for --help as first arg", () => {
      expect(parseArgs(["node", "script.js", "--help"])).toEqual({ help: true });
      expect(parseArgs(["node", "script.js", "-h"])).toEqual({ help: true });
    });

    it("returns null when no url", () => {
      expect(parseArgs(["node", "script.js"])).toBeNull();
      expect(parseArgs(["node", "script.js", ""])).toBeNull();
    });
  });
});
