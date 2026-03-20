'use client';

import { WalletProvider } from '@/context/WalletContext';

export function WalletProviderWrapper({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
