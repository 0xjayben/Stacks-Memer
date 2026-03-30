'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface SearchResult {
  contractId: string;
  name: string;
  symbol: string;
  imageUri: string | null;
  price: number;
  volume24h: number;
  priceChange24h: number;
}

/**
 * Debounced search hook that queries /api/search.
 * Waits 300ms after the user stops typing before firing the request.
 */
export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('useSearch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  return { query, setQuery, results, loading };
}
