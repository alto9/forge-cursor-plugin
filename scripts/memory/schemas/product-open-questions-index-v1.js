/**
 * product.open_questions_index schema_version 1 — product/open-questions.md rollup
 */
import { createProductDocSchema } from "../schema-common.js";

const schema = createProductDocSchema({
  docId: "product.open_questions_index",
  defaultPath: "product/open-questions.md",
  objectArrayFields: ["items"],
  legacyHeadings: ["# Open questions"],
  extraValidate(data, errors) {
    if (!Array.isArray(data.items)) return;
    data.items.forEach((item, i) => {
      if (item == null || typeof item !== "object" || Array.isArray(item)) return;
      if (typeof item.initiative !== "string") {
        errors.push(`items[${i}].initiative must be a string`);
      }
      if (typeof item.id !== "string") {
        errors.push(`items[${i}].id must be a string`);
      }
      if (typeof item.question !== "string") {
        errors.push(`items[${i}].question must be a string`);
      }
      if (typeof item.blocking !== "boolean") {
        errors.push(`items[${i}].blocking must be a boolean`);
      }
      if (typeof item.status !== "string") {
        errors.push(`items[${i}].status must be a string`);
      }
    });
  },
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductOpenQuestionsIndex = schema.parse;
export const validateProductOpenQuestionsIndex = schema.validate;
