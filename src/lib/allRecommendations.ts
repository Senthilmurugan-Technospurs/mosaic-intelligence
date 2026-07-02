import { mockRecommendations } from '@/mocks/recommendations';
import { mockPlatformRecommendations } from '@/mocks/platformRecommendations';
import { Recommendation, RecommendationSource } from '@/types/recommendation';

export function getMosaicRecommendations(): Recommendation[] {
  return mockRecommendations.map((r) => ({
    ...r,
    source: 'mosaic' as RecommendationSource,
  }));
}

export function getAllRecommendations(): Recommendation[] {
  return [...getMosaicRecommendations(), ...mockPlatformRecommendations];
}

export function getRecommendationsForCampaign(campaignId: string): Recommendation[] {
  return getAllRecommendations().filter((r) => r.campaignId === campaignId);
}

export const DEMO_PLATFORM_SYNCED_AT = '2026-07-02T08:00:00Z';
