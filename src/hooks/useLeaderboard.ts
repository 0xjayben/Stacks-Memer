'use client';

import { useState, useEffect, useCallback } from 'react';
import type { IndexedToken } from '@/lib/indexer';
import { useRealtime } from './useRealtime';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<IndexedToken[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error('useLeaderboard error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
    const interval = setInterval(refetch, 30_000); // 30s refresh fallback
    return () => clearInterval(interval);
  }, [refetch]);

  // Merge live realtime updates for immediate vote feedback
  useRealtime({
    onVoteAdded: (updatedTokenRecord: any) => {
      // Find token and increment/update votes
      setLeaderboard((prev) => {
        const next = prev.map(t => {
          if (t.contractId === updatedTokenRecord.contract_address) {
            return { ...t, votes: updatedTokenRecord.votes_count };
          }
          return t;
        });
        // Re-sort live
        return next.sort((a, b) => b.votes - a.votes);
      });
    }
  });

  return { leaderboard, loading, refetch };
}
