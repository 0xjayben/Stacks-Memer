import { NextResponse } from 'next/server';
import { fetchMarketHistoricalPrices } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contractId = searchParams.get('contractId') || '';

  if (!contractId) {
    return NextResponse.json({ error: 'Missing contractId' }, { status: 400 });
  }

  const data = await fetchMarketHistoricalPrices(contractId);
  return NextResponse.json({ data });
}
