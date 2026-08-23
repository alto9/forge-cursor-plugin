/**
 * qa.test_plan schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "qa.test_plan",
  defaultPath: "qa/test-plan.md",
  stringFields: ["scope"],
  stringArrayFields: ["acceptance_checks", "regression_focus", "out_of_scope", "environments"],
  legacyHeadings: [
    "# Scope",
    "# Acceptance checks",
    "# Regression focus",
    "# Out of scope",
    "# Environments",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseQaTestPlan = schema.parse;
export const validateQaTestPlan = schema.validate;
