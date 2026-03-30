'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TokenWithPrice } from '@/lib/api';
import { useRealtime } from './useRealtime';

export function useTokens(search = '') {
  const [tokens, setTokens] = useState<TokenWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: '50' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/tokens?${params}`);
      const data = await res.json();
      setTokens(data.tokens || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tokens');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    refetch();
    const interval = setInterval(refetch, 30_000); // refresh every 30s
    return () => clearInterval(interval);
  }, [refetch]);

  // Merge live realtime updates
  useRealtime({
    onTokenAdded: (newToken: any) => {
      // Create a default TokenWithPrice fallback from the Postgres record
      const liveToken: TokenWithPrice = {
        name: newToken.name,
        symbol: newToken.symbol,
        contractId: newToken.contract_address,
        decimals: 6,
        totalSupply: '0',
        imageUri: newToken.logo_url,
        price: 0,
        priceChange24h: 0,
        volume24h: 0,
        marketCap: 0,
        holders: 0,
      };
      
      setTokens((prev) => {
        if (prev.find(t => t.contractId === liveToken.contractId)) return prev;
        return [liveToken, ...prev];
      });
    },
    onVoteAdded: (updatedTokenRecord: any) => {
      // In useTokens, we might not display vote counts directly, but if we did we'd map it here.
    }
  });

  return { tokens, loading, error, refetch };
}
