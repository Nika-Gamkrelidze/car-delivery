-- Add image_url to orders and create a public storage bucket for order images

alter table public.orders add column if not exists image_url text;

-- Create a storage bucket for order images if it doesn't exist
insert into storage.buckets (id, name, public)
select 'order-images', 'order-images', true
where not exists (select 1 from storage.buckets where id = 'order-images');

-- Allow public read access to the bucket
drop policy if exists "Public read access for order-images" on storage.objects;
create policy "Public read access for order-images" on storage.objects
  for select using ( bucket_id = 'order-images' );

-- Allow authenticated users to upload to the bucket
drop policy if exists "Authenticated upload for order-images" on storage.objects;
create policy "Authenticated upload for order-images" on storage.objects
  for insert with check (
    bucket_id = 'order-images' and auth.role() = 'authenticated'
  );

-- Allow authenticated users to update/delete their own objects (optional)
drop policy if exists "Authenticated update own objects order-images" on storage.objects;
create policy "Authenticated update own objects order-images" on storage.objects
  for update using (
    bucket_id = 'order-images' and auth.role() = 'authenticated' and owner = auth.uid()
  );
drop policy if exists "Authenticated delete own objects order-images" on storage.objects;
create policy "Authenticated delete own objects order-images" on storage.objects
  for delete using (
    bucket_id = 'order-images' and auth.role() = 'authenticated' and owner = auth.uid()
  );


