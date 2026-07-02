import { NextRequest, NextResponse } from 'next/server';
import { mockRecommendations } from '@/mocks/recommendations';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const rec = mockRecommendations.find((r) => r.id === params.id);
  if (!rec) {
    return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 });
  }
  return NextResponse.json({
    ...rec,
    status: 'rolled_back',
    canUndo: false,
    undoDeadline: undefined,
  });
}
