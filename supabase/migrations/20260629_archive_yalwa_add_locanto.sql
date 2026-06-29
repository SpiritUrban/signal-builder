alter table public.roadmap_items
  add column if not exists priority text,
  add column if not exists service_type text,
  add column if not exists last_checked date,
  add column if not exists archived boolean not null default false;

alter table public.roadmap_items
  drop constraint if exists roadmap_items_status_check;

alter table public.roadmap_items
  add constraint roadmap_items_status_check
  check (status in ('planned', 'not_evaluated', 'in_progress', 'done', 'skipped', 'problem', 'closed'));

alter table public.roadmap_items
  drop constraint if exists roadmap_items_priority_check;

alter table public.roadmap_items
  add constraint roadmap_items_priority_check
  check (priority is null or priority in ('high', 'medium', 'low', 'none'));

update public.roadmap_items
set
  status = 'closed',
  priority = 'none',
  last_checked = date '2026-06-29',
  archived = true,
  notes = 'Yalwa Business Directory officially closed. Сайт показує повідомлення "The Yalwa Business Directory is now closed" та перенаправляє користувачів на Locanto.'
where id = 24;

insert into public.roadmap_items (
  id,
  status,
  priority,
  target_url,
  service_type,
  notes,
  archived
)
values (
  103,
  'not_evaluated',
  'low',
  '',
  'Classifieds / Local Ads',
  'Не є класичним бізнес-каталогом. Потребує окремої оцінки SEO-користі для My Transfer.',
  false
)
on conflict (id) do update
set
  status = excluded.status,
  priority = excluded.priority,
  service_type = excluded.service_type,
  notes = excluded.notes,
  archived = excluded.archived;
