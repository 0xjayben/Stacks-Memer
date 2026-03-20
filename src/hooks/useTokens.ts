'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TokenWithPrice } from '@/lib/api';

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

  return { tokens, loading, error, refetch };
}
