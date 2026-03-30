import { supabase } from './supabase';

export interface Notification {
  id: string;
  wallet_address: string;
  type: 'vote' | 'milestone' | 'alert';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link: string | null;
}

/**
 * Creates a new notification for a specific user.
 * Usually called from the server-side (using supabaseAdmin) or client if RLS permits.
 */
export async function createNotification(
  walletAddress: string,
  type: 'vote' | 'milestone' | 'alert',
  title: string,
  message: string,
  link?: string
) {
  const { error } = await (supabase
    .from('notifications') as any)
    .insert({
      wallet_address: walletAddress,
      type,
      title,
      message,
      link: link || null,
    });
    
  if (error) {
    console.error('Error creating notification:', error);
  }
}

/**
 * Fetches recent notifications for a given wallet address.
 */
export async function getNotifications(walletAddress: string): Promise<Notification[]> {
  const { data, error } = await (supabase
    .from('notifications') as any)
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data as Notification[];
}

/**
 * Gets the count of unread notifications.
 */
export async function getUnreadCount(walletAddress: string): Promise<number> {
  const { count, error } = await (supabase
    .from('notifications') as any)
    .select('*', { count: 'exact', head: true })
    .eq('wallet_address', walletAddress)
    .eq('read', false);

  if (error) return 0;
  return count || 0;
}

/**
 * Marks a specific notification as read.
 */
export async function markAsRead(notificationId: string) {
  await (supabase
    .from('notifications') as any)
    .update({ read: true })
    .eq('id', notificationId);
}

/**
 * Marks all notifications for a wallet as read.
 */
export async function markAllAsRead(walletAddress: string) {
  await (supabase
    .from('notifications') as any)
    .update({ read: true })
    .eq('wallet_address', walletAddress)
    .eq('read', false);
}
