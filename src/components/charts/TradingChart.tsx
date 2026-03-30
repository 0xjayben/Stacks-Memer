'use client';

import { useEffect, useRef, useState } from 'react';

interface DataPoint {
  time: string;   // YYYY-MM-DD
  value: number;
}

interface TradingChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  showGrid?: boolean;
}

export function TradingChart({ data, color = '#ec4899', height = 280, showGrid = true }: TradingChartProps) {
  const [range, setRange] = useState<'1W' | '1M' | 'ALL'>('1M');
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    let cancelled = false;
    
    // Filter data based on selected range
    const now = new Date();
    const filteredData = data.filter(d => {
      const dDate = new Date(d.time);
      if (range === '1W') return (now.getTime() - dDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
      if (range === '1M') return (now.getTime() - dDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
      return true;
    });

    if (filteredData.length === 0) return;

    import('lightweight-charts').then((mod) => {
      if (cancelled || !containerRef.current) return;

      // Destroy previous chart
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
          vertLines: { color: showGrid ? 'rgba(255,255,255,0.04)' : 'transparent' },
          horzLines: { color: showGrid ? 'rgba(255,255,255,0.04)' : 'transparent' },
        },
        crosshair: {
          mode: mod.CrosshairMode.Normal,
          vertLine: { color: 'rgba(255,255,255,0.15)', style: mod.LineStyle.Dashed, width: 1 },
          horzLine: { color: 'rgba(255,255,255,0.15)', style: mod.LineStyle.Dashed, width: 1 },
        },
        rightPriceScale: {
          borderColor: 'rgba(255,255,255,0.08)',
        },
        timeScale: {
          borderColor: 'rgba(255,255,255,0.08)',
          timeVisible: true,
        },
        handleScroll: { vertTouchDrag: false },
      });

      // v5 API: use addSeries with AreaSeries
      const series = chart.addSeries(mod.AreaSeries, {
        lineColor: color,
        topColor: `${color}33`,
        bottomColor: `${color}00`,
        lineWidth: 2,
        priceFormat: { type: 'price' as const, precision: 4, minMove: 0.0001 },
      });

      const formatted = filteredData.map((d) => ({
        time: d.time as any,
        value: d.value,
      }));

      series.setData(formatted);
      chart.timeScale().fitContent();
      chartRef.current = chart;

      // Resize observer
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
  }, [data, color, height, showGrid, range]);

  return (
    <div className="relative w-full">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {['1W', '1M', 'ALL'].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r as any)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              range === r 
                ? 'bg-white/10 text-white' 
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {r}
          </button>
        ))}
      </div>
      <div ref={containerRef} className="w-full" style={{ height }} />
    </div>
  );
}

// Generate mock price history data for demonstration
export function generateMockPriceData(days = 30, basePrice = 0.04): DataPoint[] {
  const data: DataPoint[] = [];
  let price = basePrice;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    price *= 1 + (Math.random() - 0.45) * 0.1;
    data.push({
      time: date.toISOString().split('T')[0],
      value: parseFloat(price.toFixed(6)),
    });
  }
  return data;
}
