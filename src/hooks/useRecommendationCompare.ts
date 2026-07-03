import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { CampaignCompareRow } from '@/lib/recommendationCompare';
import { getCompareListSnapshot } from '@/lib/compareCache';

const initialCompareData = getCompareListSnapshot();

export function useRecommendationCompare() {
  return useQuery<{ rows: CampaignCompareRow[]; syncedAt: string }>({
    queryKey: ['recommendations', 'compare'],
    queryFn: async () => {
      const snap = getCompareListSnapshot();
      if (snap.rows.length > 0) return snap;
      const { data } = await apiClient.post('/recommendations/compare');
      return data;
    },
    initialData: initialCompareData,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
