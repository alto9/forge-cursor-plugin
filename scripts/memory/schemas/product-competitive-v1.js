/**
 * product.competitive schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "product.competitive",
  defaultPath: "product/competitive.md",
  stringArrayFields: [
    "alternatives",
    "where_we_win",
    "where_we_lose",
    "watch_list",
    "implications",
  ],
  legacyHeadings: [
    "# Alternatives",
    "# Where we win",
    "# Where we lose",
    "# Watch list",
    "# Implications",
  ],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductCompetitive = schema.parse;
export const validateProductCompetitive = schema.validate;
