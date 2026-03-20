import { NextResponse } from 'next/server';
import { fetchVelarTokens } from '@/lib/api';

export async function GET() {
  const tokens = await fetchVelarTokens();

  // Sort by volume descending = "trending"
  const enriched = tokens.sort((a, b) => b.volume24h - a.volume24h);

  return NextResponse.json({ trending: enriched.slice(0, 10) });
}
