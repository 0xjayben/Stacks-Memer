'use client';

import { TradingChart } from '@/components/charts/TradingChart';
import { useTrending } from '@/hooks/useTrending';
import { useChart } from '@/hooks/useChart';
import { TrendingUp, DollarSign, Users, CheckCircle2, Download } from 'lucide-react';

const COLORS = ['#22d3ee', '#ec4899', '#c084fc', '#60a5fa', '#22d3a4'];

export default function AnalyticsPage() {
  const { trending, loading } = useTrending();
  const topToken = trending.length > 0 ? trending[0] : null;
  const { data: chartData, loading: chartLoading } = useChart(topToken?.contractId || null);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Analytics</h1>
          <p className="text-muted-foreground text-sm">Deep insights and trends across the Stacks Memer ecosystem</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-card transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export Data
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, color: 'text-pink-500', label: 'Trending Tokens', value: `${trending.length || '...'}`, sub: '' },
          { icon: DollarSign, color: 'text-cyan-500', label: 'Total Volume', value: trending.length ? `$${(trending.reduce((s,t)=>s+t.volume24h,0)/1e6).toFixed(1)}M` : '...', sub: '' },
          { icon: Users, color: 'text-green-500', label: 'Active Holders', value: trending.length ? `${(trending.reduce((s,t)=>s+t.holders,0)/1000).toFixed(1)}K` : '...', sub: '' },
          { icon: CheckCircle2, color: 'text-green-500', label: 'Top Gainer', value: trending.length ? `+${Math.max(...trending.map(t => t.priceChange24h)).toFixed(1)}%` : '...', sub: '', isPill: true },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="p-5 rounded-2xl bg-[#131316] border border-border">
              <div className="flex items-center gap-2 mb-3">
                {s.isPill ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[11px] font-bold">{s.label}</span>
                ) : (
                  <><Icon className={`w-4 h-4 ${s.color}`} /><span className="text-xs text-muted-foreground">{s.label}</span></>
                )}
              </div>
              <div className="text-3xl font-bold mb-1">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4">
        <div className="p-5 rounded-2xl bg-[#131316] border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">
              {topToken ? `Top Performance: ${topToken.name}` : 'Top Trending Tokens Performance'}
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-500 font-bold uppercase">Live Velar DEX</span>
            </div>
          </div>
          {chartLoading || !chartData.length ? (
            <div className="h-[220px] w-full flex items-center justify-center text-muted-foreground text-sm animate-pulse">
              Syncing Chart Data...
            </div>
          ) : (
            <TradingChart data={chartData} color="#ec4899" height={220} />
          )}
        </div>
      </div>

      {/* Trending Table */}
      <div className="p-5 rounded-2xl bg-[#131316] border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Top Trending Tokens</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 bg-green-500/10 px-3 py-1 rounded-full">Live Data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left py-3 px-3">Rank</th>
                <th className="text-left py-3 px-3">Token</th>
                <th className="text-left py-3 px-3">Volume 24h</th>
                <th className="text-left py-3 px-3">Holders</th>
                <th className="text-left py-3 px-3">Price Δ</th>
                <th className="text-left py-3 px-3">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="py-4"><div className="h-8 bg-card rounded animate-pulse" /></td></tr>
                ))
              ) : (
                trending.slice(0, 10).map((t, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                    <td className="py-3 px-3 text-muted-foreground font-bold">#{i + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {t.imageUri ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.imageUri} alt={t.symbol} className="w-7 h-7 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                        ) : (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{ background: `${COLORS[i%COLORS.length]}22`, color: COLORS[i%COLORS.length] }}>
                            {t.symbol?.substring(0, 2)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-foreground">{t.symbol}</div>
                          <div className="text-[10px] text-muted-foreground">{t.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">${(t.volume24h/1000).toFixed(1)}K</td>
                    <td className="py-3 px-3">{t.holders.toLocaleString()}</td>
                    <td className={`py-3 px-3 font-bold ${t.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {t.priceChange24h >= 0 ? '+' : ''}{t.priceChange24h.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3">${(t.marketCap/1000).toFixed(0)}K</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#131316] border border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Market Sentiment</h4>
            <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full border border-border">Coming Soon</span>
          </div>
          <p className="text-sm text-muted-foreground">Sentiment analysis will be available once sufficient voting data has been collected.</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#131316] border border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Top Categories</h4>
            <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full border border-border">Coming Soon</span>
          </div>
          <p className="text-sm text-muted-foreground">Category breakdown will be enabled as tokens are tagged and classified by the community.</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#131316] border border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Performance Metrics</h4>
            <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full border border-border">Coming Soon</span>
          </div>
          <p className="text-sm text-muted-foreground">Detailed performance metrics will be computed from historical trading and voting activity.</p>
        </div>
      </div>
    </div>
  );
}
