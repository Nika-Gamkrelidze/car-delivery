-- Allow the currently assigned carrier to give up an accepted order
-- Transition: accepted (owned by me) -> posted (unassigned)

drop policy if exists "orders_give_up" on public.orders;
create policy "orders_give_up" on public.orders
  for update using (
    -- Only rows currently accepted by me
    accepted_by_user_id = auth.uid() and status = 'accepted'
  ) with check (
    -- New row must be posted and unassigned
    status = 'posted' and accepted_by_user_id is null
  );


