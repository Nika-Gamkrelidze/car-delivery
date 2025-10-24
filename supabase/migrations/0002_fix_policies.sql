-- Make policies idempotent by dropping and re-creating with desired definitions

-- Profiles policies
drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update using (auth.uid() = id);

-- Orders policies
drop policy if exists "orders_select_posted" on public.orders;
create policy "orders_select_posted" on public.orders
  for select using (status = 'posted');

drop policy if exists "orders_select_mine" on public.orders;
create policy "orders_select_mine" on public.orders
  for select using (
    created_by_user_id = auth.uid() or accepted_by_user_id = auth.uid()
  );

drop policy if exists "orders_insert_creator" on public.orders;
create policy "orders_insert_creator" on public.orders
  for insert with check (created_by_user_id = auth.uid());

drop policy if exists "orders_update_creator_or_carrier" on public.orders;
create policy "orders_update_creator_or_carrier" on public.orders
  for update using (
    created_by_user_id = auth.uid() or accepted_by_user_id = auth.uid()
  );


