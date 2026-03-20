/* ═══════════════════════════════════════════
   Hiro Stacks API Client
   Fetches real blockchain data from mainnet
═══════════════════════════════════════════ */

const HIRO_API = 'https://api.hiro.so';

export interface StacksToken {
  name: string;
  symbol: string;
  contractId: string;
  decimals: number;
  totalSupply: string;
  imageUri?: string;
}

export interface TokenWithPrice extends StacksToken {
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  holders: number;
}

export interface ActivityItem {
  type: 'buy' | 'sell' | 'new-token' | 'wallet';
  title: string;
  amount?: string;
  address: string;
  time: string;
  txId: string;
}

export interface WalletBalance {
  stx: { balance: string; locked: string };
  fungibleTokens: Record<string, { balance: string; totalSent: string; totalReceived: string }>;
}

// ─── Fetch fungible tokens from Hiro API ─────────────────────────────────────
export async function fetchTokens(limit = 50, offset = 0): Promise<StacksToken[]> {
  try {
    const res = await fetch(
      `${HIRO_API}/metadata/v1/ft?limit=${limit}&offset=${offset}`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) throw new Error(`Hiro API error: ${res.status}`);
    const data = await res.json();
    return (data.results || []).map((t: any) => ({
      name: t.name || 'Unknown',
      symbol: t.symbol || '???',
      contractId: t.contract_id || '',
      decimals: t.decimals || 0,
      totalSupply: t.total_supply || '0',
      imageUri: t.image_uri || t.image_url || undefined,
    }));
  } catch (err) {
    console.error('fetchTokens error:', err);
    return [];
  }
}

// ─── Fetch recent transactions ───────────────────────────────────────────────
export async function fetchRecentTransactions(limit = 20): Promise<any[]> {
  try {
    const res = await fetch(
      `${HIRO_API}/extended/v1/tx?limit=${limit}&type=contract_call,token_transfer`,
      { next: { revalidate: 10 } }
    );
    if (!res.ok) throw new Error(`Hiro API error: ${res.status}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('fetchRecentTransactions error:', err);
    return [];
  }
}

// ─── Fetch wallet balances ───────────────────────────────────────────────────
export async function fetchAddressBalances(address: string): Promise<WalletBalance | null> {
  try {
    const res = await fetch(
      `${HIRO_API}/extended/v1/address/${address}/balances`,
      { next: { revalidate: 15 } }
    );
    if (!res.ok) throw new Error(`Hiro API error: ${res.status}`);
    const data = await res.json();
    return {
      stx: {
        balance: data.stx?.balance || '0',
        locked: data.stx?.locked || '0',
      },
      fungibleTokens: data.fungible_tokens || {},
    };
  } catch (err) {
    console.error('fetchAddressBalances error:', err);
    return null;
  }
}

// ─── Fetch blockchain info ───────────────────────────────────────────────────
export async function fetchBlockInfo(): Promise<any> {
  try {
    const res = await fetch(`${HIRO_API}/v2/info`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`Hiro API error: ${res.status}`);
    return res.json();
  } catch (err) {
    console.error('fetchBlockInfo error:', err);
    return null;
  }
}

// ─── Transform transactions into activity items ─────────────────────────────
export function txToActivity(tx: any): ActivityItem {
  const age = timeSince(tx.burn_block_time_iso || tx.receipt_time_iso);
  const addr = tx.sender_address || '';
  const short = `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  if (tx.tx_type === 'token_transfer') {
    const amount = parseInt(tx.token_transfer?.amount || '0') / 1_000_000;
    return {
      type: amount > 0 ? 'buy' : 'sell',
      title: `Token transfer of ${amount.toFixed(2)} STX`,
      amount: `$${(amount * 1.5).toFixed(2)}`, // rough USD estimate
      address: short,
      time: age,
      txId: tx.tx_id,
    };
  }

  if (tx.tx_type === 'contract_call') {
    const fnName = tx.contract_call?.function_name || '';
    const contract = tx.contract_call?.contract_id?.split('.')[1] || 'contract';
    return {
      type: fnName.includes('sell') ? 'sell' : 'buy',
      title: `${fnName} on ${contract}`,
      address: short,
      time: age,
      txId: tx.tx_id,
    };
  }

  return {
    type: 'wallet',
    title: 'New transaction',
    address: short,
    time: age,
    txId: tx.tx_id,
  };
}

function timeSince(dateStr: string): string {
  if (!dateStr) return 'just now';
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ═══════════════════════════════════════════
//   Velar DEX API Client (Real Market Data)
// ═══════════════════════════════════════════

export interface VelarToken {
  symbol: string;
  name: string;
  contractAddress: string;
  imageUrl: string;
  price: string | null;
  percent_change_24h: string;
  decimal: string;
  stats: {
    tvl: number;
    volume: number;
  };
}

export async function fetchVelarTokens(): Promise<TokenWithPrice[]> {
  try {
    const res = await fetch('https://api.velar.co/tokens', { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`Velar API error: ${res.status}`);
    const data: VelarToken[] = await res.json();
    
    return data
      .filter((t) => t.price && parseFloat(t.price) > 0)
      .map((t) => ({
        name: t.name,
        symbol: t.symbol,
        contractId: t.contractAddress,
        decimals: t.decimal ? parseInt(String(t.decimal).replace(/[^0-9]/g, '')) || 6 : 6,
        totalSupply: '0', 
        imageUri: t.imageUrl,
        price: parseFloat(t.price || '0'),
        priceChange24h: parseFloat(t.percent_change_24h || '0'),
        volume24h: t.stats?.volume || 0,
        marketCap: t.stats?.tvl || 0, // Falling back to TVL roughly representing liquidity
        holders: 0, 
      }));
  } catch (err) {
    console.error('fetchVelarTokens error:', err);
    return [];
  }
}

export async function fetchVelarHistoricalPrices(contractAddress: string): Promise<{ time: string; value: number }[]> {
  try {
    // interval=hour, week, month, year
    const res = await fetch(`https://api.velar.co/prices/historical/${contractAddress}?interval=week`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Velar History API error: ${res.status}`);
    const result = await res.json();
    const dataArray = result?.data || result || [];
    
    return dataArray.map((item: any) => ({
      time: item.datetime.split('T')[0], // Extract YYYY-MM-DD
      value: item.value,
    })).sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()); // Ascending order
  } catch (err) {
    console.error('fetchVelarHistoricalPrices error for', contractAddress, err);
    return [];
  }
}

