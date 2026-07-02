import { GenerationFrequency, DataWindow } from './generationRun';

export type CampaignStatus = 'active' | 'paused' | 'ended' | 'draft';

export interface RecommendationTileStats {
  totalRecommendations: number;
  appliedRecommendations: number;
  dismissedRecommendations: number;
  ignoredRecommendations: number;
  pendingRecommendations: number;
  potentialLiftAvg: number;
}

export interface CampaignRecommendationSummary {
  campaignId: string;
  campaignName: string;
  status: CampaignStatus;
  platform: string;       // e.g. "Meta", "Google", "DV360"
  totalBudget: number;    // in dollars
  flightStart: string;    // ISO date
  flightEnd: string;      // ISO date
  totalRecommendations: number;
  appliedRecommendations: number;
  pendingRecommendations: number;
  dismissedRecommendations: number;
  ignoredRecommendations: number;
  potentialLiftAvg: number; // avg expected lift across pending recs
  lastGeneratedAt: string;  // ISO
  hasNewRecommendations: boolean;
  generationFrequency: GenerationFrequency;
  dataWindow: DataWindow;
  nextGenerationAt: string; // ISO
}

export interface CampaignDetail extends CampaignRecommendationSummary {
  objective: string;
  dailyBudget: number;
  bidStrategy: string;
  targetCpa?: number;
  targetRoas?: number;
}

export interface RecommendationsDashboardResponse {
  campaigns: CampaignRecommendationSummary[];
  stats: RecommendationTileStats;
}
