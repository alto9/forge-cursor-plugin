/**
 * product.spec schema_version 1 — optional feature notes under product/specs/.
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "product.spec",
  defaultPath: "product/specs/<feature>.md",
  stringFields: ["feature", "problem", "verification"],
  stringArrayFields: [
    "users",
    "requirements",
    "acceptance_criteria",
    "out_of_scope",
    "constraints",
    "open_questions",
  ],
  metricTargetFields: ["success_metrics"],
  legacyHeadings: [
    "# Problem",
    "# Users",
    "# Requirements",
    "# Acceptance criteria",
    "# Out of scope",
    "# Constraints",
    "# Verification",
    "# Open questions",
    "# Success metrics",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductSpec = schema.parse;
export const validateProductSpec = schema.validate;
