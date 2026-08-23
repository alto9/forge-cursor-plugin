/**
 * marketing.voice schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "marketing.voice",
  defaultPath: "marketing/voice.md",
  stringFields: ["tone"],
  stringArrayFields: ["style_rules", "examples", "anti_patterns"],
  legacyHeadings: [
    "# Tone",
    "# Style rules",
    "# Examples",
    "# Anti-patterns",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseMarketingVoice = schema.parse;
export const validateMarketingVoice = schema.validate;
