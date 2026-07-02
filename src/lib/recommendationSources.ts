import { Recommendation, RecommendationSource } from '@/types/recommendation';
import { CategoryKey, matchesCategory } from '@/lib/recommendationTree';

export function isMosaicRec(rec: Recommendation): boolean {
  return !rec.source || rec.source === 'mosaic';
}

export function isPlatformRec(rec: Recommendation): boolean {
  return rec.source === 'google_ads' || rec.source === 'meta';
}

export function platformSourceLabel(source: RecommendationSource): string {
  if (source === 'google_ads') return 'Google Ads';
  if (source === 'meta') return 'Meta';
  return 'Platform';
}

/** MOSAIC recs for the main workflow (primary, modules, hierarchy). */
export function getMosaicRecs(recs: Recommendation[]): Recommendation[] {
  return recs.filter(isMosaicRec);
}

/** Native platform recs for the subdued platform-specific panel. */
export function getPlatformRecs(
  recs: Recommendation[],
  sourceTab: 'all' | RecommendationSource,
): Recommendation[] {
  const platform = recs.filter(isPlatformRec);
  if (sourceTab === 'google_ads') return platform.filter((r) => r.source === 'google_ads');
  if (sourceTab === 'meta') return platform.filter((r) => r.source === 'meta');
  return platform;
}

export function filterPlatformByCategory(
  recs: Recommendation[],
  category: CategoryKey,
): Recommendation[] {
  return recs.filter((r) => matchesCategory(r, category));
}
