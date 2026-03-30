import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUnreadCount, getNotifications } from '@/lib/notifications';

/**
 * GET /api/notifications?wallet=SP...
 * Fetches recent notifications for a given wallet
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json({ error: 'Missing wallet query parameter' }, { status: 400 });
    }

    const [notifications, unreadCount] = await Promise.all([
      getNotifications(wallet),
      getUnreadCount(wallet)
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (err: any) {
    console.error('Notification API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications
 * Body: { notificationId?: string, walletAddress?: string, markAllRead?: boolean }
 * Marks notifications as read
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    if (body.markAllRead && body.walletAddress) {
      await (supabase
        .from('notifications') as any)
        .update({ read: true })
        .eq('wallet_address', body.walletAddress)
        .eq('read', false);
      return NextResponse.json({ success: true });
    }

    if (body.notificationId) {
      await (supabase
        .from('notifications') as any)
        .update({ read: true })
        .eq('id', body.notificationId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (err: any) {
    console.error('Notification API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
