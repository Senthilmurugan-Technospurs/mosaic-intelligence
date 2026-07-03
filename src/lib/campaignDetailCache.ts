import { mockCampaignDetails } from '@/mocks/campaigns';
import { mockHistory } from '@/mocks/history';
import { getRecommendationsForCampaign } from '@/lib/allRecommendations';
import { getComparePairsForCampaign } from '@/lib/compareCache';
import type { CampaignDetailResponse } from '@/hooks/useCampaignRecommendations';

export function getCampaignDetailSnapshot(campaignId: string): CampaignDetailResponse | undefined {
  const campaign = mockCampaignDetails[campaignId];
  if (!campaign) return undefined;
  return {
    campaign,
    recommendations: getRecommendationsForCampaign(campaignId),
    comparePairs: getComparePairsForCampaign(campaignId),
  };
}

export function getCampaignHistorySnapshot(campaignId: string) {
  return mockHistory.filter((h) => h.campaignId === campaignId);
}
