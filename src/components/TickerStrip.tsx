'use client';

import { useTrending } from '@/hooks/useTrending';

export function TickerStrip() {
  const { trending } = useTrending();

  if (trending.length === 0) return null;

  const chips = trending.map((t, i) => (
    <span key={i} className="inline-flex items-center gap-2 px-4 py-1 whitespace-nowrap">
      <span className="font-bold text-foreground text-xs">{t.symbol}</span>
      <span className="text-muted-foreground text-xs">${t.price.toFixed(4)}</span>
      <span className={`text-xs font-semibold ${t.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {t.priceChange24h >= 0 ? '▲' : '▼'} {Math.abs(t.priceChange24h).toFixed(1)}%
      </span>
    </span>
  ));

  return (
    <div className="w-full border-b border-border bg-card/50 overflow-hidden">
      <div className="flex items-center h-9">
        <div className="shrink-0 flex items-center gap-1.5 px-3 border-r border-border h-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-green-500 uppercase tracking-wider">Live</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex animate-ticker-scroll">
            {chips}
            {chips} {/* duplicate for seamless loop */}
          </div>
        </div>
      </div>
    </div>
  );
}
