'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ActivityItem } from '@/lib/api';

export function useActivity() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch('/api/activity');
      const data = await res.json();
      setActivity(data.activity || []);
    } catch (err) {
      console.error('useActivity error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
    const interval = setInterval(refetch, 10_000); // refresh every 10s
    return () => clearInterval(interval);
  }, [refetch]);

  return { activity, loading, refetch };
}
