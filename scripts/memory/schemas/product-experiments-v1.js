/**
 * product.experiments schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "product.experiments",
  defaultPath: "product/experiments.md",
  stringArrayFields: ["active", "proposed", "concluded"],
  legacyHeadings: ["# Active", "# Proposed", "# Concluded"],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductExperiments = schema.parse;
export const validateProductExperiments = schema.validate;
