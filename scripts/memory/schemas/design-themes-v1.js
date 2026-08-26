/**
 * design.themes schema_version 1
 */
import { createProductDocSchema, isNonEmptyString } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "design.themes",
  defaultPath: "design/themes.md",
  stringFields: [],
  objectArrayFields: ["themes"],
  legacyHeadings: ["# Themes"],
  extraValidate(data, errors) {
    if (!Array.isArray(data.themes)) return;
    data.themes.forEach((theme, i) => {
      if (theme == null || typeof theme !== "object" || Array.isArray(theme)) {
        return;
      }
      if (theme.status === "bound") {
        if (!isNonEmptyString(theme.figma_url)) {
          errors.push(`themes[${i}].figma_url required when status is bound`);
        }
        if (!isNonEmptyString(theme.figma_file_key)) {
          errors.push(
            `themes[${i}].figma_file_key required when status is bound`
          );
        }
      }
    });
  },
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseDesignThemes = schema.parse;
export const validateDesignThemes = schema.validate;
