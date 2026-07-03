import { NextResponse } from 'next/server';
import { getCompareListSnapshot } from '@/lib/compareCache';

export async function POST() {
  return NextResponse.json(getCompareListSnapshot());
}
