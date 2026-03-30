-- Supabase migrations for Stacksmemer
-- 1. Create tables and set up Realtime
-- 2. Configure Storage
-- 3. Set Row Level Security (RLS)

-- Enable Postgres extensions
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. TABLES
-- ==========================================

-- users table (profiles matching wallets)
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  wallet_address text unique not null,
  username text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  banned boolean default false not null
);

-- notifications table
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  wallet_address text not null references public.users(wallet_address) on delete cascade,
  type text not null check (type in ('vote', 'milestone', 'alert')),
  title text not null,
  message text not null,
  read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  link text
);

-- Note: tokens, campaigns, and votes are assumed to already exist based on
-- the current schema MVP. We just need to add the RPC to increment votes.

-- ==========================================
-- 2. FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to safely increment token votes off-chain
create or replace function increment_token_votes(row_id uuid)
returns void as $$
begin
  update public.tokens
  set votes_count = votes_count + 1
  where id = row_id;
end;
$$ language plpgsql;

-- Trigger to create a user automatically on first vote if they don't exist
create or replace function public.handle_new_voter()
returns trigger as $$
begin
  insert into public.users (wallet_address)
  values (new.wallet_address)
  on conflict (wallet_address) do nothing;
  return new;
end;
$$ language plpgsql;

create trigger on_vote_create_user
  before insert on public.votes
  for each row execute function public.handle_new_voter();

-- ==========================================
-- 3. REALTIME CONFIGURATION
-- ==========================================

-- Enable realtime for key tables
alter publication supabase_realtime add table public.tokens;
alter publication supabase_realtime add table public.votes;
alter publication supabase_realtime add table public.notifications;

-- ==========================================
-- 4. STORAGE CONFIGURATION
-- ==========================================

-- Create token-media bucket (assuming it doesn't exist)
insert into storage.buckets (id, name, public) 
values ('token-media', 'token-media', true)
on conflict (id) do nothing;

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS
alter table public.users enable row level security;
alter table public.notifications enable row level security;

-- Users can read all users (for leaderboards/creators)
create policy "Public users are viewable by everyone."
  on public.users for select
  using ( true );

-- Users can only read their own notifications
create policy "Users can view their own notifications."
  on public.notifications for select
  using ( wallet_address = current_setting('request.jwt.claims', true)::json->>'sub' ); -- In a real app we'd map this, for MVP we might bypass or use anon key with wallet header

-- Storage RLS: Anyone can read, only Service Role (Admin) can insert (handled by our API)
create policy "Public Token Media Access"
  on storage.objects for select
  using ( bucket_id = 'token-media' );

create policy "Admin Insert Token Media"
  on storage.objects for insert
  using ( bucket_id = 'token-media' and auth.role() = 'service_role' );
