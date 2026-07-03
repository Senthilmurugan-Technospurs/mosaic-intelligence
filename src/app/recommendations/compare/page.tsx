'use client';

import AppHeader from '@/components/layout/AppHeader';
import CompareSummaryTable from '@/components/recommendations/CompareSummaryTable';
import { Card } from '@/components/ui/MosaicUI';
import { useRecommendationCompare } from '@/hooks/useRecommendationCompare';
import Link from 'next/link';

export default function RecommendationComparePage() {
  const { data } = useRecommendationCompare();
  const rows = data?.rows ?? [];

  return (
    <div className="mosaic-page">
      <AppHeader />
      <main className="mosaic-main">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#102131]">MOSAIC vs Ads Manager</h1>
          <p className="mt-1 text-sm text-[#5f7387]">
            Compare MOSAIC recommendations with native Google Ads and Meta suggestions at campaign list level.{' '}
            <Link href="/recommendations/all" className="text-[#0891b2] hover:underline">← Back to hub</Link>
          </p>
        </div>

        <Card>
          <p className="mb-4 text-xs text-[#5f7387]">
            See where our engine agrees with Google Ads and Meta, where platforms surface something extra, and where guidance conflicts.
          </p>
          <CompareSummaryTable data={rows} />
        </Card>

        {data?.syncedAt && (
          <p className="mt-4 text-center text-[11px] text-[#5f7387]">
            Platform sync demo · Last synced {new Date(data.syncedAt).toLocaleString()}
          </p>
        )}
      </main>
    </div>
  );
}
