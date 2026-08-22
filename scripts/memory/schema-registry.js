/**
 * Pluggable memory doc schema registry.
 * Schema docs skip heading-template validation.
 */
import {
  parseProductBrief,
  validateProductBrief,
  DOC_ID as BRIEF_DOC_ID,
  SCHEMA_VERSION as BRIEF_SCHEMA_VERSION,
} from "./schemas/product-brief-v1.js";

/** Memory-relative path -> schema handler */
export const SCHEMA_DOC_MAP = {
  "product/brief.md": {
    doc: BRIEF_DOC_ID,
    versions: {
      [BRIEF_SCHEMA_VERSION]: validateProductBrief,
    },
  },
};

/**
 * @param {string} relPath
 * @param {string} content
 * @returns {{ errors: string[], warnings: string[], parsed: object|null }}
 */
export function validateSchemaDoc(relPath, content) {
  const entry = SCHEMA_DOC_MAP[relPath];
  if (!entry) {
    return {
      errors: [`No schema registered for ${relPath}`],
      warnings: [],
      parsed: null,
    };
  }

  // Peek schema_version without full validation to route unsupported versions
  const versionMatch = content.match(
    /^---\r?\n[\s\S]*?^schema_version:\s*(\d+)\s*$/m
  );
  if (versionMatch) {
    const ver = Number(versionMatch[1]);
    if (!entry.versions[ver]) {
      return {
        errors: [
          `${relPath}: unsupported schema_version ${ver} for ${entry.doc} (supported: ${Object.keys(entry.versions).join(", ")})`,
        ],
        warnings: [],
        parsed: null,
      };
    }
    return entry.versions[ver](content, relPath);
  }

  // Missing version — let the schema validator report detailed errors
  const defaultVer = Math.max(...Object.keys(entry.versions).map(Number));
  return entry.versions[defaultVer](content, relPath);
}

export function isSchemaDoc(relPath) {
  return Boolean(SCHEMA_DOC_MAP[relPath]);
}

export { parseProductBrief, validateProductBrief };
