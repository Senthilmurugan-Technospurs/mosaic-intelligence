'use client';

import { Tooltip } from '@/components/ui/MosaicUI';
import { getCampaignProjectedLift } from '@/lib/campaignProjectedLift';
import { PROJECTED_LIFT_COLUMN_TOOLTIP } from '@/lib/recommendationLift';
import { spurTk } from '@/lib/spurMosaicTokens';

/**
 * Per-campaign projected lift — Google Ads pattern:
 * heading → bold value → metric label → optional secondary (cost/context).
 */
export default function ProjectedLiftCell({
  campaignId,
  fallbackPercent = 0,
}: {
  campaignId: string;
  fallbackPercent?: number;
}) {
  const projected = getCampaignProjectedLift(campaignId);

  if (!projected) {
    if (fallbackPercent <= 0) {
      return (
        <span className="text-sm font-medium" style={{ color: spurTk.muted }}>
          —
        </span>
      );
    }
    return (
      <Tooltip title={PROJECTED_LIFT_COLUMN_TOOLTIP}>
        <span className="inline-flex cursor-help flex-col items-center leading-tight">
          <span className="text-sm font-bold" style={{ color: spurTk.green }}>
            +{fallbackPercent}%
          </span>
          <span className="text-[10px]" style={{ color: spurTk.muted }}>
            expected lift
          </span>
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={PROJECTED_LIFT_COLUMN_TOOLTIP}>
      <span className="inline-flex cursor-help flex-col items-center leading-tight text-center">
        <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: spurTk.muted }}>
          {projected.heading}
        </span>
        <span className="mt-0.5 text-[15px] font-bold leading-none" style={{ color: spurTk.green }}>
          {projected.value}
        </span>
        {projected.metric && (
          <span className="mt-0.5 text-[11px] font-semibold leading-tight" style={{ color: spurTk.green }}>
            {projected.metric}
          </span>
        )}
        {projected.secondary && (
          <span className="mt-0.5 max-w-[120px] text-[10px] leading-tight" style={{ color: spurTk.muted }}>
            {projected.secondary}
          </span>
        )}
      </span>
    </Tooltip>
  );
}
