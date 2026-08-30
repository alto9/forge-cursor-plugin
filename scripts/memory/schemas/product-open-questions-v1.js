/**
 * product.open_questions schema_version 1 — initiatives/<slug>/open-questions.md
 */
import { createProductDocSchema } from "../schema-common.js";

const Q_STATUSES = new Set(["open", "answered", "deferred"]);

const schema = createProductDocSchema({
  docId: "product.open_questions",
  defaultPath: "initiatives/<slug>/open-questions.md",
  objectArrayFields: ["questions"],
  legacyHeadings: ["# Open questions"],
  extraValidate(data, errors) {
    if (!Array.isArray(data.questions)) return;
    data.questions.forEach((q, i) => {
      if (q == null || typeof q !== "object" || Array.isArray(q)) return;
      if (typeof q.id !== "string") {
        errors.push(`questions[${i}].id must be a string`);
      }
      if (typeof q.question !== "string") {
        errors.push(`questions[${i}].question must be a string`);
      }
      if (typeof q.blocking !== "boolean") {
        errors.push(`questions[${i}].blocking must be a boolean`);
      }
      if (typeof q.status !== "string" || !Q_STATUSES.has(q.status)) {
        errors.push(
          `questions[${i}].status must be open|answered|deferred, got: ${JSON.stringify(q.status)}`
        );
      }
      if (typeof q.owner !== "string") {
        errors.push(`questions[${i}].owner must be a string`);
      }
    });
  },
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;
export const parseProductOpenQuestions = schema.parse;
export const validateProductOpenQuestions = schema.validate;
