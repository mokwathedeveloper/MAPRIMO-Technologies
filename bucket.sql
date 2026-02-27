-- 1. Create the storage bucket named 'projects'
insert into storage.buckets (id, name, public) 
values ('projects', 'projects', true)
on conflict (id) do nothing;

-- 2. Allow public read access to everyone
create policy "Public Read Access"
on storage.objects for select
using (bucket_id = 'projects');

-- 3. Allow admins to insert/upload files
create policy "Admin Insert Access"
on storage.objects for insert
with check (
  bucket_id = 'projects' and 
  exists (select 1 from public.admins where user_id = auth.uid())
);

-- 4. Allow admins to update files
create policy "Admin Update Access"
on storage.objects for update
using (
  bucket_id = 'projects' and 
  exists (select 1 from public.admins where user_id = auth.uid())
);

-- 5. Allow admins to delete files
create policy "Admin Delete Access"
on storage.objects for delete
using (
  bucket_id = 'projects' and 
  exists (select 1 from public.admins where user_id = auth.uid())
);
