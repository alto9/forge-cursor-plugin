/**
 * release.status schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "release.status",
  defaultPath: "release/status.md",
  stringFields: ["current_release"],
  stringArrayFields: ["blockers", "ready", "shipped"],
  legacyHeadings: [
    "# Current release",
    "# Blockers",
    "# Ready",
    "# Shipped",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseReleaseStatus = schema.parse;
export const validateReleaseStatus = schema.validate;
