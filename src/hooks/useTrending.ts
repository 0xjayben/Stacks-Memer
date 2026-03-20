'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TokenWithPrice } from '@/lib/api';

export function useTrending() {
  const [trending, setTrending] = useState<TokenWithPrice[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch('/api/trending');
      const data = await res.json();
      setTrending(data.trending || []);
    } catch (err) {
      console.error('useTrending error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
    const interval = setInterval(refetch, 30_000);
    return () => clearInterval(interval);
  }, [refetch]);

  return { trending, loading, refetch };
}
