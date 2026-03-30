'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface RealtimeCallbacks {
  onTokenAdded?: (token: any) => void;
  onVoteAdded?: (vote: any) => void;
}

/**
 * Global hook to listen to Supabase Realtime changes on tokens and votes.
 * Pass in callbacks to merge live data into your local state.
 */
export function useRealtime({ onTokenAdded, onVoteAdded }: RealtimeCallbacks) {
  useEffect(() => {
    // Subscribe to new tokens
    const tokensChannel = supabase
      .channel('public:tokens')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tokens' },
        (payload) => {
          console.log('Realtime token insertion:', payload.new);
          if (onTokenAdded) onTokenAdded(payload.new);
        }
      )
      // Listen to vote count updates directly on the token record
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tokens' },
        (payload) => {
          // This allows us to catch `votes_count` increments from the RPC
          if (onVoteAdded) onVoteAdded(payload.new);
        }
      )
      .subscribe();

    // Subscribe to new votes
    const votesChannel = supabase
      .channel('public:votes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'votes' },
        (payload) => {
          console.log('Realtime vote insertion:', payload.new);
          // If we want raw vote records, though usually watching tokens.votes_count UPDATE is cleaner
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tokensChannel);
      supabase.removeChannel(votesChannel);
    };
  }, [onTokenAdded, onVoteAdded]);
}
