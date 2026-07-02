import { NextResponse } from 'next/server';
import { mockCampaigns } from '@/mocks/campaigns';
import { getAllRecommendations } from '@/lib/allRecommendations';
import { buildCampaignCompareRows } from '@/lib/recommendationCompare';

export async function POST() {
  const all = getAllRecommendations();
  const names = Object.fromEntries(mockCampaigns.map((c) => [c.campaignId, c.campaignName]));
  const platforms = Object.fromEntries(mockCampaigns.map((c) => [c.campaignId, c.platform]));
  const rows = buildCampaignCompareRows(all, names, platforms);
  return NextResponse.json({ rows, syncedAt: '2026-07-02T08:00:00Z' });
}
