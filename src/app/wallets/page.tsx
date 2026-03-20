'use client';

import { useWallet } from '@/context/WalletContext';
import { Wallet, RefreshCw, Copy, ExternalLink } from 'lucide-react';

export default function WalletsPage() {
  const { address, isConnected, balances, stxBalance, connect } = useWallet();

  const fungibleTokens = balances?.fungibleTokens
    ? Object.entries(balances.fungibleTokens).map(([key, val]) => {
        const parts = key.split('::');
        const name = parts[1] || parts[0].split('.')[1] || key;
        return { name, balance: val.balance, key };
      }).filter(t => parseInt(t.balance) > 0)
    : [];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Wallet Management</h1>
          <p className="text-muted-foreground text-sm">Monitor balances and transactions across your wallets</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-card transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><Wallet className="w-3 h-3" /> Total Wallets</div>
          <div className="text-xl font-bold">{isConnected ? '1' : '0'}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
            STX Balance
            <span className="px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[9px] font-bold">Live</span>
          </div>
          <div className="text-xl font-bold">{isConnected ? `${stxBalance} STX` : '—'}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1">Total Tokens</div>
          <div className="text-xl font-bold">{fungibleTokens.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1">Last Update</div>
          <div className="text-xl font-bold">{isConnected ? 'Just now' : '—'}</div>
        </div>
      </div>

      {!isConnected ? (
        <div className="py-20 text-center">
          <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Wallet Connected</h2>
          <p className="text-muted-foreground mb-6">Connect your Stacks wallet to view balances and transactions</p>
          <button onClick={connect} className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-colors">
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          {/* Connected Wallet */}
          <div className="p-5 rounded-2xl bg-[#131316] border border-border">
            <h3 className="font-bold mb-4">Connected Wallet</h3>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold">Primary Wallet</div>
                <div className="text-xs text-muted-foreground font-mono truncate">{address}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">{stxBalance} STX</div>
                <div className="text-xs text-muted-foreground">{fungibleTokens.length} tokens</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => navigator.clipboard.writeText(address || '')} className="p-2 rounded-lg border border-border hover:bg-card transition-colors" title="Copy">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <a href={`https://explorer.stacks.co/address/${address}?chain=mainnet`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-border hover:bg-card transition-colors" title="View on Explorer">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Token Balances */}
          <div className="p-5 rounded-2xl bg-[#131316] border border-border">
            <h3 className="font-bold mb-4">Token Balances</h3>
            {fungibleTokens.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">No token balances found</p>
            ) : (
              <div className="space-y-2">
                {fungibleTokens.map((t) => (
                  <div key={t.key} className="flex items-center gap-3 p-3 rounded-xl hover:bg-card/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500 text-xs font-bold">
                      {t.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono truncate">{t.key}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{parseInt(t.balance).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
