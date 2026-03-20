export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tokens: {
        Row: {
          id: string
          name: string
          symbol: string
          contract_address: string
          description: string | null
          logo_url: string | null
          creator_wallet: string
          created_at: string
          votes_count: number
        }
        Insert: {
          id?: string
          name: string
          symbol: string
          contract_address: string
          description?: string | null
          logo_url?: string | null
          creator_wallet: string
          created_at?: string
          votes_count?: number
        }
        Update: {
          id?: string
          name?: string
          symbol?: string
          contract_address?: string
          description?: string | null
          logo_url?: string | null
          creator_wallet?: string
          created_at?: string
          votes_count?: number
        }
      }
      votes: {
        Row: {
          id: string
          token_id: string
          wallet_address: string
          created_at: string
        }
        Insert: {
          id?: string
          token_id: string
          wallet_address: string
          created_at?: string
        }
        Update: {
          id?: string
          token_id?: string
          wallet_address?: string
          created_at?: string
        }
      }
    }
  }
}
