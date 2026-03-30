'use client';

import { useTokens } from '@/hooks/useTokens';
import { useVote } from '@/hooks/useVote';
import { useState, useEffect, Suspense } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const COLORS = ['#c084fc', '#ec4899', '#ed49a9', '#60a5fa', '#c084fc', '#22d3ee', '#f97316', '#22d3a4'];

function DiscoverContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [search, setSearch] = useState(q);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  const { tokens, loading, refetch } = useTokens(search);
  const { vote, votedTokens, loadingToken, isConnected } = useVote();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">New Tokens</h1>
          <p className="text-muted-foreground text-sm">Live feed of tokens on the Stacks blockchain</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/5 text-green-500 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Updates
          </div>
          <button onClick={() => refetch()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-card transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tokens by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card pl-10 pr-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
          />
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-card transition-colors">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1">Total Listed</div>
          <div className="text-xl font-bold">{tokens.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1">Avg Market Cap</div>
          <div className="text-xl font-bold">
            {tokens.length > 0
              ? `$${(tokens.reduce((s, t) => s + t.marketCap, 0) / tokens.length / 1000).toFixed(1)}K`
              : '—'}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1">Top Gainer</div>
          <div className="text-xl font-bold text-green-500">
            {tokens.length > 0
              ? `+${Math.max(...tokens.map(t => t.priceChange24h)).toFixed(1)}%`
              : '—'}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1">Total Volume</div>
          <div className="text-xl font-bold">
            {tokens.length > 0
              ? `$${(tokens.reduce((s, t) => s + t.volume24h, 0) / 1_000_000).toFixed(1)}M`
              : '—'}
          </div>
        </div>
      </div>

      {/* Token Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#131316] border border-border animate-pulse h-64" />
          ))}
        </div>
      ) : tokens.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">No tokens found</p>
          <p className="text-sm mt-1">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((t, i) => {
            const color = COLORS[i % COLORS.length];
            const change = t.priceChange24h.toFixed(1);
            const isPos = t.priceChange24h >= 0;
            const holders = t.holders || 0;
            const mcap = t.marketCap > 1000 ? `$${(t.marketCap / 1000).toFixed(1)}K` : `$${t.marketCap.toFixed(0)}`;

            return (
              <Link
                key={t.contractId || i}
                href={`/token/${encodeURIComponent(t.contractId)}`}
                className="group p-5 rounded-2xl bg-[#131316] border border-border hover:border-border/80 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {t.imageUri ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.imageUri} alt={t.symbol} className="w-10 h-10 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: `${color}22`, color }}
                      >
                        {t.symbol?.substring(0, 2) || '??'}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">${t.symbol}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white ${isPos ? 'bg-pink-500' : 'bg-red-500'}`}>
                    {isPos ? '+' : ''}{change}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-0.5">Market Cap</div>
                    <div className="text-sm font-bold">{mcap}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-0.5">Holders</div>
                    <div className="text-sm font-bold">{holders.toLocaleString()}</div>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground font-mono truncate mb-3">
                  {t.contractId}
                </div>

                {/* Vote Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    vote(t.contractId, t.contractId);
                  }}
                  disabled={!isConnected || votedTokens.has(t.contractId) || loadingToken === t.contractId}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                    votedTokens.has(t.contractId)
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-default'
                      : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground active:scale-95'
                  } disabled:opacity-50`}
                >
                  {loadingToken === t.contractId ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : votedTokens.has(t.contractId) ? (
                    <>✓ Voted</>
                  ) : (
                    <>🔥 Vote</>
                  )}
                </button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Loading Discovery Data...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
