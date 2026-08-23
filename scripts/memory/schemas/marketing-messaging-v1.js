/**
 * marketing.messaging schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "marketing.messaging",
  defaultPath: "marketing/messaging.md",
  stringFields: ["one_liner", "elevator"],
  stringArrayFields: ["pillars", "ctas", "words_we_use", "words_we_avoid"],
  legacyHeadings: [
    "# One-liner",
    "# Elevator",
    "# Pillars",
    "# CTAs",
    "# Words we use",
    "# Words we avoid",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseMarketingMessaging = schema.parse;
export const validateMarketingMessaging = schema.validate;
