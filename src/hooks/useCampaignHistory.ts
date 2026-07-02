import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { AuditLogEntry } from '@/types/recommendation';
import { getCampaignHistorySnapshot } from '@/lib/campaignDetailCache';

export function useCampaignHistory(campaignId: string) {
  const snapshot = campaignId ? getCampaignHistorySnapshot(campaignId) : [];

  return useQuery<AuditLogEntry[]>({
    queryKey: ['recommendations', 'history', campaignId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/recommendations/campaigns/${campaignId}/history`);
      return data;
    },
    enabled: !!campaignId,
    initialData: snapshot,
    placeholderData: snapshot,
    staleTime: 60_000,
  });
}
