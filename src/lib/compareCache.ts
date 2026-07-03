import { mockCampaigns } from '@/mocks/campaigns';
import { getAllRecommendations } from '@/lib/allRecommendations';
import {
  buildCampaignComparePairs,
  buildCampaignCompareRows,
  type CampaignCompareRow,
  type RecommendationComparePair,
} from '@/lib/recommendationCompare';
import { DEMO_PLATFORM_SYNCED_AT } from '@/lib/allRecommendations';

let allRecsCache: ReturnType<typeof getAllRecommendations> | null = null;

function allRecs() {
  if (!allRecsCache) allRecsCache = getAllRecommendations();
  return allRecsCache;
}

const pairCache = new Map<string, RecommendationComparePair[]>();

export function getComparePairsForCampaign(campaignId: string): RecommendationComparePair[] {
  let pairs = pairCache.get(campaignId);
  if (!pairs) {
    pairs = buildCampaignComparePairs(allRecs(), campaignId);
    pairCache.set(campaignId, pairs);
  }
  return pairs;
}

let compareRowsCache: CampaignCompareRow[] | null = null;

export function getCompareRowsSnapshot(): CampaignCompareRow[] {
  if (!compareRowsCache) {
    const names = Object.fromEntries(mockCampaigns.map((c) => [c.campaignId, c.campaignName]));
    const platforms = Object.fromEntries(mockCampaigns.map((c) => [c.campaignId, c.platform]));
    compareRowsCache = buildCampaignCompareRows(allRecs(), names, platforms);
  }
  return compareRowsCache;
}

export function getCompareListSnapshot() {
  return { rows: getCompareRowsSnapshot(), syncedAt: DEMO_PLATFORM_SYNCED_AT };
}
