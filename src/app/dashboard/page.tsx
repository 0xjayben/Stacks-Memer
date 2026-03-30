'use client';

import { DollarSign, TrendingUp, Users, CheckCircle2, ArrowUpRight, ArrowDownRight, Plus, Wallet } from 'lucide-react';
import { TradingChart } from '@/components/charts/TradingChart';
import { TrendingCoins } from '@/components/TrendingCoins';
import { useActivity } from '@/hooks/useActivity';
import { useTrending } from '@/hooks/useTrending';
import { useChart } from '@/hooks/useChart';

const ICON_MAP: Record<string, React.ElementType> = {
  buy: ArrowUpRight,
  sell: ArrowDownRight,
  'new-token': Plus,
  wallet: Wallet,
};

const TYPE_STYLES: Record<string, { bg: string; border: string; iconColor: string }> = {
  buy: { bg: 'bg-green-500/5', border: 'border-green-500/20', iconColor: 'text-green-500' },
  sell: { bg: 'bg-red-500/5', border: 'border-red-500/20', iconColor: 'text-red-500' },
  'new-token': { bg: 'bg-blue-500/5', border: 'border-blue-500/20', iconColor: 'text-blue-500' },
  wallet: { bg: 'bg-purple-500/5', border: 'border-purple-500/20', iconColor: 'text-purple-500' },
};

export default function Dashboard() {
  const { activity, loading: actLoading } = useActivity();
  const { trending, loading: trendLoading } = useTrending();

  const topToken = trending.length > 0 ? trending[0] : null;
  const { data: chartData, loading: chartLoading } = useChart(topToken?.contractId || null);

  const stats = [
    { title: 'Trending Tokens', value: trending.length ? `${trending.length}` : '...', change: '', icon: TrendingUp, iconColor: 'text-pink-500' },
    { title: 'Total Volume', value: trending.length ? `$${(trending.reduce((s, t) => s + t.volume24h, 0) / 1_000_000).toFixed(1)}M` : '...', change: '', icon: DollarSign, iconColor: 'text-cyan-500' },
    { title: 'Active Holders', value: trending.length ? `${(trending.reduce((s, t) => s + t.holders, 0) / 1000).toFixed(1)}K` : '...', change: '', icon: Users, iconColor: 'text-green-500' },
    { title: 'Top Gainer', value: trending.length ? `+${Math.max(...trending.map(t => t.priceChange24h)).toFixed(1)}%` : '...', change: '', icon: CheckCircle2, iconColor: 'text-green-500', isPill: true },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Real-time overview of the Stacks Memer ecosystem</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="p-5 rounded-2xl bg-[#131316] border border-border hover:border-border/80 transition-all">
              <div className="flex items-center gap-2 mb-3">
                {stat.isPill ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[11px] font-bold">
                    {stat.title}
                  </div>
                ) : (
                  <>
                    <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                    <h3 className="font-medium text-muted-foreground text-xs">{stat.title}</h3>
                  </>
                )}
              </div>
              <div className="text-3xl font-bold mb-1 text-foreground">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* TradingView Chart Row entirely focused on the top trending item seamlessly */}
      <div className="w-full">
        <div className="p-5 rounded-2xl bg-[#131316] border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">
              {topToken ? `Performance: ${topToken.name} (${topToken.symbol})` : 'Top Trending Performance'}
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-500 font-bold uppercase">Live DEX Data</span>
            </div>
          </div>
          {chartLoading || !chartData.length ? (
            <div className="h-[260px] w-full flex items-center justify-center text-muted-foreground animate-pulse text-sm">
              Loading chart data from Velar Protocol...
            </div>
          ) : (
            <TradingChart data={chartData} color="#ec4899" height={260} />
          )}
        </div>
      </div>

      {/* Bottom Row: Activity + Trending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Live Activity */}
        <div className="p-5 rounded-2xl bg-[#131316] border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground">Live Activity</h2>
            <span className="text-[10px] font-medium border border-border bg-background px-2.5 py-0.5 rounded-full text-muted-foreground">
              Updates every 10s
            </span>
          </div>
          <div className="space-y-2">
            {actLoading ? (
              [...Array(4)].map((_, i) => <div key={i} className="h-16 bg-card rounded-xl animate-pulse" />)
            ) : activity.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No recent activity</p>
            ) : (
              activity.slice(0, 6).map((item, i) => {
                const Icon = ICON_MAP[item.type] || Wallet;
                const style = TYPE_STYLES[item.type] || TYPE_STYLES.wallet;
                return (
                  <div key={i} className={`p-3.5 rounded-xl ${style.bg} border ${style.border}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Icon className={`w-4 h-4 mt-0.5 ${style.iconColor}`} />
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                          {item.amount && (
                            <p className={`font-mono text-sm font-medium mt-0.5 ${item.type === 'sell' ? 'text-red-500' : 'text-green-500'}`}>
                              {item.amount}
                            </p>
                          )}
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{item.address}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0">{item.time}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Trending Coins */}
        <TrendingCoins />
      </div>
    </div>
  );
}
