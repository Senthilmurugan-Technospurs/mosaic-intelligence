import { NextResponse } from 'next/server';
import { mockCampaigns } from '@/mocks/campaigns';
import { getAllRecommendations } from '@/lib/allRecommendations';
import { calculateRecommendationTileStats } from '@/lib/recommendationStats';

export async function GET() {
  const allRecommendations = getAllRecommendations();
  const stats = calculateRecommendationTileStats(
    allRecommendations,
    mockCampaigns,
    'active-campaigns-only',
  );

  const campaigns = mockCampaigns.map((c) => ({
    ...c,
    ignoredRecommendations: 0,
  }));

  return NextResponse.json({ campaigns, stats });
}
