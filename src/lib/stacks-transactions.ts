/* ═══════════════════════════════════════════
   Stacks Transactions API Client
   Broadcast transactions, contract calls, voting
═══════════════════════════════════════════ */

import { STACKS_MAINNET } from '@stacks/network';

const HIRO_API = 'https://api.hiro.so';
const NETWORK = STACKS_MAINNET;

// Cache the dynamic import
let txModule: typeof import('@stacks/transactions') | null = null;

async function getTxModule() {
  if (!txModule) {
    txModule = await import('@stacks/transactions');
  }
  return txModule;
}

// ─── Broadcast a signed transaction hex ──────────────────────────────────────
export async function broadcastTransaction(txHex: string): Promise<{ txId: string; success: boolean; error?: string }> {
  try {
    const res = await fetch(`${HIRO_API}/v2/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: hexToBytes(txHex).buffer as ArrayBuffer,
    });

    if (!res.ok) {
      const errorBody = await res.text();
      return { txId: '', success: false, error: `Broadcast error ${res.status}: ${errorBody}` };
    }

    const txId = await res.text();
    return { txId: txId.replace(/"/g, ''), success: true };
  } catch (err) {
    console.error('broadcastTransaction error:', err);
    return { txId: '', success: false, error: String(err) };
  }
}

// ─── Read-only contract call (no wallet needed) ──────────────────────────────
export async function callReadOnlyFunction(
  contractAddress: string,
  contractName: string,
  functionName: string,
  functionArgs: any[] = [],
  senderAddress = 'SP000000000000000000002Q6VF78' // standard read-only sender
): Promise<any> {
  try {
    const tx = await getTxModule();
    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      network: NETWORK,
      senderAddress,
    };
    const result = await tx.fetchCallReadOnlyFunction(options);
    return tx.cvToJSON(result);
  } catch (err) {
    console.error('callReadOnlyFunction error:', err);
    return null;
  }
}

// ─── Build a contract call transaction (for signing by wallet) ───────────────
export interface ContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  postConditions?: any[];
  postConditionMode?: number;
}

export function buildContractCallOptions(options: ContractCallOptions) {
  return {
    network: NETWORK,
    contractAddress: options.contractAddress,
    contractName: options.contractName,
    functionName: options.functionName,
    functionArgs: options.functionArgs,
    postConditions: options.postConditions || [],
    postConditionMode: options.postConditionMode || 0x02, // Deny by default
  };
}

// ─── Open Stacks Connect contract call popup ─────────────────────────────────
export async function signAndBroadcast(
  options: ContractCallOptions & {
    appName?: string;
    onFinish?: (data: { txId: string }) => void;
    onCancel?: () => void;
  }
) {
  if (typeof window === 'undefined') return;

  try {
    const connect = await import('@stacks/connect');
    const openContractCall = connect.openContractCall || (connect as any).default?.openContractCall;

    if (!openContractCall) {
      throw new Error('openContractCall not available in @stacks/connect');
    }

    await openContractCall({
      network: NETWORK,
      contractAddress: options.contractAddress,
      contractName: options.contractName,
      functionName: options.functionName,
      functionArgs: options.functionArgs,
      postConditions: options.postConditions || [],
      postConditionMode: options.postConditionMode || 0x02,
      appDetails: {
        name: options.appName || 'Stacks Memer',
        icon: window.location.origin + '/logo.svg',
      },
      onFinish: (data: any) => {
        console.log('Contract call tx submitted:', data.txId);
        options.onFinish?.({ txId: data.txId });
      },
      onCancel: () => {
        console.log('User cancelled contract call');
        options.onCancel?.();
      },
    });
  } catch (err) {
    console.error('signAndBroadcast error:', err);
    throw err;
  }
}

// ─── Poll for transaction status ─────────────────────────────────────────────
export async function waitForTransaction(
  txId: string,
  maxAttempts = 60,
  intervalMs = 5000
): Promise<{ status: string; success: boolean }> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${HIRO_API}/extended/v1/tx/${txId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.tx_status === 'success') {
          return { status: 'success', success: true };
        }
        if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
          return { status: data.tx_status, success: false };
        }
      }
    } catch {
      // continue polling
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return { status: 'timeout', success: false };
}

// ─── Clarity value constructors (re-exported for convenience) ────────────────
export async function clarityValues() {
  const tx = await getTxModule();
  return {
    uintCV: tx.uintCV,
    intCV: tx.intCV,
    bufferCV: tx.bufferCV,
    stringAsciiCV: tx.stringAsciiCV,
    stringUtf8CV: tx.stringUtf8CV,
    standardPrincipalCV: tx.standardPrincipalCV,
    contractPrincipalCV: tx.contractPrincipalCV,
    trueCV: tx.trueCV,
    falseCV: tx.falseCV,
    noneCV: tx.noneCV,
    someCV: tx.someCV,
    listCV: tx.listCV,
    tupleCV: tx.tupleCV,
    cvToJSON: tx.cvToJSON,
  };
}

// ─── Utility ─────────────────────────────────────────────────────────────────
function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
}
