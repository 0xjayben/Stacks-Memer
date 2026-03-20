import { useState, useEffect } from 'react';

interface ChartDataPoint {
  time: string;
  value: number;
}

export function useChart(contractId: string | null) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!contractId) return;

    let mounted = true;
    setLoading(true);

    fetch(`/api/chart?contractId=${encodeURIComponent(contractId)}`)
      .then((res) => res.json())
      .then((res) => {
        if (mounted && res.data) {
          setData(res.data);
        }
      })
      .catch((err) => console.error('fetch chart error', err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [contractId]);

  return { data, loading };
}
