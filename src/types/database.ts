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
      campaigns: {
        Row: {
          id: string
          title: string
          description: string
          target_stx: number
          raised_stx: number
          creator_address: string
          status: 'active' | 'completed' | 'failed'
          created_at: string
          ends_at: string
          image_url: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          target_stx: number
          raised_stx?: number
          creator_address: string
          status?: 'active' | 'completed' | 'failed'
          created_at?: string
          ends_at: string
          image_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          target_stx?: number
          raised_stx?: number
          creator_address?: string
          status?: 'active' | 'completed' | 'failed'
          created_at?: string
          ends_at?: string
          image_url?: string | null
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
      users: {
        Row: {
          id: string
          wallet_address: string
          username: string | null
          avatar_url: string | null
          created_at: string
          banned: boolean
        }
        Insert: {
          id?: string
          wallet_address: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          banned?: boolean
        }
        Update: {
          id?: string
          wallet_address?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          banned?: boolean
        }
      }
      notifications: {
        Row: {
          id: string
          wallet_address: string
          type: 'vote' | 'milestone' | 'alert'
          title: string
          message: string
          read: boolean
          created_at: string
          link: string | null
        }
        Insert: {
          id?: string
          wallet_address: string
          type: 'vote' | 'milestone' | 'alert'
          title: string
          message: string
          read?: boolean
          created_at?: string
          link?: string | null
        }
        Update: {
          id?: string
          wallet_address?: string
          type?: 'vote' | 'milestone' | 'alert'
          title?: string
          message?: string
          read?: boolean
          created_at?: string
          link?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_token_votes: {
        Args: { row_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
