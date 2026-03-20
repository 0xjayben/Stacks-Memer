'use client';

import { useEffect, useRef } from 'react';

interface VolumePoint {
  time: string;
  value: number;
  color?: string;
}

interface VolumeChartProps {
  data: VolumePoint[];
  height?: number;
}

export function VolumeChart({ data, height = 120 }: VolumeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    let cancelled = false;

    import('lightweight-charts').then((mod) => {
      if (cancelled || !containerRef.current) return;

      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }

      const chart = mod.createChart(containerRef.current!, {
        width: containerRef.current!.clientWidth,
        height,
        layout: {
          background: { type: mod.ColorType.Solid, color: 'transparent' },
          textColor: '#71717a',
          fontSize: 11,
          fontFamily: "'Inter', system-ui, sans-serif",
        },
        grid: {
          vertLines: { color: 'transparent' },
          horzLines: { color: 'rgba(255,255,255,0.04)' },
        },
        rightPriceScale: { borderColor: 'rgba(255,255,255,0.08)' },
        timeScale: { borderColor: 'rgba(255,255,255,0.08)' },
        handleScroll: { vertTouchDrag: false },
      });

      // v5 API: use addSeries with HistogramSeries
      const series = chart.addSeries(mod.HistogramSeries, {
        color: '#c084fc',
        priceFormat: { type: 'volume' as const },
      });

      series.setData(
        data.map((d) => ({
          time: d.time as any,
          value: d.value,
          color: d.color || 'rgba(192,132,252,0.6)',
        }))
      );

      chart.timeScale().fitContent();
      chartRef.current = chart;

      const observer = new ResizeObserver(() => {
        if (containerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
        }
      });
      observer.observe(containerRef.current!);

      return () => observer.disconnect();
    });

    return () => {
      cancelled = true;
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, height]);

  return <div ref={containerRef} className="w-full" style={{ height }} />;
}

export function generateMockVolumeData(days = 30): VolumePoint[] {
  const data: VolumePoint[] = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      time: date.toISOString().split('T')[0],
      value: Math.floor(100_000 + Math.random() * 2_000_000),
    });
  }
  return data;
}
