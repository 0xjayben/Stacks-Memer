import { NextResponse } from 'next/server';
import { fetchVelarHistoricalPrices } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contractId = searchParams.get('contractId') || '';

  if (!contractId) {
    return NextResponse.json({ error: 'Missing contractId' }, { status: 400 });
  }

  const data = await fetchVelarHistoricalPrices(contractId);
  return NextResponse.json({ data });
}
