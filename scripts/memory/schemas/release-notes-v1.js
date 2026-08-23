/**
 * release.notes schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "release.notes",
  defaultPath: "release/notes.md",
  stringFields: ["summary"],
  stringArrayFields: ["changes", "breaking", "upgrade_notes", "known_issues"],
  legacyHeadings: [
    "# Summary",
    "# Changes",
    "# Breaking",
    "# Upgrade notes",
    "# Known issues",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseReleaseNotes = schema.parse;
export const validateReleaseNotes = schema.validate;
