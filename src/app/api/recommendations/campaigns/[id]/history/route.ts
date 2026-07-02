import { NextRequest, NextResponse } from 'next/server';
import { mockHistory } from '@/mocks/history';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const entries = mockHistory.filter((h) => h.campaignId === params.id);
  return NextResponse.json(entries);
}
