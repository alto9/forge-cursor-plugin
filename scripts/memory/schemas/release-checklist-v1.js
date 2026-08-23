/**
 * release.checklist schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "release.checklist",
  defaultPath: "release/checklist.md",
  stringFields: ["version_target"],
  stringArrayFields: ["pre_ship", "gates", "publish_steps", "rollback"],
  legacyHeadings: [
    "# Version target",
    "# Pre-ship",
    "# Gates",
    "# Publish steps",
    "# Rollback",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseReleaseChecklist = schema.parse;
export const validateReleaseChecklist = schema.validate;
