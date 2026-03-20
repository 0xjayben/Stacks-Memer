import { NextResponse } from 'next/server';
import { fetchVelarTokens } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  let tokens = await fetchVelarTokens();

  if (search) {
    const q = search.toLowerCase();
    tokens = tokens.filter(
      (t) => t.name.toLowerCase().includes(q) || t.symbol.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ tokens, total: tokens.length });
}
