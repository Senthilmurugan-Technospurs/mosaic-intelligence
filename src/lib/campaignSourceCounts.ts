import { getAllRecommendations } from '@/lib/allRecommendations';

export type CampaignSourceCounts = {
  mosaic: number;
  google: number;
  meta: number;
};

export function getSourceCountsByCampaign(): Map<string, CampaignSourceCounts> {
  const map = new Map<string, CampaignSourceCounts>();
  for (const rec of getAllRecommendations()) {
    const existing = map.get(rec.campaignId) ?? { mosaic: 0, google: 0, meta: 0 };
    const src = rec.source || 'mosaic';
    if (src === 'mosaic') existing.mosaic += 1;
    else if (src === 'google_ads') existing.google += 1;
    else if (src === 'meta') existing.meta += 1;
    map.set(rec.campaignId, existing);
  }
  return map;
}

/** True when recommendations exist from 2+ sources (MOSAIC, Google, Meta). */
export function campaignHasMultiSource(counts: CampaignSourceCounts | undefined): boolean {
  if (!counts) return false;
  const active = [counts.mosaic > 0, counts.google > 0, counts.meta > 0].filter(Boolean).length;
  return active >= 2;
}

export function countMultiSourceCampaigns(
  campaignIds: string[],
  sourceByCampaign: Map<string, CampaignSourceCounts>,
): number {
  return campaignIds.filter((id) => campaignHasMultiSource(sourceByCampaign.get(id))).length;
}
