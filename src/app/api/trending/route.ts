import { NextResponse } from 'next/server';
import { getTrendingTokens } from '@/lib/indexer';

/**
 * GET /api/trending
 * Returns the top 10 tokens sorted by our custom composite indexer
 * (which weighs trading volume, price momentum, recency, and community votes).
 */
export async function GET() {
  try {
    const trending = await getTrendingTokens(10);
    return NextResponse.json({ trending });
  } catch (error) {
    console.error('API Error: /api/trending', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
