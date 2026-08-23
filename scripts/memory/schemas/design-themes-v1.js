/**
 * design.themes schema_version 1
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "design.themes",
  defaultPath: "design/themes.md",
  stringFields: [],
  objectArrayFields: ["themes"],
  legacyHeadings: ["# Themes"],
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseDesignThemes = schema.parse;
export const validateDesignThemes = schema.validate;
