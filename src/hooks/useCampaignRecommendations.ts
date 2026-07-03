import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { CampaignDetail } from '@/types/campaign';
import { Recommendation } from '@/types/recommendation';
import { RecommendationComparePair } from '@/lib/recommendationCompare';
import { getCampaignDetailSnapshot } from '@/lib/campaignDetailCache';

export interface CampaignDetailResponse {
  campaign: CampaignDetail;
  recommendations: Recommendation[];
  comparePairs?: RecommendationComparePair[];
}

export function useCampaignRecommendations(campaignId: string) {
  const snapshot = campaignId ? getCampaignDetailSnapshot(campaignId) : undefined;

  return useQuery<CampaignDetailResponse>({
    queryKey: ['recommendations', 'campaign', campaignId],
    queryFn: async () => {
      const snap = getCampaignDetailSnapshot(campaignId);
      if (snap) return snap;
      const { data } = await apiClient.get(`/recommendations/campaigns/${campaignId}`);
      return data;
    },
    enabled: !!campaignId,
    initialData: snapshot,
    placeholderData: (prev) => prev ?? snapshot,
    staleTime: snapshot ? Infinity : 60_000,
    gcTime: 5 * 60_000,
    refetchOnMount: !snapshot,
    refetchOnWindowFocus: false,
  });
}
