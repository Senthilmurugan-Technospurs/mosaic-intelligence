import { NextRequest, NextResponse } from 'next/server';
import { mockRecommendations } from '@/mocks/recommendations';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({ ids: [] }));
  const ids: string[] = body.ids ?? [];
  const undoDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const updated = ids.map((id) => {
    const rec = mockRecommendations.find((r) => r.id === id);
    if (!rec) return null;
    return {
      ...rec,
      status: 'applied',
      appliedAt: new Date().toISOString(),
      appliedBy: 'Current User',
      comment: body.comment ?? null,
      canUndo: true,
      undoDeadline,
    };
  }).filter(Boolean);
  return NextResponse.json({ applied: updated });
}
