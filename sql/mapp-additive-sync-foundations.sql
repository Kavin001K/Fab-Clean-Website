-- ============================================================================
-- Fab Shared Supabase Additive Migration (SAFE / ADD-ONLY)
-- Purpose: mobile identity sync, shared store registry, reporting helpers
-- IMPORTANT: add-only. No destructive changes or data rewrites.
-- ============================================================================

begin;

create extension if not exists pgcrypto;

-- --------------------------------------------------------------------------
-- 1) Core additive columns
-- --------------------------------------------------------------------------

alter table if exists public.orders
  add column if not exists store_code text;

alter table if exists public.mapp_orders
  add column if not exists store_code text;

-- --------------------------------------------------------------------------
-- 2) App-owned tables
-- --------------------------------------------------------------------------

create table if not exists public.mapp_identity_links (
  id uuid primary key default gen_random_uuid(),
  mapp_user_id uuid not null references public.mapp_users(id) on delete cascade,
  normalized_phone text not null,
  erp_customer_id text references public.customers(id) on delete set null,
  website_user_id uuid references public.website_users(id) on delete set null,
  match_source text not null default 'phone' check (match_source in ('phone', 'manual', 'hybrid')),
  confidence_score numeric(5,2) not null default 100,
  last_synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (mapp_user_id)
);

create table if not exists public.mapp_sync_events (
  id uuid primary key default gen_random_uuid(),
  mapp_user_id uuid references public.mapp_users(id) on delete cascade,
  normalized_phone text,
  event_type text not null,
  event_status text not null default 'success' check (event_status in ('success', 'warning', 'failed')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.mapp_expense_entries (
  id uuid primary key default gen_random_uuid(),
  amount numeric(12,2) not null check (amount > 0),
  category text not null,
  note text,
  incurred_at timestamptz not null default now(),
  store_code text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mapp_store_registry (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  slug text not null unique,
  name text not null,
  address text,
  phone text,
  email text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  map_href text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- 3) Safe indexes for read-heavy paths
-- --------------------------------------------------------------------------

create index if not exists idx_customers_phone on public.customers(phone);
create index if not exists idx_customers_secondary_phone on public.customers(secondary_phone);
create index if not exists idx_website_users_phone on public.website_users(phone);

create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_updated_at on public.orders(updated_at desc);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_store_code on public.orders(store_code);
create index if not exists idx_orders_customer_phone on public.orders(customer_phone);

create index if not exists idx_mapp_identity_links_phone on public.mapp_identity_links(normalized_phone);
create index if not exists idx_mapp_identity_links_erp_customer on public.mapp_identity_links(erp_customer_id);
create index if not exists idx_mapp_identity_links_website_user on public.mapp_identity_links(website_user_id);
create index if not exists idx_mapp_sync_events_user_created on public.mapp_sync_events(mapp_user_id, created_at desc);
create index if not exists idx_mapp_expense_entries_incurred on public.mapp_expense_entries(incurred_at desc);
create index if not exists idx_mapp_expense_entries_store on public.mapp_expense_entries(store_code);
create index if not exists idx_mapp_store_registry_active_sort on public.mapp_store_registry(is_active, sort_order, name);
create index if not exists idx_mapp_orders_store_code on public.mapp_orders(store_code);

-- --------------------------------------------------------------------------
-- 4) Shared helper functions and triggers
-- --------------------------------------------------------------------------

create or replace function public.mapp_normalize_phone(p_phone text)
returns text
language sql
immutable
parallel safe
as $$
  select nullif(right(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g'), 10), '');
$$;

create or replace function public.mapp_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_mapp_identity_links_updated_at on public.mapp_identity_links;
create trigger trg_mapp_identity_links_updated_at
before update on public.mapp_identity_links
for each row
execute function public.mapp_touch_updated_at();

drop trigger if exists trg_mapp_expense_entries_updated_at on public.mapp_expense_entries;
create trigger trg_mapp_expense_entries_updated_at
before update on public.mapp_expense_entries
for each row
execute function public.mapp_touch_updated_at();

drop trigger if exists trg_mapp_store_registry_updated_at on public.mapp_store_registry;
create trigger trg_mapp_store_registry_updated_at
before update on public.mapp_store_registry
for each row
execute function public.mapp_touch_updated_at();

-- --------------------------------------------------------------------------
-- 5) Store registry seeding and shared store-code mapping
-- --------------------------------------------------------------------------

do $$
begin
  if to_regclass('public.website_stores') is not null then
    insert into public.mapp_store_registry (
      code,
      slug,
      name,
      address,
      phone,
      email,
      latitude,
      longitude,
      map_href,
      is_active,
      sort_order,
      metadata
    )
    select
      coalesce(ws.slug, 'store-' || substr(ws.id::text, 1, 8)) as code,
      ws.slug,
      ws.name,
      ws.address,
      ws.phone,
      ws.email,
      ws.latitude::numeric(10,7),
      ws.longitude::numeric(10,7),
      ws.map_href,
      ws.is_active,
      ws.sort_order,
      jsonb_build_object('source', 'website_stores')
    from public.website_stores ws
    on conflict (slug) do update
    set
      name = excluded.name,
      address = excluded.address,
      phone = excluded.phone,
      email = excluded.email,
      latitude = excluded.latitude,
      longitude = excluded.longitude,
      map_href = excluded.map_href,
      is_active = excluded.is_active,
      sort_order = excluded.sort_order,
      updated_at = now(),
      metadata = public.mapp_store_registry.metadata || excluded.metadata;
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and column_name = 'branch'
  ) then
    execute $sql$
      update public.orders o
      set store_code = sr.code
      from public.mapp_store_registry sr
      where o.store_code is null
        and (
          lower(coalesce(o.branch, '')) = lower(sr.slug)
          or lower(coalesce(o.branch, '')) = lower(sr.code)
        )
    $sql$;
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'mapp_orders'
      and column_name = 'branch'
  ) then
    execute $sql$
      update public.mapp_orders mo
      set store_code = sr.code
      from public.mapp_store_registry sr
      where mo.store_code is null
        and (
          lower(coalesce(mo.branch, '')) = lower(sr.slug)
          or lower(coalesce(mo.branch, '')) = lower(sr.code)
        )
    $sql$;
  end if;
end $$;

-- --------------------------------------------------------------------------
-- 6) Canonical integration views
-- --------------------------------------------------------------------------

do $$
begin
  execute $sql$
    create or replace view public.mapp_identity_directory_v1 as
    select
      mil.id as identity_link_id,
      mil.mapp_user_id,
      mil.website_user_id,
      mil.erp_customer_id,
      mil.normalized_phone,
      mil.match_source,
      mil.confidence_score,
      mil.last_synced_at,
      mu.phone as mapp_phone,
      wu.phone as website_phone,
      c.phone as erp_phone,
      c.secondary_phone as erp_secondary_phone,
      coalesce(mu.name, wu.name, c.name) as resolved_name,
      coalesce(mu.email, wu.email, c.email) as resolved_email,
      mu.created_at as mapp_created_at,
      wu.created_at as website_created_at
    from public.mapp_identity_links mil
    left join public.mapp_users mu on mu.id = mil.mapp_user_id
    left join public.website_users wu on wu.id = mil.website_user_id
    left join public.customers c on c.id = mil.erp_customer_id
  $sql$;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and column_name in ('customer_phone', 'updated_at')
    group by table_name
    having count(*) = 2
  ) and exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'mapp_orders'
      and column_name in ('customer_phone', 'updated_at')
    group by table_name
    having count(*) = 2
  ) then
    execute $sql$
      create or replace view public.mapp_orders_unified_v1 as
      select
        'erp'::text as source_system,
        o.id::text as source_order_id,
        o.order_number,
        o.customer_id,
        public.mapp_normalize_phone(o.customer_phone) as normalized_phone,
        o.status,
        o.payment_status,
        o.total_amount,
        o.created_at,
        o.updated_at,
        coalesce(o.store_code, sr.code) as store_code,
        sr.slug as store_slug,
        sr.name as store_name
      from public.orders o
      left join public.mapp_store_registry sr on lower(sr.code) = lower(o.store_code)

      union all

      select
        'mobile'::text as source_system,
        mo.id::text as source_order_id,
        coalesce(mo.order_number, mo.id::text) as order_number,
        null::text as customer_id,
        public.mapp_normalize_phone(mo.customer_phone) as normalized_phone,
        mo.status,
        null::text as payment_status,
        mo.total_amount,
        mo.created_at,
        mo.updated_at,
        coalesce(mo.store_code, sr.code) as store_code,
        sr.slug as store_slug,
        sr.name as store_name
      from public.mapp_orders mo
      left join public.mapp_store_registry sr on lower(sr.code) = lower(mo.store_code)
    $sql$;
  end if;
end $$;

-- --------------------------------------------------------------------------
-- 7) Initial identity link seeding from shared phone numbers
-- --------------------------------------------------------------------------

insert into public.mapp_identity_links (
  mapp_user_id,
  normalized_phone,
  erp_customer_id,
  website_user_id,
  match_source,
  confidence_score,
  last_synced_at
)
select
  mu.id,
  public.mapp_normalize_phone(mu.phone) as normalized_phone,
  c.id as erp_customer_id,
  wu.id as website_user_id,
  'phone' as match_source,
  100 as confidence_score,
  now() as last_synced_at
from public.mapp_users mu
left join public.website_users wu
  on public.mapp_normalize_phone(wu.phone) = public.mapp_normalize_phone(mu.phone)
left join public.customers c
  on public.mapp_normalize_phone(c.phone) = public.mapp_normalize_phone(mu.phone)
  or public.mapp_normalize_phone(c.secondary_phone) = public.mapp_normalize_phone(mu.phone)
where public.mapp_normalize_phone(mu.phone) is not null
on conflict (mapp_user_id) do update
set
  normalized_phone = excluded.normalized_phone,
  erp_customer_id = coalesce(excluded.erp_customer_id, public.mapp_identity_links.erp_customer_id),
  website_user_id = coalesce(excluded.website_user_id, public.mapp_identity_links.website_user_id),
  last_synced_at = now(),
  updated_at = now();

commit;
