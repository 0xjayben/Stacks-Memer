'use client';

import { TradingChart } from '@/components/charts/TradingChart';
import { useChart } from '@/hooks/useChart';
import { useTokens } from '@/hooks/useTokens';
import { use } from 'react';
import { ArrowLeft, ExternalLink, Copy } from 'lucide-react';
import Link from 'next/link';

export default function TokenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const contractId = decodeURIComponent(id);
  const parts = contractId.split('.');
  
  const { tokens } = useTokens();
  const token = tokens.find(t => t.contractId === contractId);
  const { data: chartData, loading: chartLoading } = useChart(contractId);

  const name = token?.name || parts[1] || contractId;
  const sym = token?.symbol?.substring(0, 4).toUpperCase() || '???';

  const price = token ? token.price.toFixed(6) : '0.000000';
  const change = token ? token.priceChange24h.toFixed(2) : '0.00';
  const isPos = parseFloat(change) >= 0;
  
  const volume = token ? `$${(token.volume24h).toLocaleString()}` : '$0';
  const mcap = token ? `$${(token.marketCap).toLocaleString()}` : '$0';
  const holders = token?.holders || 0;
  const supply = token?.totalSupply || '0';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/discover" className="p-2 rounded-lg border border-border hover:bg-card transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          {token?.imageUri ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={token.imageUri} alt={sym} className="w-10 h-10 rounded-full bg-card" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
          ) : (
            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 font-bold text-sm">
              {sym.substring(0, 2)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-xs text-muted-foreground font-mono">{contractId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigator.clipboard.writeText(contractId)}
            className="p-2 rounded-lg border border-border hover:bg-card transition-colors"
            title="Copy contract address"
          >
            <Copy className="w-4 h-4" />
          </button>
          <a
            href={`https://explorer.stacks.co/txid/${contractId}?chain=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-border hover:bg-card transition-colors"
            title="View on Explorer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Price Header */}
      <div className="p-5 rounded-2xl bg-[#131316] border border-border">
        <div className="flex items-end gap-4 mb-1">
          <span className="text-4xl font-bold">${price}</span>
          <span className={`text-lg font-bold ${isPos ? 'text-green-500' : 'text-red-500'}`}>
            {isPos ? '▲' : '▼'} {Math.abs(parseFloat(change))}%
          </span>
        </div>
        <div className="text-xs text-muted-foreground">24h change • Live Velar DEX Pricing</div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1">Volume 24h</div>
          <div className="text-lg font-bold">{volume}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1">Market Cap</div>
          <div className="text-lg font-bold">{mcap}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1">Holders</div>
          <div className="text-lg font-bold">{holders.toLocaleString()}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1">Total Supply</div>
          <div className="text-lg font-bold">{supply}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#131316] border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Price Chart</h3>
            <div className="flex gap-1">
              <span className="text-[10px] text-green-500 font-bold uppercase py-1 px-2 border border-green-500/20 bg-green-500/5 rounded-full animate-pulse">
                Velar Network
              </span>
            </div>
          </div>
          {chartLoading || !chartData.length ? (
            <div className="flex items-center justify-center w-full h-[350px] text-muted-foreground animate-pulse text-sm">
              Loading chart data...
            </div>
          ) : (
            <TradingChart data={chartData} color="#ec4899" height={350} />
          )}
        </div>

        {/* Buy/Sell Panel */}
        <div className="p-5 rounded-2xl bg-[#131316] border border-border space-y-4">
          <h3 className="font-bold">Trade {sym}</h3>
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded-lg bg-green-500/10 text-green-500 font-bold text-sm border border-green-500/20 hover:bg-green-500/20 transition-colors">
              Buy
            </button>
            <button className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-500 font-bold text-sm border border-red-500/20 hover:bg-red-500/20 transition-colors">
              Sell
            </button>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Amount (STX)</label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full bg-card px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['25%', '50%', '75%', 'Max'].map((pct) => (
              <button key={pct} className="py-1.5 rounded-md text-[11px] font-bold border border-border hover:bg-card transition-colors">
                {pct}
              </button>
            ))}
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between"><span>Price</span><span className="text-foreground">${price}</span></div>
            <div className="flex justify-between"><span>Slippage</span><span className="text-foreground">1.0%</span></div>
            <div className="flex justify-between"><span>Est. Received</span><span className="text-foreground">0 {sym}</span></div>
          </div>
          <button className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm transition-colors">
            Connect Wallet to Trade
          </button>

          {/* Token Info */}
          <div className="pt-4 border-t border-border space-y-2">
            <h4 className="font-bold text-sm">Token Info</h4>
            <div className="text-xs space-y-1.5">
              <div className="flex justify-between"><span className="text-muted-foreground">Contract</span><span className="font-mono text-foreground truncate max-w-[150px]">{parts[0]?.substring(0, 8)}...{parts[1]}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Decimals</span><span>6</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Network</span><span className="text-green-500">Stacks Mainnet</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
