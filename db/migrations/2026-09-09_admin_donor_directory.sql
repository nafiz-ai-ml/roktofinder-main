-- =====================================================================
-- ADMIN-MANAGED DONOR DIRECTORY  (run once in the Supabase SQL Editor)
--
-- ADDITIVE ONLY. Nothing existing is dropped except functions that must be
-- recreated because their RETURNS TABLE gains the new donor_source column
-- (search_donors_by_area / search_donors_nearby) — behaviour is preserved.
--
--   1. donors gains directory columns (donor_source, division/district/upazila,
--      admin notes, archived_at, updated_at, audit columns)
--   2. admin_users (linked to Supabase Auth) + role helpers
--   3. RLS so only authenticated admins can touch directory rows
--   4. admin RPCs: create / update / archive + duplicate check + stats
--   5. admin_activity_log
--   6. donors_public + both search RPCs exclude archived rows and expose
--      donor_source (public, non-sensitive)
-- =====================================================================

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------
-- 1. Directory columns on the existing donors table
-- ---------------------------------------------------------------------
alter table public.donors
  add column if not exists donor_source     text not null default 'self_registered',
  add column if not exists division         text,
  add column if not exists district         text,
  add column if not exists upazila          text,
  add column if not exists admin_notes      text,
  add column if not exists source_label     text,
  add column if not exists archived_at      timestamptz,
  add column if not exists updated_at       timestamptz not null default now(),
  add column if not exists created_by_admin uuid,
  add column if not exists updated_by_admin uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'donors_donor_source_check'
  ) then
    alter table public.donors
      add constraint donors_donor_source_check
      check (donor_source in ('self_registered', 'admin_directory'));
  end if;
end $$;

-- Directory records are NOT accounts: no password is ever generated for them.
alter table public.donors alter column password_hash drop not null;

create index if not exists donors_source_idx on public.donors (donor_source);
create index if not exists donors_archived_idx on public.donors (archived_at);
create index if not exists donors_district_idx on public.donors (district);
create unique index if not exists donors_phone_unique_idx on public.donors (phone);

-- keep updated_at honest for every write path
create or replace function public.donors_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists donors_touch_updated_at on public.donors;
create trigger donors_touch_updated_at
  before update on public.donors
  for each row execute function public.donors_touch_updated_at();

-- ---------------------------------------------------------------------
-- 2. Admin users (identity lives in Supabase Auth — no password columns)
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'admin'
             check (role in ('super_admin', 'admin', 'moderator', 'volunteer')),
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid
);

alter table public.admin_users enable row level security;

grant select on public.admin_users to authenticated;
grant all on public.admin_users to service_role;

-- security definer helpers (avoid recursive RLS)
create or replace function public.is_rf_admin(_uid uuid default auth.uid())
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.admin_users a
    where a.user_id = _uid and a.is_active is true
      and a.role in ('super_admin', 'admin')
  )
$$;

create or replace function public.is_rf_super_admin(_uid uuid default auth.uid())
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.admin_users a
    where a.user_id = _uid and a.is_active is true and a.role = 'super_admin'
  )
$$;

grant execute on function public.is_rf_admin(uuid) to authenticated;
grant execute on function public.is_rf_super_admin(uuid) to authenticated;

drop policy if exists admin_users_self_read on public.admin_users;
create policy admin_users_self_read on public.admin_users
  for select to authenticated
  using (user_id = auth.uid() or public.is_rf_admin(auth.uid()));

drop policy if exists admin_users_super_write on public.admin_users;
create policy admin_users_super_write on public.admin_users
  for all to authenticated
  using (public.is_rf_super_admin(auth.uid()))
  with check (public.is_rf_super_admin(auth.uid()));

-- ---------------------------------------------------------------------
-- 3. Admin activity log (never public)
-- ---------------------------------------------------------------------
create table if not exists public.admin_activity_log (
  id         uuid primary key default gen_random_uuid(),
  admin_id   uuid,
  action     text not null,
  donor_id   uuid,
  details    text,
  created_at timestamptz not null default now()
);

alter table public.admin_activity_log enable row level security;
revoke all on public.admin_activity_log from anon;
grant select on public.admin_activity_log to authenticated;
grant all on public.admin_activity_log to service_role;

drop policy if exists admin_log_read on public.admin_activity_log;
create policy admin_log_read on public.admin_activity_log
  for select to authenticated using (public.is_rf_admin(auth.uid()));

create index if not exists admin_log_created_idx
  on public.admin_activity_log (created_at desc);

create or replace function public.log_admin_action(
  _action text, _donor_id uuid default null, _details text default null
)
returns void
language sql security definer set search_path = public
as $$
  insert into public.admin_activity_log (admin_id, action, donor_id, details)
  values (auth.uid(), _action, _donor_id, _details);
$$;

-- ---------------------------------------------------------------------
-- 4. RLS on donors — admins only; existing definer RPCs are unaffected
--    (they are owned by the table owner, which bypasses RLS)
-- ---------------------------------------------------------------------
alter table public.donors enable row level security;

revoke all on public.donors from anon;
grant select, insert, update on public.donors to authenticated;
grant all on public.donors to service_role;

drop policy if exists donors_admin_read on public.donors;
create policy donors_admin_read on public.donors
  for select to authenticated using (public.is_rf_admin(auth.uid()));

drop policy if exists donors_admin_insert_directory on public.donors;
create policy donors_admin_insert_directory on public.donors
  for insert to authenticated
  with check (public.is_rf_admin(auth.uid()) and donor_source = 'admin_directory');

drop policy if exists donors_admin_update_directory on public.donors;
create policy donors_admin_update_directory on public.donors
  for update to authenticated
  using (public.is_rf_admin(auth.uid()) and donor_source = 'admin_directory')
  with check (public.is_rf_admin(auth.uid()) and donor_source = 'admin_directory');

-- ---------------------------------------------------------------------
-- 5. Duplicate check + admin CRUD RPCs
-- ---------------------------------------------------------------------
create or replace function public.admin_check_duplicate(
  _phone text,
  _name  text default null,
  _bg    text default null,
  _area  text default null
)
returns table (
  id uuid, name text, phone text, blood_group text, area text,
  district text, donor_source text, archived_at timestamptz, match_reason text
)
language plpgsql stable security definer set search_path = public
as $$
declare
  digits text := regexp_replace(coalesce(_phone, ''), '\D', '', 'g');
begin
  if not public.is_rf_admin(auth.uid()) then
    raise exception 'not_authorized';
  end if;

  return query
  select d.id, d.name, d.phone, d.blood_group, d.area, d.district,
         d.donor_source, d.archived_at,
         case
           when digits <> '' and regexp_replace(d.phone, '\D', '', 'g') = digits
             then 'phone'
           else 'similar'
         end
  from public.donors d
  where (digits <> '' and regexp_replace(d.phone, '\D', '', 'g') = digits)
     or (
       _name is not null and _name <> ''
       and d.name ilike '%' || _name || '%'
       and (_bg is null or _bg = '' or d.blood_group = _bg)
       and (_area is null or _area = '' or d.area = _area)
     )
  order by (case when digits <> ''
                 and regexp_replace(d.phone, '\D', '', 'g') = digits then 0 else 1 end)
  limit 10;
end;
$$;

grant execute on function public.admin_check_duplicate(text, text, text, text) to authenticated;

create or replace function public.admin_create_directory_donor(
  _name               text,
  _phone              text,
  _blood_group        text,
  _district           text,
  _area               text,
  _division           text default 'ময়মনসিংহ',
  _upazila            text default null,
  _address            text default null,
  _last_donation_date date default null,
  _is_available       boolean default true,
  _phone_visible      boolean default true,
  _admin_notes        text default null,
  _source_label       text default null
)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  new_id uuid;
begin
  if not public.is_rf_admin(auth.uid()) then
    raise exception 'not_authorized';
  end if;

  if exists (
    select 1 from public.donors d
    where regexp_replace(d.phone, '\D', '', 'g')
        = regexp_replace(coalesce(_phone, ''), '\D', '', 'g')
  ) then
    raise exception 'duplicate_phone';
  end if;

  insert into public.donors (
    name, phone, password_hash, blood_group, address, area,
    division, district, upazila,
    last_donation_date, is_available, phone_visible,
    donor_source, admin_notes, source_label,
    created_by_admin, updated_by_admin, last_active,
    last_availability_confirmed_at, confirmation_source
  ) values (
    _name, _phone, null, _blood_group,
    coalesce(nullif(_address, ''), _area), _area,
    coalesce(nullif(_division, ''), 'ময়মনসিংহ'),
    _district, nullif(_upazila, ''),
    _last_donation_date, coalesce(_is_available, true), coalesce(_phone_visible, true),
    'admin_directory', nullif(_admin_notes, ''), nullif(_source_label, ''),
    auth.uid(), auth.uid(), now(),
    null, null
  )
  returning id into new_id;

  perform public.log_admin_action('donor_added', new_id, _name);
  return new_id;
end;
$$;

grant execute on function public.admin_create_directory_donor(
  text, text, text, text, text, text, text, text, date, boolean, boolean, text, text
) to authenticated;

create or replace function public.admin_update_directory_donor(
  _id                 uuid,
  _name               text,
  _phone              text,
  _blood_group        text,
  _district           text,
  _area               text,
  _division           text default null,
  _upazila            text default null,
  _address            text default null,
  _last_donation_date date default null,
  _is_available       boolean default true,
  _phone_visible      boolean default true,
  _admin_notes        text default null,
  _source_label       text default null
)
returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_rf_admin(auth.uid()) then
    raise exception 'not_authorized';
  end if;

  if exists (
    select 1 from public.donors d
    where d.id <> _id
      and regexp_replace(d.phone, '\D', '', 'g')
        = regexp_replace(coalesce(_phone, ''), '\D', '', 'g')
  ) then
    raise exception 'duplicate_phone';
  end if;

  update public.donors d
  set name               = _name,
      phone              = _phone,
      blood_group        = _blood_group,
      address            = coalesce(nullif(_address, ''), _area),
      area               = _area,
      division           = coalesce(nullif(_division, ''), d.division),
      district           = _district,
      upazila            = nullif(_upazila, ''),
      last_donation_date = _last_donation_date,
      is_available       = coalesce(_is_available, d.is_available),
      phone_visible      = coalesce(_phone_visible, d.phone_visible),
      admin_notes        = nullif(_admin_notes, ''),
      source_label       = nullif(_source_label, ''),
      updated_by_admin   = auth.uid()
  where d.id = _id
    and d.donor_source = 'admin_directory';

  if not found then
    raise exception 'directory_donor_not_found';
  end if;

  perform public.log_admin_action('donor_updated', _id, _name);
  return true;
end;
$$;

grant execute on function public.admin_update_directory_donor(
  uuid, text, text, text, text, text, text, text, text, date, boolean, boolean, text, text
) to authenticated;

-- availability / donation-date only (keeps the audit trail specific)
create or replace function public.admin_set_directory_availability(
  _id uuid, _is_available boolean
)
returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_rf_admin(auth.uid()) then
    raise exception 'not_authorized';
  end if;

  update public.donors d
  set is_available = _is_available, updated_by_admin = auth.uid()
  where d.id = _id and d.donor_source = 'admin_directory';

  if not found then raise exception 'directory_donor_not_found'; end if;
  perform public.log_admin_action('availability_changed', _id,
    case when _is_available then 'available' else 'unavailable' end);
  return true;
end;
$$;

grant execute on function public.admin_set_directory_availability(uuid, boolean) to authenticated;

create or replace function public.admin_set_directory_donation_date(
  _id uuid, _date date
)
returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_rf_admin(auth.uid()) then
    raise exception 'not_authorized';
  end if;

  update public.donors d
  set last_donation_date = _date, updated_by_admin = auth.uid()
  where d.id = _id and d.donor_source = 'admin_directory';

  if not found then raise exception 'directory_donor_not_found'; end if;
  perform public.log_admin_action('donation_date_updated', _id, _date::text);
  return true;
end;
$$;

grant execute on function public.admin_set_directory_donation_date(uuid, date) to authenticated;

create or replace function public.admin_archive_directory_donor(
  _id uuid, _archived boolean default true
)
returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_rf_admin(auth.uid()) then
    raise exception 'not_authorized';
  end if;

  update public.donors d
  set archived_at = case when _archived then now() else null end,
      updated_by_admin = auth.uid()
  where d.id = _id and d.donor_source = 'admin_directory';

  if not found then raise exception 'directory_donor_not_found'; end if;
  perform public.log_admin_action(
    case when _archived then 'donor_archived' else 'donor_restored' end, _id, null);
  return true;
end;
$$;

grant execute on function public.admin_archive_directory_donor(uuid, boolean) to authenticated;

-- permanent delete, super_admin only
create or replace function public.admin_delete_directory_donor(_id uuid)
returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_rf_super_admin(auth.uid()) then
    raise exception 'not_authorized';
  end if;

  delete from public.donors d
  where d.id = _id and d.donor_source = 'admin_directory';

  if not found then raise exception 'directory_donor_not_found'; end if;
  perform public.log_admin_action('donor_deleted', _id, null);
  return true;
end;
$$;

grant execute on function public.admin_delete_directory_donor(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- 6. Admin management (super_admin) + dashboard stats
-- ---------------------------------------------------------------------
create or replace function public.admin_grant_admin(
  _email text, _role text default 'admin', _full_name text default null
)
returns uuid
language plpgsql security definer set search_path = public, auth
as $$
declare
  uid uuid;
begin
  if not public.is_rf_super_admin(auth.uid()) then
    raise exception 'not_authorized';
  end if;
  if _role not in ('super_admin', 'admin', 'moderator', 'volunteer') then
    raise exception 'invalid_role';
  end if;

  select u.id into uid from auth.users u where lower(u.email) = lower(_email) limit 1;
  if uid is null then
    raise exception 'auth_user_not_found';
  end if;

  insert into public.admin_users (user_id, email, full_name, role, created_by)
  values (uid, lower(_email), _full_name, _role, auth.uid())
  on conflict (user_id) do update
    set role = excluded.role, is_active = true,
        full_name = coalesce(excluded.full_name, public.admin_users.full_name);

  perform public.log_admin_action('admin_granted', null, lower(_email) || ' → ' || _role);
  return uid;
end;
$$;

grant execute on function public.admin_grant_admin(text, text, text) to authenticated;

create or replace function public.admin_set_admin_active(
  _user_id uuid, _active boolean
)
returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_rf_super_admin(auth.uid()) then
    raise exception 'not_authorized';
  end if;
  if _user_id = auth.uid() then
    raise exception 'cannot_modify_self';
  end if;

  update public.admin_users set is_active = _active where user_id = _user_id;
  if not found then raise exception 'admin_not_found'; end if;

  perform public.log_admin_action(
    case when _active then 'admin_reactivated' else 'admin_deactivated' end,
    null, _user_id::text);
  return true;
end;
$$;

grant execute on function public.admin_set_admin_active(uuid, boolean) to authenticated;

create or replace function public.admin_donor_stats()
returns table (
  self_registered   bigint,
  directory         bigint,
  total             bigint,
  available_now     bigint,
  recently_added    bigint,
  recently_updated  bigint,
  archived          bigint
)
language plpgsql stable security definer set search_path = public
as $$
begin
  if not public.is_rf_admin(auth.uid()) then
    raise exception 'not_authorized';
  end if;

  return query
  select
    count(*) filter (where d.donor_source = 'self_registered' and d.archived_at is null),
    count(*) filter (where d.donor_source = 'admin_directory' and d.archived_at is null),
    count(*) filter (where d.archived_at is null),
    count(*) filter (
      where d.archived_at is null
        and public.donor_availability_state(
              d.last_donation_date, d.is_available, d.last_availability_confirmed_at
            ) <> 'unavailable'),
    count(*) filter (where d.archived_at is null and d.created_at > now() - interval '7 days'),
    count(*) filter (where d.archived_at is null and d.updated_at > now() - interval '7 days'),
    count(*) filter (where d.archived_at is not null)
  from public.donors d;
end;
$$;

grant execute on function public.admin_donor_stats() to authenticated;

-- ---------------------------------------------------------------------
-- 7. Public view + search RPCs: hide archived rows, expose donor_source
-- ---------------------------------------------------------------------
drop view if exists public.donors_public;

create view public.donors_public as
select
  d.id,
  d.name,
  case when coalesce(d.phone_visible, true) then d.phone else null end as phone,
  d.blood_group,
  d.address,
  d.area,
  d.district,
  d.upazila,
  d.donor_source,
  d.last_donation_date,
  d.donation_count,
  d.is_available,
  coalesce(d.phone_visible, true) as phone_visible,
  d.last_active,
  d.created_at,
  d.updated_at,
  public.donor_availability_state(
    d.last_donation_date, d.is_available, d.last_availability_confirmed_at
  ) as availability_state,
  case
    when d.last_availability_confirmed_at is null then null
    else (current_date - d.last_availability_confirmed_at::date)
  end as confirmed_days_ago
from public.donors d
where d.archived_at is null;

grant select on public.donors_public to anon, authenticated;

-- area search (same signature, adds donor_source + info_updated_days_ago)
drop function if exists public.search_donors_by_area(text, text, bool);

create or replace function public.search_donors_by_area(
  _bg             text default null,
  _area           text default null,
  _available_only bool default false
)
returns table (
  id                 uuid,
  name               text,
  phone              text,
  blood_group        text,
  address            text,
  area               text,
  district           text,
  donor_source       text,
  last_donation_date date,
  donation_count     integer,
  is_available       bool,
  phone_visible      bool,
  last_active        timestamptz,
  created_at         timestamptz,
  availability_state text,
  confirmed_days_ago integer,
  info_updated_days_ago integer
)
language sql stable security definer set search_path = public
as $$
  select
    d.id, d.name,
    case when coalesce(d.phone_visible, true) then d.phone else null end,
    d.blood_group, d.address, d.area, d.district, d.donor_source,
    d.last_donation_date, d.donation_count, d.is_available,
    coalesce(d.phone_visible, true), d.last_active, d.created_at,
    public.donor_availability_state(d.last_donation_date, d.is_available,
                                    d.last_availability_confirmed_at),
    case when d.last_availability_confirmed_at is null then null
         else (current_date - d.last_availability_confirmed_at::date) end,
    (current_date - d.updated_at::date)
  from public.donors d
  where d.archived_at is null
    and (_bg is null or d.blood_group = _bg)
    and (_area is null or d.area ilike '%' || _area || '%')
    and (_available_only is false or d.is_available is true)
  order by
    (public.donor_availability_state(d.last_donation_date, d.is_available,
                                      d.last_availability_confirmed_at) = 'unavailable') asc,
    public.donor_state_rank(
      public.donor_availability_state(d.last_donation_date, d.is_available,
                                      d.last_availability_confirmed_at)) asc,
    public.donor_reliability_rank(d.contact_attempts, d.successful_contacts,
                                  d.unanswered_contacts, d.unavailable_reports) asc,
    d.last_active desc nulls last
  limit 200;
$$;

grant execute on function public.search_donors_by_area(text, text, bool) to anon, authenticated;

-- nearby search (same signature, adds donor_source + info_updated_days_ago)
drop function if exists public.search_donors_nearby(text, float, float, int, bool);

create or replace function public.search_donors_nearby(
  _bg              text default null,
  _lat             float default null,
  _lng             float default null,
  _radius_km       int   default 10,
  _available_only  bool  default false
)
returns table (
  id                 uuid,
  name               text,
  phone              text,
  blood_group        text,
  address            text,
  area               text,
  district           text,
  donor_source       text,
  last_donation_date date,
  donation_count     integer,
  is_available       bool,
  phone_visible      bool,
  last_active        timestamptz,
  created_at         timestamptz,
  availability_state text,
  confirmed_days_ago integer,
  info_updated_days_ago integer,
  distance_km        float
)
language sql stable security definer set search_path = public
as $$
  select
    d.id, d.name,
    case when coalesce(d.phone_visible, true) then d.phone else null end,
    d.blood_group, d.address, d.area, d.district, d.donor_source,
    d.last_donation_date, d.donation_count, d.is_available,
    coalesce(d.phone_visible, true), d.last_active, d.created_at,
    public.donor_availability_state(d.last_donation_date, d.is_available,
                                    d.last_availability_confirmed_at),
    case when d.last_availability_confirmed_at is null then null
         else (current_date - d.last_availability_confirmed_at::date) end,
    (current_date - d.updated_at::date),
    case
      when _lat is not null and _lng is not null and d.location_geog is not null
      then round(
        (st_distance(
          d.location_geog,
          st_setsrid(st_makepoint(_lng, _lat), 4326)::geography
        ) / 1000.0)::numeric, 2
      )::float
      else null
    end as distance_km
  from public.donors d
  where d.archived_at is null
    and (_bg is null or d.blood_group = _bg)
    and (_available_only is false or d.is_available is true)
    and (
      _lat is null or _lng is null
      or d.location_geog is null
      or st_dwithin(
           d.location_geog,
           st_setsrid(st_makepoint(_lng, _lat), 4326)::geography,
           _radius_km * 1000
         )
    )
  order by
    (public.donor_availability_state(d.last_donation_date, d.is_available,
                                      d.last_availability_confirmed_at) = 'unavailable') asc,
    public.donor_state_rank(
      public.donor_availability_state(d.last_donation_date, d.is_available,
                                      d.last_availability_confirmed_at)) asc,
    case
      when _lat is not null and _lng is not null and d.location_geog is not null
      then floor(
        st_distance(d.location_geog,
                    st_setsrid(st_makepoint(_lng, _lat), 4326)::geography) / 2000.0
      )
      else 1e9
    end asc,
    public.donor_reliability_rank(d.contact_attempts, d.successful_contacts,
                                  d.unanswered_contacts, d.unavailable_reports) asc,
    case
      when _lat is not null and _lng is not null and d.location_geog is not null
      then st_distance(d.location_geog, st_setsrid(st_makepoint(_lng, _lat), 4326)::geography)
      else 1e18
    end asc,
    d.last_active desc nulls last
  limit 100;
$$;

grant execute on function public.search_donors_nearby(text, float, float, int, bool) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 8. FIRST SUPER ADMIN (manual, one time)
--    a) Supabase Dashboard → Authentication → Users → "Add user"
--       (email + password, mark email confirmed)
--    b) run, with that email:
--
--  insert into public.admin_users (user_id, email, role)
--  select id, email, 'super_admin' from auth.users
--  where lower(email) = lower('you@example.com')
--  on conflict (user_id) do update set role = 'super_admin', is_active = true;
-- ---------------------------------------------------------------------
