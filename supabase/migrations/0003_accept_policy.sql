-- Allow accepting posted orders by any authenticated user by setting accepted_by_user_id to self
-- and moving status from 'posted' to 'accepted'. Keep other updates restricted as before.

-- Recreate the update policy to explicitly allow accepting a posted order
drop policy if exists "orders_update_creator_or_carrier" on public.orders;
create policy "orders_update_creator_or_carrier" on public.orders
  for update using (
    -- Allow updating if you are the creator or the carrier already assigned
    created_by_user_id = auth.uid() or accepted_by_user_id = auth.uid()
  ) with check (
    -- Additionally, allow a transition from posted->accepted by the acting user
    (status = 'accepted' and accepted_by_user_id = auth.uid())
    or created_by_user_id = auth.uid()
    or accepted_by_user_id = auth.uid()
  );

-- Optional: trigger to maintain updated_at on updates
create or replace function public.set_orders_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute procedure public.set_orders_updated_at();


