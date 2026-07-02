import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { CampaignCompareRow } from '@/lib/recommendationCompare';
import { buildCampaignCompareRows } from '@/lib/recommendationCompare';
import { mockCampaigns } from '@/mocks/campaigns';
import { getAllRecommendations } from '@/lib/allRecommendations';

const initialCompareData = {
  rows: buildCampaignCompareRows(
    getAllRecommendations(),
    Object.fromEntries(mockCampaigns.map((c) => [c.campaignId, c.campaignName])),
    Object.fromEntries(mockCampaigns.map((c) => [c.campaignId, c.platform])),
  ),
  syncedAt: '2026-07-02T08:00:00Z',
};

export function useRecommendationCompare() {
  return useQuery<{ rows: CampaignCompareRow[]; syncedAt: string }>({
    queryKey: ['recommendations', 'compare'],
    queryFn: async () => {
      const { data } = await apiClient.post('/recommendations/compare');
      return data;
    },
    initialData: initialCompareData,
    staleTime: 60_000,
  });
}
