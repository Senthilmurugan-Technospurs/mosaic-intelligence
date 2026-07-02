'use client';

import Link from 'next/link';
import AppHeader from '@/components/layout/AppHeader';
import CampaignSummaryTable from '@/components/recommendations/CampaignSummaryTable';
import { useRecommendations } from '@/hooks/useRecommendations';
import { getSourceCountsByCampaign } from '@/lib/campaignSourceCounts';
import { Card, StatCard } from '@/components/ui/MosaicUI';
import { MosaicUspStrip } from '@/components/branding/MosaicUsp';
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
        <div className="mosaic-hero">
          <div className="space-y-1">
            <p className="text-xs tracking-wide text-[#5f7387]">AI Tools · MOSAIC Intelligence</p>
            <h1 className="text-2xl font-bold text-[#102131]">Recommendation dashboard</h1>
            <p className="max-w-2xl text-sm text-[#5f7387]">
              Campaign-level view of recommendations from MOSAIC, Google Ads, and Meta.
              Open a campaign to review MOSAIC AI actions, or use Compare when multiple engines suggest changes.
            </p>
          </div>
          <div className="mt-4">
            <MosaicUspStrip />
          </div>

          {stats && (
            <div className="mosaic-stats-grid">
              <StatCard title="Total" value={stats.totalRecommendations} color="#102131" />
              <StatCard title="Applied" value={stats.appliedRecommendations} color="#10b981" />
              <StatCard title="Dismissed" value={stats.dismissedRecommendations} color="#6b7280" />
              <StatCard title="Ignored" value={stats.ignoredRecommendations} color="#d97706" />
              <StatCard title="Pending" value={stats.pendingRecommendations} color="#f59e0b" />
              <StatCard title="Avg lift" value={`${stats.potentialLiftAvg}%`} color="#22c7ee" />
            </div>
          )}
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="border-b border-[#e2ebf0] px-5 py-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-[#102131]">
              <span className="text-[#22c7ee]">|</span> Campaigns
            </h2>
            <p className="mt-2 text-sm text-[#5f7387]">
              Each row shows how many recommendations exist per source. Click a row to open campaign details.
              <strong className="text-violet-700"> MOSAIC</strong> columns show AI-orchestrated actions; Google/Meta are native platform counts.
              The <strong className="text-[#102131]">Compare</strong> button appears when MOSAIC and a native platform both have suggestions.
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
          <Link href="/recommendations/compare" className="text-[#0891b2] hover:underline">
            View all campaigns in comparison workspace →
          </Link>
        </div>
      </main>
    </div>
  );
}
