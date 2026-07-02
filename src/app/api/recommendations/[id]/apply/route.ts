import { NextRequest, NextResponse } from 'next/server';
import { mockRecommendations } from '@/mocks/recommendations';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const rec = mockRecommendations.find((r) => r.id === params.id);
  if (!rec) {
    return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 });
  }
  const body = await req.json().catch(() => ({}));
  const undoDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  return NextResponse.json({
    ...rec,
    status: 'applied',
    appliedAt: new Date().toISOString(),
    appliedBy: 'Current User',
    comment: body.comment ?? null,
    canUndo: true,
    undoDeadline,
  });
}
