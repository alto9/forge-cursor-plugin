/**
 * marketing.social_queue schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "marketing.social_queue",
  defaultPath: "marketing/social-queue.md",
  stringFields: [],
  stringArrayFields: ["ready_to_post", "needs_revision", "holding", "channels_formats"],
  legacyHeadings: [
    "# Ready to post",
    "# Needs revision",
    "# Holding",
    "# Channels / formats",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseMarketingSocialQueue = schema.parse;
export const validateMarketingSocialQueue = schema.validate;
