import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTokenVotesOnChain } from '@/lib/contracts';

/**
 * POST /api/vote
 * Body: { tokenId: 'uuid', contractId: 'SP...token', walletAddress: 'SP...voter' }
 * 
 * Verifies the vote both off-chain (Supabase) and prepares the front-end to
 * execute the on-chain (Clarity) transaction. We store the intent to vote here,
 * then the client signs the tx. Once the tx confirms, the on-chain vote 
 * takes precedence.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tokenId, contractId, walletAddress } = body;

    if (!tokenId || !contractId || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Check if the user already voted off-chain (fast-path protection)
    const { data: existingVote } = await (supabase
      .from('votes') as any)
      .select('id')
      .eq('token_id', tokenId)
      .eq('wallet_address', walletAddress)
      .single();

    if (existingVote) {
      return NextResponse.json({ error: 'Already voted for this token' }, { status: 400 });
    }

    // 2. Fetch current on-chain vote count so we can verify later
    // In a prod app, we might also check if the wallet already voted on-chain right now
    const onChainVotesCount = await getTokenVotesOnChain(contractId);

    // 3. Register the off-chain vote immediately for responsive UI
    const { error: insertError } = await (supabase
      .from('votes') as any)
      .insert({
        token_id: String(tokenId),
        wallet_address: String(walletAddress),
      });

    if (insertError) {
      // Postgres unique constraint violation usually means double vote race condition
      if (insertError.code === '23505') {
         return NextResponse.json({ error: 'Already voted for this token' }, { status: 400 });
      }
      throw insertError;
    }

    // 4. Update the cached token vote count
    await (supabase.rpc as any)('increment_token_votes', { row_id: tokenId });

    // Respond with success and current on-chain state
    return NextResponse.json({
      success: true,
      message: 'Off-chain vote registered',
      onChainVotesCount,
    });
  } catch (error: any) {
    console.error('Vote API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
