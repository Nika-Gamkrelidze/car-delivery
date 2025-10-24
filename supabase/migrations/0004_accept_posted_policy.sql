-- Separate policy to allow carriers to accept posted orders
-- Allows updates on rows currently in 'posted' status, but only if the new values
-- set status to 'accepted' and accepted_by_user_id to the acting user.

drop policy if exists "orders_accept_posted" on public.orders;
create policy "orders_accept_posted" on public.orders
  for update using (
    status = 'posted'
  ) with check (
    status = 'accepted' and accepted_by_user_id = auth.uid()
  );


