-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  role text check (role in ('customer','carrier')) not null,
  created_at timestamptz not null default now()
);

-- Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  pickup_city text not null,
  dropoff_city text not null,
  miles integer not null,
  price integer not null,
  status text check (status in ('posted','accepted','delivered','cancelled')) not null default 'posted',
  created_by_user_id uuid not null references public.profiles(id) on delete cascade,
  accepted_by_user_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.orders enable row level security;

-- RLS policies
create policy if not exists "profiles_select_self" on public.profiles
  for select using (auth.uid() = id);

create policy if not exists "profiles_insert_self" on public.profiles
  for insert with check (auth.uid() = id);

create policy if not exists "profiles_update_self" on public.profiles
  for update using (auth.uid() = id);

create policy if not exists "orders_select_posted" on public.orders
  for select using (status = 'posted');

create policy if not exists "orders_select_mine" on public.orders
  for select using (
    created_by_user_id = auth.uid() or accepted_by_user_id = auth.uid()
  );

create policy if not exists "orders_insert_creator" on public.orders
  for insert with check (created_by_user_id = auth.uid());

create policy if not exists "orders_update_creator_or_carrier" on public.orders
  for update using (
    created_by_user_id = auth.uid() or accepted_by_user_id = auth.uid()
  );


