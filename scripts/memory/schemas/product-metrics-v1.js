/**
 * product.metrics schema_version 1 — current read (brief holds intent/targets).
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "product.metrics",
  defaultPath: "product/metrics.md",
  stringFields: ["current_read"],
  stringArrayFields: ["primary", "supporting"],
  metricTargetFields: ["targets"],
  legacyHeadings: [
    "# Primary metrics",
    "# Supporting metrics",
    "# Targets",
    "# Current read",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductMetrics = schema.parse;
export const validateProductMetrics = schema.validate;
