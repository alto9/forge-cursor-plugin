/**
 * product.roadmap schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "product.roadmap",
  defaultPath: "product/roadmap.md",
  stringArrayFields: ["themes", "now", "next", "later", "not_planning"],
  legacyHeadings: ["# Themes", "# Now", "# Next", "# Later", "# Not planning"],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductRoadmap = schema.parse;
export const validateProductRoadmap = schema.validate;
