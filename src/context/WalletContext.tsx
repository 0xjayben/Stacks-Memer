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

let cachedMod: any = null;
let cachedSession: any = null;

async function getStacksModule() {
  if (cachedMod && cachedSession) {
    return { mod: cachedMod, userSession: cachedSession };
  }
  const mod = await import('@stacks/connect');
  const appConfig = new mod.AppConfig(['store_write', 'publish_data']);
  const userSession = new mod.UserSession({ appConfig });
  cachedMod = mod;
  cachedSession = userSession;
  return { mod, appConfig, userSession };
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<WalletBalance | null>(null);

  // Load Stacks module on client mount
  useEffect(() => {
    getStacksModule().then(({ userSession }) => {
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        setAddress(userData.profile?.stxAddress?.mainnet || null);
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
    getStacksModule().then(({ mod, userSession }) => {
      const authenticateFn = mod.showConnect || mod.authenticate || mod.default?.authenticate;
      console.log('Wallet Auth Firing: ', typeof authenticateFn);
      try {
        authenticateFn({
          appDetails: {
            name: 'Stacks Memer',
            icon: typeof window !== 'undefined' ? window.location.origin + '/logo.svg' : '',
          },
          redirectTo: '/',
          userSession,
          onFinish: () => {
             console.log('Auth Finished Success');
            const userData = userSession.loadUserData();
            setAddress(userData.profile?.stxAddress?.mainnet || null);
          },
          onCancel: () => {
             console.log('User natively cancelled the prompt.');
          }
        });
      } catch (err) {
        console.error('Wallet connection fatal exception: ', err);
      }
    });
  }, []);

  const disconnect = useCallback(() => {
    getStacksModule().then(({ userSession }) => {
      userSession.signUserOut();
      setAddress(null);
      setBalances(null);
    });
  }, []);

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
