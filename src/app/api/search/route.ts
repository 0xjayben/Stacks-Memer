import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchVelarTokens } from '@/lib/api';

/**
 * GET /api/search?q=query
 * Server-side search combining Supabase basic search with Velar token data.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    // 1. Search Supabase for exact or partial matches
    // Using simple ILIKE for MVP. In prod, you'd use Postgres Full Text Search
    const { data: dbData } = await (supabase
      .from('tokens') as any)
      .select('contract_address, name, symbol, logo_url')
      .or(`name.ilike.%${query}%,symbol.ilike.%${query}%`)
      .limit(10);

    // 2. We can also cross-reference Velar tokens for price/volume
    const velarTokens = await fetchVelarTokens();
    
    // Map db results to include market data where available
    const results = (dbData || []).map((dbToken: any) => {
      const marketData = velarTokens.find(t => t.contractId === dbToken.contract_address);
      return {
        contractId: dbToken.contract_address,
        name: dbToken.name,
        symbol: dbToken.symbol,
        imageUri: dbToken.logo_url,
        price: marketData?.price || 0,
        volume24h: marketData?.volume24h || 0,
        priceChange24h: marketData?.priceChange24h || 0,
        isDatabaseMatch: true
      };
    });

    // We could additionally search purely velar tokens that aren't in Supabase yet,
    // but the spec says Stacksmemer launches live on Supabase first.
    return NextResponse.json({ results });

  } catch (error) {
    console.error('API Error: /api/search', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
