/**
 * Phase-1 Gherkin .feature validator for initiative feature files.
 * Requires non-empty content with Feature: and at least one Scenario:.
 */

/**
 * @param {string} content
 * @param {string} [relPath]
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validateGherkinFeature(content, relPath = "") {
  const errors = [];
  const warnings = [];
  const prefix = relPath ? `${relPath}: ` : "";

  if (typeof content !== "string" || content.trim().length === 0) {
    errors.push(`${prefix}feature file must be non-empty`);
    return { errors, warnings };
  }

  if (!/^\s*Feature:/m.test(content)) {
    errors.push(`${prefix}must contain a Feature: line`);
  }
  if (!/^\s*Scenario(?: Outline)?:/m.test(content)) {
    errors.push(
      `${prefix}must contain at least one Scenario: or Scenario Outline: line`
    );
  }

  return { errors, warnings };
}

/**
 * @param {string} relPath
 * @returns {boolean}
 */
export function isInitiativeFeaturePath(relPath) {
  return (
    relPath.startsWith("initiatives/") &&
    relPath.includes("/features/") &&
    relPath.endsWith(".feature")
  );
}
