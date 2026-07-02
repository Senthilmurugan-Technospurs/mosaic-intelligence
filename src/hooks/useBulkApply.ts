import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { Recommendation } from '@/types/recommendation';
import { CampaignDetailResponse } from './useCampaignRecommendations';

interface CampaignQueryContext {
  prev?: CampaignDetailResponse;
}

export function useBulkApply(campaignId: string) {
  const qc = useQueryClient();
  return useMutation<{ applied: Recommendation[] }, Error, { ids: string[]; comment?: string }, CampaignQueryContext>({
    mutationFn: async ({ ids, comment }) => {
      const { data } = await apiClient.post('/recommendations/bulk-apply', { ids, comment });
      return data;
    },
    onMutate: async ({ ids }) => {
      await qc.cancelQueries({ queryKey: ['recommendations', 'campaign', campaignId] });
      const prev = qc.getQueryData<CampaignDetailResponse>(['recommendations', 'campaign', campaignId]);
      qc.setQueryData<CampaignDetailResponse>(['recommendations', 'campaign', campaignId], (old) => {
        if (!old) return old;
        return {
          ...old,
          recommendations: old.recommendations.map((r: Recommendation) =>
            ids.includes(r.id) ? { ...r, status: 'applied' } : r,
          ),
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx: CampaignQueryContext | undefined) => {
      if (ctx?.prev) qc.setQueryData(['recommendations', 'campaign', campaignId], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['recommendations', 'campaign', campaignId] });
      qc.invalidateQueries({ queryKey: ['recommendations', 'campaigns'] });
    },
  });
}
