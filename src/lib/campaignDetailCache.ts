import { mockCampaignDetails } from '@/mocks/campaigns';
import { mockHistory } from '@/mocks/history';
import { getRecommendationsForCampaign, getAllRecommendations } from '@/lib/allRecommendations';
import { buildCampaignComparePairs } from '@/lib/recommendationCompare';
import type { CampaignDetailResponse } from '@/hooks/useCampaignRecommendations';

export function getCampaignDetailSnapshot(campaignId: string): CampaignDetailResponse | undefined {
  const campaign = mockCampaignDetails[campaignId];
  if (!campaign) return undefined;
  return {
    campaign,
    recommendations: getRecommendationsForCampaign(campaignId),
    comparePairs: buildCampaignComparePairs(getAllRecommendations(), campaignId),
  };
}

export function getCampaignHistorySnapshot(campaignId: string) {
  return mockHistory.filter((h) => h.campaignId === campaignId);
}
