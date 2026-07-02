import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { Recommendation } from '@/types/recommendation';
import { CampaignDetailResponse } from './useCampaignRecommendations';

interface CampaignQueryContext {
  prev?: CampaignDetailResponse;
}

export function useUndoRecommendation(campaignId: string) {
  const qc = useQueryClient();
  return useMutation<Recommendation, Error, { id: string }, CampaignQueryContext>({
    mutationFn: async ({ id }) => {
      const { data } = await apiClient.post(`/recommendations/${id}/undo`, {});
      return data;
    },
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: ['recommendations', 'campaign', campaignId] });
      const prev = qc.getQueryData<CampaignDetailResponse>(['recommendations', 'campaign', campaignId]);
      qc.setQueryData<CampaignDetailResponse>(['recommendations', 'campaign', campaignId], (old) => {
        if (!old) return old;
        return {
          ...old,
          recommendations: old.recommendations.map((r: Recommendation) =>
            r.id === id ? { ...r, status: 'rolled_back', canUndo: false } : r,
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
    },
  });
}
