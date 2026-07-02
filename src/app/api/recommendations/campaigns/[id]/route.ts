import { NextRequest, NextResponse } from 'next/server';
import { mockCampaignDetails } from '@/mocks/campaigns';
import { getRecommendationsForCampaign } from '@/lib/allRecommendations';
import { buildCampaignComparePairs } from '@/lib/recommendationCompare';
import { getAllRecommendations } from '@/lib/allRecommendations';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const campaign = mockCampaignDetails[params.id];
  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }

  const recommendations = getRecommendationsForCampaign(params.id);
  const comparePairs = buildCampaignComparePairs(getAllRecommendations(), params.id);

  return NextResponse.json({ campaign, recommendations, comparePairs });
}
