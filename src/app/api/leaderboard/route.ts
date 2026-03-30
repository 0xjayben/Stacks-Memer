import { NextResponse } from 'next/server';
import { getLeaderboardTokens } from '@/lib/indexer';

/**
 * GET /api/leaderboard
 * Returns tokens sorted strictly by community votes. Ties are broken by market cap.
 */
export async function GET() {
  try {
    const leaderboard = await getLeaderboardTokens(50);
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('API Error: /api/leaderboard', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
