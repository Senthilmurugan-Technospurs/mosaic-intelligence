import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { RecommendationsDashboardResponse } from '@/types/campaign';
import { mockCampaigns } from '@/mocks/campaigns';
import { calculateRecommendationTileStats } from '@/lib/recommendationStats';
import { getAllRecommendations } from '@/lib/allRecommendations';

const initialRecommendationsData: RecommendationsDashboardResponse = {
  campaigns: mockCampaigns,
  stats: calculateRecommendationTileStats(
    getAllRecommendations(),
    mockCampaigns,
    'active-campaigns-only',
  ),
};

export function useRecommendations() {
  return useQuery<RecommendationsDashboardResponse>({
    queryKey: ['recommendations', 'campaigns'],
    queryFn: async () => {
      const { data } = await apiClient.get('/recommendations/campaigns');
      return data;
    },
    initialData: initialRecommendationsData,
    staleTime: 60_000,
  });
}
