'use client';

import { WalletIcon, LogOut } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

export function WalletConnect() {
  const { address, isConnected, stxBalance, connect, disconnect } = useWallet();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 bg-card border border-border rounded-xl text-xs text-muted-foreground flex items-center gap-2">
          <span className="font-mono">{address.substring(0, 4)}...{address.substring(address.length - 4)}</span>
          <span className="text-foreground font-bold">{stxBalance} STX</span>
        </div>
        <button
          onClick={disconnect}
          className="p-2.5 rounded-xl border border-border text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all"
          title="Disconnect Wallet"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all"
    >
      <WalletIcon className="w-4 h-4" />
      Connect Wallet
    </button>
  );
}
