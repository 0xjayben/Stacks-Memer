'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { fetchAddressBalances, type WalletBalance } from '@/lib/api';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  balances: WalletBalance | null;
  stxBalance: string;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  balances: null,
  stxBalance: '0',
  connect: () => {},
  disconnect: () => {},
});

// Dynamically import @stacks/connect ONLY on client side to avoid SSR crashes
async function getStacksModule() {
  const mod = await import('@stacks/connect');
  const appConfig = new mod.AppConfig(['store_write', 'publish_data']);
  const userSession = new mod.UserSession({ appConfig });
  return { mod, appConfig, userSession };
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<WalletBalance | null>(null);
  const [stacksReady, setStacksReady] = useState(false);
  const [userSessionRef, setUserSessionRef] = useState<any>(null);

  // Load Stacks module on client mount
  useEffect(() => {
    getStacksModule().then(({ userSession }) => {
      setUserSessionRef(userSession);
      setStacksReady(true);
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        setAddress(userData.profile.stxAddress.mainnet);
      }
    });
  }, []);

  // Fetch balances when address changes
  useEffect(() => {
    if (!address) {
      setBalances(null);
      return;
    }
    fetchAddressBalances(address).then(setBalances);
    const interval = setInterval(() => {
      fetchAddressBalances(address).then(setBalances);
    }, 30_000);
    return () => clearInterval(interval);
  }, [address]);

  const connect = useCallback(() => {
    if (!stacksReady) return;
    getStacksModule().then(({ mod, userSession }) => {
      mod.showConnect({
        appDetails: {
          name: 'Stacks Memer',
          icon: typeof window !== 'undefined' ? window.location.origin + '/logo.svg' : '',
        },
        redirectTo: '/',
        onFinish: () => {
          const userData = userSession.loadUserData();
          setAddress(userData.profile.stxAddress.mainnet);
        },
        userSession,
      });
    });
  }, [stacksReady]);

  const disconnect = useCallback(() => {
    if (userSessionRef) {
      userSessionRef.signUserOut();
    }
    setAddress(null);
    setBalances(null);
  }, [userSessionRef]);

  const stxBalance = balances
    ? (parseInt(balances.stx.balance) / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : '0';

  return (
    <WalletContext.Provider value={{ address, isConnected: !!address, balances, stxBalance, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
