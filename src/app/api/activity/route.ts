import { NextResponse } from 'next/server';
import { fetchRecentTransactions, txToActivity } from '@/lib/api';

export async function GET() {
  const txs = await fetchRecentTransactions(15);
  const activity = txs.map(txToActivity);

  return NextResponse.json({ activity });
}
