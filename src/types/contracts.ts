// src/types/contracts.ts

export const STACKSMEMER_CONTRACT_ADDRESS = 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS'; // Replace deployed
export const STACKSMEMER_CONTRACT_NAME = 'stacksmemer';

export interface TokenRegistrationArgs {
  contractId: string; // The principal of the meme token being registered
  name: string;       // max 64 chars
  symbol: string;     // max 16 chars
}

export interface TokenVoteArgs {
  contractId: string; // The principal of the meme token being voted for
}

export interface TokenOnChainData {
  name: string;
  symbol: string;
  creator: string;
  votes: number;
  createdAt: number;
}
