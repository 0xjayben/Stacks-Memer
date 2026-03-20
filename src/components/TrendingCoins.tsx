'use client';

import { useTrending } from '@/hooks/useTrending';
import { TrendingUp } from 'lucide-react';

const COLORS = ['#22d3ee', '#ec4899', '#c084fc', '#60a5fa', '#22d3a4', '#f97316', '#6366f1', '#facc15', '#f43f5e', '#14b8a6'];

export function TrendingCoins() {
  const { trending, loading } = useTrending();

  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-[#131316] border border-border animate-pulse">
        <div className="h-6 w-40 bg-card rounded mb-6" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-card rounded-xl mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-[#131316] border border-border">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-pink-500" />
          <h3 className="font-bold text-foreground">Trending Coins</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
          Live Data
        </span>
      </div>

      <div className="space-y-1">
        {trending.slice(0, 8).map((t, i) => (
          <div
            key={t.contractId || i}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-card/80 transition-colors cursor-pointer group"
          >
            <span className="text-xs font-bold text-muted-foreground w-6">#{i + 1}</span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 border-transparent"
              style={{
                background: `${COLORS[i % COLORS.length]}22`,
                color: COLORS[i % COLORS.length],
                borderImage: 'linear-gradient(135deg, #ed49a9, #c084fc, #60a5fa) 1',
                borderImageSlice: 1,
                borderRadius: '50%',
              }}
            >
              {t.symbol?.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-foreground truncate">{t.symbol}</div>
              <div className="text-xs text-muted-foreground truncate">{t.name}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-foreground">${t.price.toFixed(4)}</div>
              <div className={`text-xs font-semibold ${t.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {t.priceChange24h >= 0 ? '▲' : '▼'} {Math.abs(t.priceChange24h).toFixed(1)}%
              </div>
            </div>
            <div className="text-xs text-muted-foreground hidden lg:block w-16 text-right">
              ${(t.volume24h / 1000).toFixed(0)}K
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
