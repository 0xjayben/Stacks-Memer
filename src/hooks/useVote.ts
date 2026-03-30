'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@/context/WalletContext';

/**
 * Hook to handle voting on a token.
 * Tracks loading state and per-token "already voted" status.
 */
export function useVote() {
  const { address, isConnected } = useWallet();
  const [votedTokens, setVotedTokens] = useState<Set<string>>(new Set());
  const [loadingToken, setLoadingToken] = useState<string | null>(null);

  const vote = useCallback(async (tokenId: string, contractId: string) => {
    if (!isConnected || !address) {
      alert('Please connect your wallet to vote.');
      return false;
    }

    if (votedTokens.has(tokenId)) {
      return false; // already voted
    }

    setLoadingToken(tokenId);
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId,
          walletAddress: address,
          contractId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'Already voted') {
          setVotedTokens(prev => new Set(prev).add(tokenId));
        } else {
          alert(data.error || 'Vote failed');
        }
        return false;
      }

      setVotedTokens(prev => new Set(prev).add(tokenId));
      return true;
    } catch (err) {
      console.error('Vote error:', err);
      alert('Failed to submit vote. Try again.');
      return false;
    } finally {
      setLoadingToken(null);
    }
  }, [address, isConnected, votedTokens]);

  return {
    vote,
    votedTokens,
    loadingToken,
    isConnected,
  };
}
