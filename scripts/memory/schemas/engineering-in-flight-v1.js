/**
 * engineering.in_flight schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "engineering.in_flight",
  defaultPath: "engineering/in-flight.md",
  stringFields: ["approach", "review_state"],
  stringArrayFields: ["active", "open_questions", "blockers"],
  legacyHeadings: [
    "# Active",
    "# Approach",
    "# Open questions",
    "# Blockers",
    "# Review state",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseEngineeringInFlight = schema.parse;
export const validateEngineeringInFlight = schema.validate;
