create table if not exists public.roadmap_items (
  id integer primary key,
  status text not null default 'planned'
    check (status in ('planned', 'in_progress', 'done', 'skipped', 'problem')),
  target_url text not null default '',
  notes text not null default '',
  updated_at timestamptz not null default now()
);

create or replace function public.set_roadmap_item_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists roadmap_items_set_updated_at on public.roadmap_items;
create trigger roadmap_items_set_updated_at
before update on public.roadmap_items
for each row execute function public.set_roadmap_item_updated_at();

alter table public.roadmap_items enable row level security;

drop policy if exists "Public roadmap read" on public.roadmap_items;
create policy "Public roadmap read"
on public.roadmap_items for select
to anon, authenticated
using (true);

drop policy if exists "Public roadmap insert" on public.roadmap_items;
create policy "Public roadmap insert"
on public.roadmap_items for insert
to anon, authenticated
with check (true);

drop policy if exists "Public roadmap update" on public.roadmap_items;
create policy "Public roadmap update"
on public.roadmap_items for update
to anon, authenticated
using (true)
with check (true);

do $$
begin
  alter publication supabase_realtime add table public.roadmap_items;
exception
  when duplicate_object then null;
end;
$$;
