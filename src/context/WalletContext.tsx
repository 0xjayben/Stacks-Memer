'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { fetchAddressBalances, type WalletBalance } from '@/lib/api';
import { signAndBroadcast, type ContractCallOptions } from '@/lib/stacks-transactions';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

interface PendingTx {
  txId: string;
  status: 'pending' | 'success' | 'failed';
  functionName: string;
}

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  balances: WalletBalance | null;
  stxBalance: string;
  pendingTx: PendingTx | null;
  connect: () => void;
  disconnect: () => void;
  signContractCall: (options: ContractCallOptions) => Promise<string | null>;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  balances: null,
  stxBalance: '0',
  pendingTx: null,
  connect: () => {},
  disconnect: () => {},
  signContractCall: async () => null,
});

// Use robust client-side module initialization
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<WalletBalance | null>(null);
  const [pendingTx, setPendingTx] = useState<PendingTx | null>(null);

  // Load User Data properly on mount
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setAddress(userData.profile?.stxAddress?.mainnet || null);
    }
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
    try {
      showConnect({
        appDetails: {
          name: 'Stacks Memer',
          icon: typeof window !== 'undefined' ? window.location.origin + '/logo.svg' : '',
        },
        redirectTo: '/',
        userSession,
        onFinish: () => {
          console.log('Wallet Context: Auth Finished Successfully');
          const userData = userSession.loadUserData();
          setAddress(userData.profile?.stxAddress?.mainnet || null);
        },
        onCancel: () => {
          console.log('Wallet Context: User natively cancelled the prompt.');
        }
      });
    } catch (err) {
      console.error('Wallet connection fatal exception: ', err);
    }
  }, []);

  const disconnect = useCallback(() => {
    userSession.signUserOut();
    setAddress(null);
    setBalances(null);
    setPendingTx(null);
  }, []);

  // Sign and broadcast a contract call via the wallet popup
  const signContractCall = useCallback(async (options: ContractCallOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      setPendingTx({ txId: '', status: 'pending', functionName: options.functionName });

      signAndBroadcast({
        ...options,
        onFinish: (data) => {
          setPendingTx({ txId: data.txId, status: 'success', functionName: options.functionName });
          // Auto-clear after 10 seconds
          setTimeout(() => setPendingTx(null), 10_000);
          resolve(data.txId);
        },
        onCancel: () => {
          setPendingTx(null);
          resolve(null);
        },
      }).catch((err) => {
        console.error('signContractCall error:', err);
        setPendingTx({ txId: '', status: 'failed', functionName: options.functionName });
        setTimeout(() => setPendingTx(null), 5_000);
        resolve(null);
      });
    });
  }, []);

  const stxBalance = balances
    ? (parseInt(balances.stx.balance) / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : '0';

  return (
    <WalletContext.Provider value={{
      address,
      isConnected: !!address,
      balances,
      stxBalance,
      pendingTx,
      connect,
      disconnect,
      signContractCall,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
