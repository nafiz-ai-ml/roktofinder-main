-- =====================================================================
-- SECURITY HARDENING — run this once in the Supabase SQL Editor
--   1. password_hash / raw phone no longer readable by anon (public view)
--   2. phone_visible = false is enforced server-side
--   3. token-based donor sessions (no plaintext password in the browser)
--   4. emergency_requests can no longer be updated by anonymous visitors
-- =====================================================================

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------
-- 1. Public donor view (no password_hash, no coordinates, masked phone)
-- ---------------------------------------------------------------------
create or replace view public.donors_public as
select
  d.id,
  d.name,
  case when coalesce(d.phone_visible, true) then d.phone else null end as phone,
  d.blood_group,
  d.address,
  d.area,
  d.last_donation_date,
  d.donation_count,
  d.is_available,
  coalesce(d.phone_visible, true) as phone_visible,
  d.last_active,
  d.created_at
from public.donors d;

revoke all on public.donors from anon, authenticated;
grant select on public.donors_public to anon, authenticated;

-- ---------------------------------------------------------------------
-- 2. Donor sessions (short-lived tokens replace client-side passwords)
-- ---------------------------------------------------------------------
create table if not exists public.donor_sessions (
  token      text primary key,
  donor_id   uuid not null references public.donors(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days'
);

alter table public.donor_sessions enable row level security;
revoke all on public.donor_sessions from anon, authenticated;
-- No policies: only the security definer RPCs below may touch this table.

create index if not exists donor_sessions_donor_idx on public.donor_sessions (donor_id);

create or replace function public.donor_id_for_token(_token text)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select s.donor_id
  from public.donor_sessions s
  where s.token = _token
    and s.expires_at > now()
$$;

revoke all on function public.donor_id_for_token(text) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. Login → returns a session token, never the password hash
-- ---------------------------------------------------------------------
drop function if exists public.verify_donor_login(text, text);

create or replace function public.donor_login(
  _phone    text,
  _password text
)
returns table (
  id                 uuid,
  name               text,
  phone              text,
  blood_group        text,
  address            text,
  area               text,
  last_donation_date date,
  donation_count     integer,
  is_available       boolean,
  phone_visible      boolean,
  last_active        timestamptz,
  created_at         timestamptz,
  session_token      text
)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  d_id  uuid;
  tok   text;
begin
  select d.id into d_id
  from public.donors d
  where d.phone = _phone
    and d.password_hash = extensions.crypt(_password, d.password_hash)
  limit 1;

  if d_id is null then
    return;
  end if;

  tok := encode(extensions.gen_random_bytes(32), 'hex');
  insert into public.donor_sessions (token, donor_id) values (tok, d_id);

  update public.donors set last_active = now() where id = d_id;

  -- clean up expired sessions opportunistically
  delete from public.donor_sessions where expires_at < now();

  return query
  select d.id, d.name, d.phone, d.blood_group, d.address, d.area,
         d.last_donation_date, d.donation_count, d.is_available,
         coalesce(d.phone_visible, true), d.last_active, d.created_at, tok
  from public.donors d
  where d.id = d_id;
end;
$$;

grant execute on function public.donor_login(text, text) to anon, authenticated;

create or replace function public.donor_logout(_token text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.donor_sessions where token = _token;
$$;

grant execute on function public.donor_logout(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 4. Token-authenticated profile / donation updates
-- ---------------------------------------------------------------------
drop function if exists public.update_donor_profile(text, text, text, text, text, text, date, bool);
drop function if exists public.update_donor_profile(text, text, text, text, text, text, date, bool, bool);
drop function if exists public.record_donation(text, text, date);

create or replace function public.update_donor_profile_v2(
  _token              text,
  _name               text,
  _blood_group        text,
  _address            text,
  _area               text,
  _last_donation_date date,
  _is_available       bool,
  _phone_visible      bool
)
returns table (
  id                 uuid,
  name               text,
  phone              text,
  blood_group        text,
  address            text,
  area               text,
  last_donation_date date,
  donation_count     integer,
  is_available       boolean,
  phone_visible      boolean,
  last_active        timestamptz,
  created_at         timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  d_id uuid;
begin
  d_id := public.donor_id_for_token(_token);
  if d_id is null then
    raise exception 'invalid_session';
  end if;

  return query
  update public.donors d
  set name               = _name,
      blood_group        = _blood_group,
      address            = _address,
      area               = _area,
      last_donation_date = _last_donation_date,
      is_available       = _is_available,
      phone_visible      = _phone_visible,
      last_active        = now()
  where d.id = d_id
  returning d.id, d.name, d.phone, d.blood_group, d.address, d.area,
            d.last_donation_date, d.donation_count, d.is_available,
            coalesce(d.phone_visible, true), d.last_active, d.created_at;
end;
$$;

grant execute on function public.update_donor_profile_v2(text, text, text, text, text, date, bool, bool) to anon, authenticated;

create or replace function public.record_donation_v2(
  _token         text,
  _donation_date date
)
returns table (
  id                 uuid,
  name               text,
  phone              text,
  blood_group        text,
  address            text,
  area               text,
  last_donation_date date,
  donation_count     integer,
  is_available       boolean,
  phone_visible      boolean,
  last_active        timestamptz,
  created_at         timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  d_id uuid;
begin
  d_id := public.donor_id_for_token(_token);
  if d_id is null then
    raise exception 'invalid_session';
  end if;

  return query
  update public.donors d
  set last_donation_date = _donation_date,
      donation_count     = d.donation_count + 1,
      is_available       = false,
      last_active        = now()
  where d.id = d_id
  returning d.id, d.name, d.phone, d.blood_group, d.address, d.area,
            d.last_donation_date, d.donation_count, d.is_available,
            coalesce(d.phone_visible, true), d.last_active, d.created_at;
end;
$$;

grant execute on function public.record_donation_v2(text, date) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 5. Nearby search: mask hidden phone numbers, never expose hashes
-- ---------------------------------------------------------------------
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
  last_donation_date date,
  donation_count     integer,
  is_available       bool,
  phone_visible      bool,
  last_active        timestamptz,
  created_at         timestamptz,
  distance_km        float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    d.id, d.name,
    case when coalesce(d.phone_visible, true) then d.phone else null end,
    d.blood_group, d.address, d.area,
    d.last_donation_date, d.donation_count, d.is_available,
    coalesce(d.phone_visible, true), d.last_active, d.created_at,
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
  where (_bg is null or d.blood_group = _bg)
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
    d.is_available desc,
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
-- 6. Emergency requests: only the creator (edit token) may close/edit
-- ---------------------------------------------------------------------
alter table public.emergency_requests
  add column if not exists edit_token uuid;

alter table public.emergency_requests enable row level security;

drop policy if exists "emergency_requests_public_update" on public.emergency_requests;
drop policy if exists "emergency_public_update" on public.emergency_requests;
drop policy if exists "Anyone can update emergency requests" on public.emergency_requests;
drop policy if exists "emergency_requests_public_delete" on public.emergency_requests;
drop policy if exists "Anyone can delete emergency requests" on public.emergency_requests;

revoke all on public.emergency_requests from anon, authenticated;
grant insert on public.emergency_requests to anon, authenticated;

-- Hide the edit token from public reads via a view used by the app.
create or replace view public.emergency_requests_public as
select id, patient_name, blood_group, location, contact_phone, message,
       hospital, units_needed, is_active, created_at
from public.emergency_requests;

grant select on public.emergency_requests_public to anon, authenticated;

create or replace function public.close_emergency_request(
  _id    uuid,
  _token uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  ok boolean;
begin
  update public.emergency_requests r
  set is_active = false
  where r.id = _id
    and r.edit_token is not null
    and r.edit_token = _token;
  ok := found;
  return ok;
end;
$$;

grant execute on function public.close_emergency_request(uuid, uuid) to anon, authenticated;
