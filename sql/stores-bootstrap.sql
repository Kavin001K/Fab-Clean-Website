create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  address text not null,
  phone text not null,
  email text,
  latitude real not null,
  longitude real not null,
  coverage_radius_km real not null default 3,
  map_href text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into stores (
  slug,
  name,
  address,
  phone,
  email,
  latitude,
  longitude,
  coverage_radius_km,
  map_href,
  sort_order,
  is_active
)
values
  (
    'pollachi',
    'Pollachi flagship',
    '#16, Venkatramana Round Road, Opposite Naturals Salon / HDFC Bank, Mahalingapuram, Pollachi - 642002',
    '93630 59595',
    'info@myfabclean.in',
    10.6596,
    77.0085,
    3,
    'https://www.google.com/maps/search/?api=1&query=16%20Venkatramana%20Round%20Road%20Pollachi%20642002',
    1,
    true
  ),
  (
    'kinathukadavu',
    'Kinathukadavu branch',
    '#442/11, Opposite MLA Office, Krishnasamypuram, Kinathukadavu - 642109',
    '93637 19595',
    'myfabclean@gmail.com',
    10.8195,
    77.0162,
    3,
    'https://www.google.com/maps/search/?api=1&query=442%2F11%20Krishnasamypuram%20Kinathukadavu%20642109',
    2,
    true
  )
on conflict (slug) do update
set
  name = excluded.name,
  address = excluded.address,
  phone = excluded.phone,
  email = excluded.email,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  coverage_radius_km = excluded.coverage_radius_km,
  map_href = excluded.map_href,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

alter table pickups
  alter column branch type text using branch::text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'pickups_branch_stores_slug_fk'
  ) then
    alter table pickups
      add constraint pickups_branch_stores_slug_fk
      foreign key (branch) references stores(slug)
      on update cascade
      on delete restrict;
  end if;
end $$;

create index if not exists stores_active_sort_idx on stores (is_active, sort_order, name);
create index if not exists pickups_branch_idx on pickups (branch);
