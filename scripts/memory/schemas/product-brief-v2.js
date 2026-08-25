/**
 * product.brief schema_version 2 — product_name + product_description.
 */
import {
  BODY_SOFT_MAX,
  createProductDocSchema,
  isNonEmptyString,
} from "../schema-common.js";

export { BODY_SOFT_MAX };

const schema = createProductDocSchema({
  docId: "product.brief",
  defaultPath: "product/brief.md",
  schemaVersion: 2,
  stringFields: [
    "product_name",
    "product_description",
    "problem",
    "current_focus",
  ],
  stringArrayFields: ["audience", "goals", "non_goals"],
  metricTargetFields: ["success_metrics"],
  legacyHeadings: [
    "# Goals",
    "# Non-goals",
    "# Success metrics",
    "# Who it's for",
  ],
  extraValidate(data, _errors, warnings) {
    const weakFields = ["product_name", "problem", "current_focus"].filter(
      (k) => !isNonEmptyString(data[k])
    );
    if (weakFields.length) {
      warnings.push(
        `weak brief: empty ${weakFields.join(", ")} (fill before meaningful product work)`
      );
      return;
    }
    const hasGoal =
      Array.isArray(data.goals) && data.goals.some((g) => isNonEmptyString(g));
    if (!hasGoal) {
      warnings.push(
        "brief not strong: add at least one non-empty goals entry"
      );
    }
  },
});

export const DOC_ID = schema.DOC_ID;
export const SCHEMA_VERSION = schema.SCHEMA_VERSION;

export function parseProductBriefV2(markdown, relPath) {
  return schema.parse(markdown, relPath);
}

export function validateProductBriefV2(markdown, relPath) {
  return schema.validate(markdown, relPath);
}
