import { Recommendation } from '@/types/recommendation';

/** Where a compare / platform tile should navigate for apply or review. */
export function getRecommendationApplyHref(rec: Recommendation): string {
  if (rec.source === 'google_ads' || rec.source === 'meta') {
    return rec.managerDeepLink ?? `/recommendations/${rec.campaignId}`;
  }
  return `/recommendations/${rec.campaignId}?apply=${encodeURIComponent(rec.id)}`;
}

export function isExternalRecommendationHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
