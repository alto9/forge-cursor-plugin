/**
 * Pluggable memory doc schema registry.
 * Schema docs skip heading-template validation.
 */
import {
  parseProductBrief,
  validateProductBrief,
  DOC_ID as BRIEF_DOC_ID,
  SCHEMA_VERSION as BRIEF_SCHEMA_VERSION,
} from "./schemas/product-brief-v1.js";
import {
  validateProductBriefV2,
  SCHEMA_VERSION as BRIEF_SCHEMA_VERSION_V2,
} from "./schemas/product-brief-v2.js";
import {
  validateProductRoadmap,
  DOC_ID as ProductRoadmap_DOC_ID,
  SCHEMA_VERSION as ProductRoadmap_SCHEMA_VERSION,
} from "./schemas/product-roadmap-v1.js";
import {
  validateProductBacklog,
  DOC_ID as ProductBacklog_DOC_ID,
  SCHEMA_VERSION as ProductBacklog_SCHEMA_VERSION,
} from "./schemas/product-backlog-v1.js";
import {
  validateProductMetrics,
  DOC_ID as ProductMetrics_DOC_ID,
  SCHEMA_VERSION as ProductMetrics_SCHEMA_VERSION,
} from "./schemas/product-metrics-v1.js";
import {
  validateProductInsights,
  DOC_ID as ProductInsights_DOC_ID,
  SCHEMA_VERSION as ProductInsights_SCHEMA_VERSION,
} from "./schemas/product-insights-v1.js";
import {
  validateProductCompetitive,
  DOC_ID as ProductCompetitive_DOC_ID,
  SCHEMA_VERSION as ProductCompetitive_SCHEMA_VERSION,
} from "./schemas/product-competitive-v1.js";
import {
  validateProductPersonas,
  DOC_ID as ProductPersonas_DOC_ID,
  SCHEMA_VERSION as ProductPersonas_SCHEMA_VERSION,
} from "./schemas/product-personas-v1.js";
import {
  validateProductExperiments,
  DOC_ID as ProductExperiments_DOC_ID,
  SCHEMA_VERSION as ProductExperiments_SCHEMA_VERSION,
} from "./schemas/product-experiments-v1.js";
import {
  validateArchitectureOverview,
  DOC_ID as ArchitectureOverview_DOC_ID,
  SCHEMA_VERSION as ArchitectureOverview_SCHEMA_VERSION,
} from "./schemas/architecture-overview-v1.js";
import {
  validateArchitectureConstraints,
  DOC_ID as ArchitectureConstraints_DOC_ID,
  SCHEMA_VERSION as ArchitectureConstraints_SCHEMA_VERSION,
} from "./schemas/architecture-constraints-v1.js";
import {
  validateArchitectureInterfaces,
  DOC_ID as ArchitectureInterfaces_DOC_ID,
  SCHEMA_VERSION as ArchitectureInterfaces_SCHEMA_VERSION,
} from "./schemas/architecture-interfaces-v1.js";
import {
  validateArchitectureDecisions,
  DOC_ID as ArchitectureDecisions_DOC_ID,
  SCHEMA_VERSION as ArchitectureDecisions_SCHEMA_VERSION,
} from "./schemas/architecture-decisions-v1.js";
import {
  validateArchitectureRisks,
  DOC_ID as ArchitectureRisks_DOC_ID,
  SCHEMA_VERSION as ArchitectureRisks_SCHEMA_VERSION,
} from "./schemas/architecture-risks-v1.js";
import {
  validateEngineeringInFlight,
  DOC_ID as EngineeringInFlight_DOC_ID,
  SCHEMA_VERSION as EngineeringInFlight_SCHEMA_VERSION,
} from "./schemas/engineering-in-flight-v1.js";
import {
  validateProjectPlan,
  DOC_ID as ProjectPlan_DOC_ID,
  SCHEMA_VERSION as ProjectPlan_SCHEMA_VERSION,
} from "./schemas/project-plan-v1.js";
import {
  validateProjectStatus,
  DOC_ID as ProjectStatus_DOC_ID,
  SCHEMA_VERSION as ProjectStatus_SCHEMA_VERSION,
} from "./schemas/project-status-v1.js";
import {
  validateProjectRisks,
  DOC_ID as ProjectRisks_DOC_ID,
  SCHEMA_VERSION as ProjectRisks_SCHEMA_VERSION,
} from "./schemas/project-risks-v1.js";
import {
  validateProjectMilestones,
  DOC_ID as ProjectMilestones_DOC_ID,
  SCHEMA_VERSION as ProjectMilestones_SCHEMA_VERSION,
} from "./schemas/project-milestones-v1.js";
import {
  validateQaQueue,
  DOC_ID as QaQueue_DOC_ID,
  SCHEMA_VERSION as QaQueue_SCHEMA_VERSION,
} from "./schemas/qa-queue-v1.js";
import {
  validateQaFindings,
  DOC_ID as QaFindings_DOC_ID,
  SCHEMA_VERSION as QaFindings_SCHEMA_VERSION,
} from "./schemas/qa-findings-v1.js";
import {
  validateQaTestPlan,
  DOC_ID as QaTestPlan_DOC_ID,
  SCHEMA_VERSION as QaTestPlan_SCHEMA_VERSION,
} from "./schemas/qa-test-plan-v1.js";
import {
  validateSecurityThreatModel,
  DOC_ID as SecurityThreatModel_DOC_ID,
  SCHEMA_VERSION as SecurityThreatModel_SCHEMA_VERSION,
} from "./schemas/security-threat-model-v1.js";
import {
  validateSecurityFindings,
  DOC_ID as SecurityFindings_DOC_ID,
  SCHEMA_VERSION as SecurityFindings_SCHEMA_VERSION,
} from "./schemas/security-findings-v1.js";
import {
  validateSecurityChecklist,
  DOC_ID as SecurityChecklist_DOC_ID,
  SCHEMA_VERSION as SecurityChecklist_SCHEMA_VERSION,
} from "./schemas/security-checklist-v1.js";
import {
  validateReleaseChecklist,
  DOC_ID as ReleaseChecklist_DOC_ID,
  SCHEMA_VERSION as ReleaseChecklist_SCHEMA_VERSION,
} from "./schemas/release-checklist-v1.js";
import {
  validateReleaseNotes,
  DOC_ID as ReleaseNotes_DOC_ID,
  SCHEMA_VERSION as ReleaseNotes_SCHEMA_VERSION,
} from "./schemas/release-notes-v1.js";
import {
  validateReleaseStatus,
  DOC_ID as ReleaseStatus_DOC_ID,
  SCHEMA_VERSION as ReleaseStatus_SCHEMA_VERSION,
} from "./schemas/release-status-v1.js";
import {
  validateMarketingPositioning,
  DOC_ID as MarketingPositioning_DOC_ID,
  SCHEMA_VERSION as MarketingPositioning_SCHEMA_VERSION,
} from "./schemas/marketing-positioning-v1.js";
import {
  validateMarketingMessaging,
  DOC_ID as MarketingMessaging_DOC_ID,
  SCHEMA_VERSION as MarketingMessaging_SCHEMA_VERSION,
} from "./schemas/marketing-messaging-v1.js";
import {
  validateMarketingVoice,
  DOC_ID as MarketingVoice_DOC_ID,
  SCHEMA_VERSION as MarketingVoice_SCHEMA_VERSION,
} from "./schemas/marketing-voice-v1.js";
import {
  validateMarketingCalendar,
  DOC_ID as MarketingCalendar_DOC_ID,
  SCHEMA_VERSION as MarketingCalendar_SCHEMA_VERSION,
} from "./schemas/marketing-calendar-v1.js";
import {
  validateMarketingSocialQueue,
  DOC_ID as MarketingSocialQueue_DOC_ID,
  SCHEMA_VERSION as MarketingSocialQueue_SCHEMA_VERSION,
} from "./schemas/marketing-social-queue-v1.js";
import {
  validateDesignThemes,
  DOC_ID as DesignThemes_DOC_ID,
  SCHEMA_VERSION as DesignThemes_SCHEMA_VERSION,
} from "./schemas/design-themes-v1.js";
import {
  validateDesignStructure,
  DOC_ID as DesignStructure_DOC_ID,
  SCHEMA_VERSION as DesignStructure_SCHEMA_VERSION,
} from "./schemas/design-structure-v1.js";
import {
  validateDesignTokens,
  DOC_ID as DesignTokens_DOC_ID,
  SCHEMA_VERSION as DesignTokens_SCHEMA_VERSION,
} from "./schemas/design-tokens-v1.js";
import {
  validateDesignScreens,
  DOC_ID as DesignScreens_DOC_ID,
  SCHEMA_VERSION as DesignScreens_SCHEMA_VERSION,
} from "./schemas/design-screens-v1.js";
import {
  validateDesignComponents,
  DOC_ID as DesignComponents_DOC_ID,
  SCHEMA_VERSION as DesignComponents_SCHEMA_VERSION,
} from "./schemas/design-components-v1.js";
import {
  validateDesignPrinciples,
  DOC_ID as DesignPrinciples_DOC_ID,
  SCHEMA_VERSION as DesignPrinciples_SCHEMA_VERSION,
} from "./schemas/design-principles-v1.js";
import {
  validateProductSpec,
  DOC_ID as ProductSpec_DOC_ID,
  SCHEMA_VERSION as ProductSpec_SCHEMA_VERSION,
} from "./schemas/product-spec-v1.js";

/** Exact memory-relative path -> schema handler */
export const SCHEMA_DOC_MAP = {
  "product/brief.md": {
    doc: BRIEF_DOC_ID,
    versions: {
      [BRIEF_SCHEMA_VERSION]: validateProductBrief,
      [BRIEF_SCHEMA_VERSION_V2]: validateProductBriefV2,
    },
  },
  "product/roadmap.md": {
    doc: ProductRoadmap_DOC_ID,
    versions: { [ProductRoadmap_SCHEMA_VERSION]: validateProductRoadmap },
  },
  "product/backlog.md": {
    doc: ProductBacklog_DOC_ID,
    versions: { [ProductBacklog_SCHEMA_VERSION]: validateProductBacklog },
  },
  "product/metrics.md": {
    doc: ProductMetrics_DOC_ID,
    versions: { [ProductMetrics_SCHEMA_VERSION]: validateProductMetrics },
  },
  "product/insights.md": {
    doc: ProductInsights_DOC_ID,
    versions: { [ProductInsights_SCHEMA_VERSION]: validateProductInsights },
  },
  "product/competitive.md": {
    doc: ProductCompetitive_DOC_ID,
    versions: { [ProductCompetitive_SCHEMA_VERSION]: validateProductCompetitive },
  },
  "product/personas.md": {
    doc: ProductPersonas_DOC_ID,
    versions: { [ProductPersonas_SCHEMA_VERSION]: validateProductPersonas },
  },
  "product/experiments.md": {
    doc: ProductExperiments_DOC_ID,
    versions: { [ProductExperiments_SCHEMA_VERSION]: validateProductExperiments },
  },
  "architecture/overview.md": {
    doc: ArchitectureOverview_DOC_ID,
    versions: { [ArchitectureOverview_SCHEMA_VERSION]: validateArchitectureOverview },
  },
  "architecture/constraints.md": {
    doc: ArchitectureConstraints_DOC_ID,
    versions: { [ArchitectureConstraints_SCHEMA_VERSION]: validateArchitectureConstraints },
  },
  "architecture/interfaces.md": {
    doc: ArchitectureInterfaces_DOC_ID,
    versions: { [ArchitectureInterfaces_SCHEMA_VERSION]: validateArchitectureInterfaces },
  },
  "architecture/decisions.md": {
    doc: ArchitectureDecisions_DOC_ID,
    versions: { [ArchitectureDecisions_SCHEMA_VERSION]: validateArchitectureDecisions },
  },
  "architecture/risks.md": {
    doc: ArchitectureRisks_DOC_ID,
    versions: { [ArchitectureRisks_SCHEMA_VERSION]: validateArchitectureRisks },
  },
  "engineering/in-flight.md": {
    doc: EngineeringInFlight_DOC_ID,
    versions: { [EngineeringInFlight_SCHEMA_VERSION]: validateEngineeringInFlight },
  },
  "project/plan.md": {
    doc: ProjectPlan_DOC_ID,
    versions: { [ProjectPlan_SCHEMA_VERSION]: validateProjectPlan },
  },
  "project/status.md": {
    doc: ProjectStatus_DOC_ID,
    versions: { [ProjectStatus_SCHEMA_VERSION]: validateProjectStatus },
  },
  "project/risks.md": {
    doc: ProjectRisks_DOC_ID,
    versions: { [ProjectRisks_SCHEMA_VERSION]: validateProjectRisks },
  },
  "project/milestones.md": {
    doc: ProjectMilestones_DOC_ID,
    versions: { [ProjectMilestones_SCHEMA_VERSION]: validateProjectMilestones },
  },
  "qa/queue.md": {
    doc: QaQueue_DOC_ID,
    versions: { [QaQueue_SCHEMA_VERSION]: validateQaQueue },
  },
  "qa/findings.md": {
    doc: QaFindings_DOC_ID,
    versions: { [QaFindings_SCHEMA_VERSION]: validateQaFindings },
  },
  "qa/test-plan.md": {
    doc: QaTestPlan_DOC_ID,
    versions: { [QaTestPlan_SCHEMA_VERSION]: validateQaTestPlan },
  },
  "security/threat-model.md": {
    doc: SecurityThreatModel_DOC_ID,
    versions: { [SecurityThreatModel_SCHEMA_VERSION]: validateSecurityThreatModel },
  },
  "security/findings.md": {
    doc: SecurityFindings_DOC_ID,
    versions: { [SecurityFindings_SCHEMA_VERSION]: validateSecurityFindings },
  },
  "security/checklist.md": {
    doc: SecurityChecklist_DOC_ID,
    versions: { [SecurityChecklist_SCHEMA_VERSION]: validateSecurityChecklist },
  },
  "release/checklist.md": {
    doc: ReleaseChecklist_DOC_ID,
    versions: { [ReleaseChecklist_SCHEMA_VERSION]: validateReleaseChecklist },
  },
  "release/notes.md": {
    doc: ReleaseNotes_DOC_ID,
    versions: { [ReleaseNotes_SCHEMA_VERSION]: validateReleaseNotes },
  },
  "release/status.md": {
    doc: ReleaseStatus_DOC_ID,
    versions: { [ReleaseStatus_SCHEMA_VERSION]: validateReleaseStatus },
  },
  "marketing/positioning.md": {
    doc: MarketingPositioning_DOC_ID,
    versions: { [MarketingPositioning_SCHEMA_VERSION]: validateMarketingPositioning },
  },
  "marketing/messaging.md": {
    doc: MarketingMessaging_DOC_ID,
    versions: { [MarketingMessaging_SCHEMA_VERSION]: validateMarketingMessaging },
  },
  "marketing/voice.md": {
    doc: MarketingVoice_DOC_ID,
    versions: { [MarketingVoice_SCHEMA_VERSION]: validateMarketingVoice },
  },
  "marketing/calendar.md": {
    doc: MarketingCalendar_DOC_ID,
    versions: { [MarketingCalendar_SCHEMA_VERSION]: validateMarketingCalendar },
  },
  "marketing/social-queue.md": {
    doc: MarketingSocialQueue_DOC_ID,
    versions: { [MarketingSocialQueue_SCHEMA_VERSION]: validateMarketingSocialQueue },
  },
  "design/themes.md": {
    doc: DesignThemes_DOC_ID,
    versions: { [DesignThemes_SCHEMA_VERSION]: validateDesignThemes },
  },
  "design/structure.md": {
    doc: DesignStructure_DOC_ID,
    versions: { [DesignStructure_SCHEMA_VERSION]: validateDesignStructure },
  },
  "design/tokens.md": {
    doc: DesignTokens_DOC_ID,
    versions: { [DesignTokens_SCHEMA_VERSION]: validateDesignTokens },
  },
  "design/screens.md": {
    doc: DesignScreens_DOC_ID,
    versions: { [DesignScreens_SCHEMA_VERSION]: validateDesignScreens },
  },
  "design/components.md": {
    doc: DesignComponents_DOC_ID,
    versions: { [DesignComponents_SCHEMA_VERSION]: validateDesignComponents },
  },
  "design/principles.md": {
    doc: DesignPrinciples_DOC_ID,
    versions: { [DesignPrinciples_SCHEMA_VERSION]: validateDesignPrinciples },
  },
};


const SPEC_ENTRY = {
  doc: ProductSpec_DOC_ID,
  versions: { [ProductSpec_SCHEMA_VERSION]: validateProductSpec },
};


/**
 * @param {string} relPath
 * @returns {{ doc: string, versions: Record<number, Function> }|null}
 */
export function schemaEntryForPath(relPath) {
  if (SCHEMA_DOC_MAP[relPath]) return SCHEMA_DOC_MAP[relPath];
  if (relPath.startsWith("product/specs/") && relPath.endsWith(".md")) {
    return SPEC_ENTRY;
  }
  return null;
}

/**
 * @param {string} relPath
 * @param {string} content
 * @returns {{ errors: string[], warnings: string[], parsed: object|null }}
 */
export function validateSchemaDoc(relPath, content) {
  const entry = schemaEntryForPath(relPath);
  if (!entry) {
    return {
      errors: [`No schema registered for ${relPath}`],
      warnings: [],
      parsed: null,
    };
  }

  const versionMatch = content.match(
    /^---\r?\n[\s\S]*?^schema_version:\s*(\d+)\s*$/m
  );
  if (versionMatch) {
    const ver = Number(versionMatch[1]);
    if (!entry.versions[ver]) {
      return {
        errors: [
          `${relPath}: unsupported schema_version ${ver} for ${entry.doc} (supported: ${Object.keys(entry.versions).join(", ")})`,
        ],
        warnings: [],
        parsed: null,
      };
    }
    return entry.versions[ver](content, relPath);
  }

  const defaultVer = Math.max(...Object.keys(entry.versions).map(Number));
  return entry.versions[defaultVer](content, relPath);
}

export function isSchemaDoc(relPath) {
  return Boolean(schemaEntryForPath(relPath));
}

export {
  parseProductBrief,
  validateProductBrief,
  validateProductRoadmap,
  validateProductBacklog,
  validateProductMetrics,
  validateProductInsights,
  validateProductCompetitive,
  validateProductPersonas,
  validateProductExperiments,
  validateArchitectureOverview,
  validateArchitectureConstraints,
  validateArchitectureInterfaces,
  validateArchitectureDecisions,
  validateArchitectureRisks,
  validateEngineeringInFlight,
  validateProjectPlan,
  validateProjectStatus,
  validateProjectRisks,
  validateProjectMilestones,
  validateQaQueue,
  validateQaFindings,
  validateQaTestPlan,
  validateSecurityThreatModel,
  validateSecurityFindings,
  validateSecurityChecklist,
  validateReleaseChecklist,
  validateReleaseNotes,
  validateReleaseStatus,
  validateMarketingPositioning,
  validateMarketingMessaging,
  validateMarketingVoice,
  validateMarketingCalendar,
  validateMarketingSocialQueue,
  validateDesignThemes,
  validateDesignStructure,
  validateDesignTokens,
  validateDesignScreens,
  validateDesignComponents,
  validateDesignPrinciples,
  validateProductSpec,
};
