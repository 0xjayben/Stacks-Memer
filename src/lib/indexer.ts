import { supabase } from './supabase';
import { fetchMarketTokens, type TokenWithPrice } from './api';

export interface IndexedToken extends TokenWithPrice {
  votes: number;
  trendingScore: number;
}

/**
 * Fetches tokens from both Market provider (DexScreener) and Supabase (votes),
 * merging them together and calculating composite scores.
 */
export async function getIndexedTokens(): Promise<IndexedToken[]> {
  try {
    // 1. Fetch market data
    const marketTokens = await fetchMarketTokens();

    // 2. Fetch community votes
    const { data: dbTokens, error } = await (supabase
      .from('tokens') as any)
      .select('contract_address, votes_count, created_at');

    if (error) {
      console.error('getIndexedTokens DB Error:', error);
      return [];
    }

    const dbMap = new Map(dbTokens?.map((t: any) => [t.contract_address, t]) || []);

    // 3. Merge and score
    const now = Date.now();
    
    return marketTokens.map((token: TokenWithPrice) => {
      const dbInfo: any = dbMap.get(token.contractId);
      const votes = dbInfo?.votes_count || 0;
      
      // Calculate age in days (default to 30 if unknown)
      const ageDays = dbInfo 
        ? (now - new Date(dbInfo.created_at).getTime()) / (1000 * 60 * 60 * 24)
        : 30;

      // RECENCY MULTIPLIER: Newer tokens get a slight boost
      // 0 days old = 2.0x, 30+ days old = 1.0x
      const recencyMultiplier = Math.max(1, 2 - (ageDays / 30));

      // SCORE CALCULATION
      // Volume is highly weighted, price momentum matters, votes provide base credibility
      const volumeScore = Math.log10(token.volume24h + 1) * 10;
      const momentumScore = token.priceChange24h > 0 ? (token.priceChange24h / 5) : 0; // Cap negative impact
      const communityScore = Math.log10(votes + 1) * 15;

      const baseScore = volumeScore + momentumScore + communityScore;
      const trendingScore = baseScore * recencyMultiplier;

      return {
        ...token,
        votes,
        trendingScore
      };
    });

  } catch (err) {
    console.error('getIndexedTokens Error:', err);
    return [];
  }
}

/**
 * Returns tokens sorted by their composite trending score.
 */
export async function getTrendingTokens(limit = 10): Promise<IndexedToken[]> {
  const tokens = await getIndexedTokens();
  return tokens
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit);
}

/**
 * Returns tokens sorted strictly by community votes (The Leaderboard)
 */
export async function getLeaderboardTokens(limit = 50): Promise<IndexedToken[]> {
  const tokens = await getIndexedTokens();
  return tokens
    .sort((a, b) => {
      // Primary sort by votes
      if (b.votes !== a.votes) {
        return b.votes - a.votes;
      }
      // Tie breaker: market cap
      return b.marketCap - a.marketCap;
    })
    .slice(0, limit);
}
