import { getRecommendationsForCampaign } from '@/lib/allRecommendations';
import { isMosaicRec } from '@/lib/recommendationSources';

/** Google Ads–style projected outcome (value + metric + optional secondary). */
export interface ProjectedLiftDisplay {
  heading: string;
  value: string;
  metric: string;
  secondary?: string;
}

export function parseEstimatedImpact(impact: string): ProjectedLiftDisplay {
  const segments = impact.split('·').map((s) => s.trim());
  const main = segments[0] ?? impact;
  const secondary = segments.length > 1 ? segments.slice(1).join(' · ') : undefined;

  const match = main.match(/^(\+[\d,.]+[kKmM]?%?|-\d+%?)\s+(.+)$/);

  if (match) {
    return {
      heading: 'Projected estimate',
      value: match[1].trim(),
      metric: match[2].trim(),
      secondary,
    };
  }

  return {
    heading: 'Projected estimate',
    value: main,
    metric: '',
    secondary,
  };
}

/** Primary pending MOSAIC rec projected outcome for a campaign row. */
export function getCampaignProjectedLift(campaignId: string): ProjectedLiftDisplay | null {
  const pending = getRecommendationsForCampaign(campaignId).filter(
    (r) => isMosaicRec(r) && r.status === 'pending',
  );

  const anchor =
    pending.find((r) => r.isPrimary && r.level === 'campaign') ??
    [...pending].sort((a, b) => b.score.expectedLift - a.score.expectedLift)[0];

  if (!anchor?.estimatedImpact) return null;
  return parseEstimatedImpact(anchor.estimatedImpact);
}
