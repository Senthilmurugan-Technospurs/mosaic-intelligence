import { DataWindow } from './generationRun';

export type RecLevel = 'campaign' | 'ad_set' | 'segment';

export type RecType =
  | 'budget_orchestration'
  | 'bid_policy'
  | 'audience_strategy'
  | 'placement'
  | 'geo_daypart';

export type RecStatus = 'pending' | 'applied' | 'dismissed' | 'rolled_back';

export type RiskLevel = 'low' | 'medium' | 'high';

export type Reversibility = 'easy' | 'moderate' | 'hard';

export type AuditAction = 'applied' | 'dismissed' | 'rolled_back';

export interface RecScore {
  expectedLift: number; // 0-100
  confidence: number;   // 0-100
  risk: RiskLevel;
  reversibility: Reversibility;
}

export type RecommendationSource = 'mosaic' | 'google_ads' | 'meta';

export interface Recommendation {
  id: string;
  campaignId: string;
  level: RecLevel;
  type: RecType;
  title: string;
  description: string;
  rationale: string;
  score: RecScore;
  status: RecStatus;
  isPrimary: boolean;
  parentRecommendationId?: string;
  adSetId?: string;
  adSetName?: string;
  segmentId?: string;
  segmentDimension?: string;
  currentValue?: string;
  proposedValue?: string;
  estimatedImpact?: string;
  appliedAt?: string;   // ISO
  appliedBy?: string;
  comment?: string;
  generatedAt: string;  // ISO
  generationRunId: string;
  dataWindow: DataWindow;
  canUndo: boolean;
  undoDeadline?: string; // ISO
  /** Recommendation origin — MOSAIC AI vs native ad platform (demo). */
  source?: RecommendationSource;
  managerDeepLink?: string;
  externalId?: string;
  /** Original platform recommendation type label (e.g. Sitelink extension) when it does not map to a MOSAIC module name. */
  nativeTypeLabel?: string;
}

export interface AuditLogEntry {
  id: string;
  recommendationId: string;
  recommendationTitle: string;
  campaignId: string;
  action: AuditAction;
  actorName: string;
  actorEmail: string;
  comment?: string;
  reason?: string;
  timestamp: string; // ISO
  snapshotBefore?: Record<string, unknown>;
  snapshotAfter?: Record<string, unknown>;
}
