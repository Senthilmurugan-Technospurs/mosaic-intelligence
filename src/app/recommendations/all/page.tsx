'use client';

import Link from 'next/link';
import AppHeader from '@/components/layout/AppHeader';
import CampaignSummaryTable from '@/components/recommendations/CampaignSummaryTable';
import { useRecommendations } from '@/hooks/useRecommendations';
import { getSourceCountsByCampaign } from '@/lib/campaignSourceCounts';
import { Card } from '@/components/ui/MosaicUI';
import { MosaicCampaignStatsBar } from '@/components/mosaic/MosaicSpurPieces';
import { MOSAIC_FULL } from '@/lib/mosaicBranding';
import { spurTk } from '@/lib/spurMosaicTokens';
import { useMemo } from 'react';

export default function AllRecommendationsPage() {
  const { data, isLoading } = useRecommendations();
  const campaigns = useMemo(() => data?.campaigns ?? [], [data?.campaigns]);
  const stats = data?.stats;
  const sourceByCampaign = useMemo(() => getSourceCountsByCampaign(), []);

  return (
    <div className="mosaic-page">
      <AppHeader />
      <main className="mosaic-main space-y-6">
        <div
          className="mosaic-hero"
          style={{
            border: `1px solid ${spurTk.border}`,
            background: `linear-gradient(135deg, ${spurTk.surface} 0%, color-mix(in srgb, ${spurTk.accent} 6%, ${spurTk.surface}) 100%)`,
          }}
        >
          <p className="text-[11px] tracking-wide" style={{ color: spurTk.muted }}>
            AI Tools · MOSAIC Intelligence
          </p>
          <h1 className="mt-1 text-[22px] font-bold" style={{ color: spurTk.text }}>
            Recommendation dashboard
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: spurTk.muted }}>
            {MOSAIC_FULL}
          </p>
          <p className="mt-1 max-w-2xl text-[13px]" style={{ color: spurTk.muted }}>
            Review and apply AI-generated recommendations across campaigns and generation schedules.
          </p>

          {stats && (
            <div className="mt-5">
              <MosaicCampaignStatsBar stats={stats} />
            </div>
          )}
        </div>

        <Card className="overflow-hidden p-0" style={{ borderColor: spurTk.border }}>
          <div className="border-b px-5 py-4" style={{ borderColor: spurTk.border }}>
            <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: spurTk.text }}>
              <span style={{ color: spurTk.accent }}>|</span> Campaigns
            </h2>
            <p className="mt-2 text-[13px]" style={{ color: spurTk.muted }}>
              Each row shows how many recommendations exist per source. Click a row to open campaign details.
              The <strong>Compare</strong> button appears when MOSAIC and a native platform both have suggestions.
            </p>
          </div>
          <div className="p-4">
            <CampaignSummaryTable
              data={campaigns}
              loading={isLoading}
              sourceByCampaign={sourceByCampaign}
            />
          </div>
        </Card>

        <div className="text-center text-sm">
          <Link href="/recommendations/compare" className="font-medium hover:underline" style={{ color: spurTk.accent }}>
            View all campaigns in comparison workspace →
          </Link>
        </div>
      </main>
    </div>
  );
}
