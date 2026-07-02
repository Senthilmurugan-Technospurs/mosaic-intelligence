import { Recommendation, RecommendationSource } from '@/types/recommendation';

export type CompareMatchType =
  | 'aligned'
  | 'similar'
  | 'conflict'
  | 'mosaic_only'
  | 'platform_only'
  | 'mixed';

export interface CampaignCompareRow {
  campaignId: string;
  campaignName: string;
  platform: string;
  mosaicCount: number;
  googleCount: number;
  metaCount: number;
  conflictCount: number;
  alignedCount: number;
  alignment: CompareMatchType;
  topSummary: string;
}

export interface RecommendationComparePair {
  id: string;
  matchType: CompareMatchType;
  summary: string;
  category: string;
  mosaic?: Recommendation;
  google?: Recommendation;
  meta?: Recommendation;
}

const MOSAIC_SOURCE: RecommendationSource = 'mosaic';

function isMosaic(rec: Recommendation): boolean {
  return !rec.source || rec.source === MOSAIC_SOURCE;
}

function categoryOf(rec: Recommendation): string {
  return rec.type;
}

function budgetDirection(rec?: Recommendation): 'up' | 'down' | 'neutral' | null {
  if (!rec) return null;
  const text = `${rec.title} ${rec.description} ${rec.currentValue} ${rec.proposedValue}`.toLowerCase();
  if (text.includes('increase') || text.includes('raise') || text.includes('expand')) return 'up';
  if (text.includes('decrease') || text.includes('lower') || text.includes('reduce')) return 'down';
  return 'neutral';
}

function matchPair(
  mosaic?: Recommendation,
  platform?: Recommendation,
): { matchType: CompareMatchType; summary: string } {
  if (!mosaic && platform) {
    return { matchType: 'platform_only', summary: 'Shown in the ad platform only.' };
  }
  if (mosaic && !platform) {
    return { matchType: 'mosaic_only', summary: 'MOSAIC recommendation — not surfaced in the platform manager.' };
  }
  if (!mosaic || !platform) {
    return { matchType: 'mixed', summary: 'No comparison available.' };
  }

  const catM = categoryOf(mosaic);
  const catP = categoryOf(platform);
  if (catM !== catP) {
    return {
      matchType: 'conflict',
      summary: `Different focus: MOSAIC (${catM}) vs platform (${catP}).`,
    };
  }

  if (catM === 'budget_orchestration') {
    const dirM = budgetDirection(mosaic);
    const dirP = budgetDirection(platform);
    if (dirM && dirP && dirM !== dirP) {
      return { matchType: 'conflict', summary: `Budget direction differs (${dirM} vs ${dirP}).` };
    }
    if (dirM === dirP && dirM !== 'neutral') {
      return { matchType: 'aligned', summary: 'Same budget intent and direction.' };
    }
  }

  return { matchType: 'similar', summary: 'Related recommendation — compare proposed values.' };
}

export function buildCampaignCompareRows(
  allRecs: Recommendation[],
  campaignNames: Record<string, string>,
  campaignPlatforms: Record<string, string>,
): CampaignCompareRow[] {
  const byCampaign = new Map<string, Recommendation[]>();
  for (const rec of allRecs) {
    const list = byCampaign.get(rec.campaignId) || [];
    list.push(rec);
    byCampaign.set(rec.campaignId, list);
  }

  return Array.from(byCampaign.entries()).map(([campaignId, recs]) => {
    const mosaic = recs.filter(isMosaic);
    const google = recs.filter((r) => r.source === 'google_ads');
    const meta = recs.filter((r) => r.source === 'meta');
    const platform = [...google, ...meta];

    let conflictCount = 0;
    let alignedCount = 0;
    for (const m of mosaic) {
      const cat = categoryOf(m);
      const counterparts = platform.filter((p) => categoryOf(p) === cat);
      if (!counterparts.length) continue;
      const { matchType } = matchPair(m, counterparts[0]);
      if (matchType === 'conflict') conflictCount += 1;
      if (matchType === 'aligned') alignedCount += 1;
    }

    let alignment: CompareMatchType = 'mixed';
    if (conflictCount > 0) alignment = 'conflict';
    else if (alignedCount > 0 && mosaic.length > 0 && platform.length > 0) alignment = 'aligned';
    else if (mosaic.length > 0 && platform.length === 0) alignment = 'mosaic_only';
    else if (mosaic.length === 0 && platform.length > 0) alignment = 'platform_only';
    else if (mosaic.length > 0 && platform.length > 0) alignment = 'similar';

    const topSummary = conflictCount > 0
      ? `${conflictCount} conflict${conflictCount !== 1 ? 's' : ''}`
      : alignedCount > 0
        ? `${alignedCount} aligned`
        : mosaic.length && platform.length
          ? 'Review platform vs MOSAIC'
          : mosaic.length
            ? 'MOSAIC only'
            : 'Platform only';

    return {
      campaignId,
      campaignName: campaignNames[campaignId] || campaignId,
      platform: campaignPlatforms[campaignId] || '—',
      mosaicCount: mosaic.length,
      googleCount: google.length,
      metaCount: meta.length,
      conflictCount,
      alignedCount,
      alignment,
      topSummary,
    };
  }).sort((a, b) => b.conflictCount - a.conflictCount || b.mosaicCount - a.mosaicCount);
}

export function buildCampaignComparePairs(
  allRecs: Recommendation[],
  campaignId: string,
): RecommendationComparePair[] {
  const recs = allRecs.filter((r) => r.campaignId === campaignId);
  const mosaic = recs.filter(isMosaic);
  const google = recs.filter((r) => r.source === 'google_ads');
  const meta = recs.filter((r) => r.source === 'meta');
  const categories = Array.from(new Set(recs.map(categoryOf)));

  const pairs: RecommendationComparePair[] = [];

  for (const category of categories) {
    const m = mosaic.find((r) => categoryOf(r) === category);
    const g = google.find((r) => categoryOf(r) === category);
    const mt = meta.find((r) => categoryOf(r) === category);

    if (m && g) {
      const { matchType, summary } = matchPair(m, g);
      pairs.push({ id: `${category}-mg`, matchType, summary, category, mosaic: m, google: g, meta: mt });
    } else if (m && mt) {
      const { matchType, summary } = matchPair(m, mt);
      pairs.push({ id: `${category}-mm`, matchType, summary, category, mosaic: m, meta: mt, google: g });
    } else if (m) {
      const { matchType, summary } = matchPair(m, undefined);
      pairs.push({ id: `${category}-m`, matchType, summary, category, mosaic: m });
    } else if (g || mt) {
      const p = g || mt;
      const { matchType, summary } = matchPair(undefined, p);
      pairs.push({ id: `${category}-p`, matchType, summary, category, google: g, meta: mt });
    }
  }

  const order: CompareMatchType[] = ['conflict', 'aligned', 'similar', 'mosaic_only', 'platform_only', 'mixed'];
  return pairs.sort((a, b) => order.indexOf(a.matchType) - order.indexOf(b.matchType));
}

export const ALIGNMENT_LABEL: Record<CompareMatchType, string> = {
  aligned: 'Aligned',
  similar: 'Similar',
  conflict: 'Conflict',
  mosaic_only: 'MOSAIC only',
  platform_only: 'Platform only',
  mixed: 'Mixed',
};

export const ALIGNMENT_COLOR: Record<CompareMatchType, string> = {
  aligned: '#10b981',
  similar: '#3b82f6',
  conflict: '#ef4444',
  mosaic_only: '#8b5cf6',
  platform_only: '#f59e0b',
  mixed: '#6b7280',
};
