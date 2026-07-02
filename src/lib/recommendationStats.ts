import { CampaignRecommendationSummary, RecommendationTileStats } from '@/types/campaign';
import { Recommendation } from '@/types/recommendation';

type CampaignStatsScope = Pick<CampaignRecommendationSummary, 'campaignId' | 'status'>;

type PendingScope = 'active-campaigns-only' | 'all-provided-campaigns';

const zeroStats: RecommendationTileStats = {
  totalRecommendations: 0,
  appliedRecommendations: 0,
  dismissedRecommendations: 0,
  ignoredRecommendations: 0,
  pendingRecommendations: 0,
  potentialLiftAvg: 0,
};

export function calculateRecommendationTileStats(
  recommendations: Recommendation[],
  campaigns: CampaignStatsScope[],
  pendingScope: PendingScope,
): RecommendationTileStats {
  if (recommendations.length === 0 || campaigns.length === 0) return zeroStats;

  const statusByCampaign = new Map(campaigns.map((c) => [c.campaignId, c.status]));

  let pendingLiftSum = 0;
  let pendingLiftCount = 0;

  const stats = recommendations.reduce<RecommendationTileStats>((acc, rec) => {
    if (!statusByCampaign.has(rec.campaignId)) return acc;

    acc.totalRecommendations += 1;

    if (rec.status === 'applied') acc.appliedRecommendations += 1;
    if (rec.status === 'dismissed') acc.dismissedRecommendations += 1;

    if (rec.status === 'pending') {
      const isActiveCampaign = statusByCampaign.get(rec.campaignId) === 'active';
      if (pendingScope === 'all-provided-campaigns' || isActiveCampaign) {
        acc.pendingRecommendations += 1;
        pendingLiftSum += rec.score.expectedLift;
        pendingLiftCount += 1;
      }
    }

    return acc;
  }, { ...zeroStats });

  stats.potentialLiftAvg = pendingLiftCount > 0
    ? Math.round(pendingLiftSum / pendingLiftCount)
    : 0;

  return stats;
}
