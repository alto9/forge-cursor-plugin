/**
 * qa.queue schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "qa.queue",
  defaultPath: "qa/queue.md",
  stringFields: [],
  stringArrayFields: ["ready_for_qa", "in_verification", "passed_back", "approved"],
  legacyHeadings: [
    "# Ready for QA",
    "# In verification",
    "# Passed back",
    "# Approved",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseQaQueue = schema.parse;
export const validateQaQueue = schema.validate;
