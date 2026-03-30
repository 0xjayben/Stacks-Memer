import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Missing Supabase Service Role Key. Server-side mutations requiring admin privileges will fail.');
}

/**
 * Supabase client with Service Role Key (Admin Access).
 * MUST ONLY BE USED ON THE SERVER SIDE (e.g., in API routes).
 * 
 * Used for:
 * 1. Bypassing Row Level Security (RLS) when necessary for system operations.
 * 2. Uploading files to storage securely via API route instead of exposing storage directly to client.
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceRoleKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
