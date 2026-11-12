-- =====================================================================
-- DONOR AVAILABILITY FRESHNESS + RELIABILITY  (run once in SQL Editor)
--   1. explicit availability confirmation tracking (NO backfill)
--   2. derived availability_state exposed through donors_public
--   3. freshness-aware search ranking (area + nearby)
--   4. anonymous seeker feedback -> internal counters only
-- =====================================================================

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------
-- 1. New columns (all nullable / safe defaults, no backfill at all)
-- ---------------------------------------------------------------------
alter table public.donors
  add column if not exists last_availability_confirmed_at timestamptz,
  add column if not exists availability_declined_at       timestamptz,
  add column if not exists confirmation_source            text,
  add column if not exists contact_attempts               integer not null default 0,
  add column if not exists successful_contacts            integer not null default 0,
  add column if not exists unanswered_contacts            integer not null default 0,
  add column if not exists unavailable_reports            integer not null default 0,
  add column if not exists successful_help_reports        integer not null default 0,
  add column if not exists needs_review                   boolean not null default false;

-- New registrations that opt in are an explicit confirmation.
create or replace function public.donors_set_registration_confirmation()
returns trigger
language plpgsql
as $$
begin
  if new.is_available is true and new.last_availability_confirmed_at is null then
    new.last_availability_confirmed_at := now();
    new.confirmation_source := coalesce(new.confirmation_source, 'registration');
  end if;
  return new;
end;
$$;

drop trigger if exists donors_registration_confirmation on public.donors;
create trigger donors_registration_confirmation
  before insert on public.donors
  for each row execute function public.donors_set_registration_confirmation();

-- ---------------------------------------------------------------------
-- 2. Shared status helpers (single source of truth for view + search)
-- ---------------------------------------------------------------------
create or replace function public.donor_availability_state(
  _last_donation_date date,
  _is_available       boolean,
  _confirmed_at       timestamptz
)
returns text
language sql
immutable
as $$
  select case
    when _last_donation_date is not null
         and (current_date - _last_donation_date) < 90 then 'unavailable'
    when coalesce(_is_available, false) is false        then 'unavailable'
    when _confirmed_at is null                         then 'unconfirmed'
    when (current_date - _confirmed_at::date) <= 30     then 'fresh'
    when (current_date - _confirmed_at::date) <= 90     then 'stale'
    else 'inactive'
  end
$$;

-- ordering weight: lower = shown first
create or replace function public.donor_state_rank(_state text)
returns integer
language sql
immutable
as $$
  select case _state
    when 'fresh'       then 0
    when 'stale'       then 1
    when 'unconfirmed' then 2
    when 'inactive'    then 3
    else 4
  end
$$;

-- reliability tie-breaker: neutral (0) until >= 5 contact attempts
create or replace function public.donor_reliability_rank(
  _attempts   integer,
  _successful integer,
  _unanswered integer,
  _unavailable integer
)
returns double precision
language sql
immutable
as $$
  select case
    when coalesce(_attempts, 0) < 5 then 0::double precision
    else -(
      (coalesce(_successful, 0)::double precision
        - coalesce(_unanswered, 0) - coalesce(_unavailable, 0))
      / greatest(coalesce(_attempts, 0), 1)::double precision
    )
  end
$$;

grant execute on function public.donor_availability_state(date, boolean, timestamptz) to anon, authenticated;
grant execute on function public.donor_state_rank(text) to anon, authenticated;
grant execute on function public.donor_reliability_rank(integer, integer, integer, integer) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. donors_public — only derived, privacy-safe freshness info
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
  d.last_donation_date,
  d.donation_count,
  d.is_available,
  coalesce(d.phone_visible, true) as phone_visible,
  d.last_active,
  d.created_at,
  public.donor_availability_state(
    d.last_donation_date, d.is_available, d.last_availability_confirmed_at
  ) as availability_state,
  case
    when d.last_availability_confirmed_at is null then null
    else (current_date - d.last_availability_confirmed_at::date)
  end as confirmed_days_ago
from public.donors d;

revoke all on public.donors from anon, authenticated;
grant select on public.donors_public to anon, authenticated;

-- ---------------------------------------------------------------------
-- 4. Explicit availability confirmation (one-click, token authenticated)
-- ---------------------------------------------------------------------
create or replace function public.confirm_availability(
  _token     text,
  _available boolean,
  _source    text default 'dashboard'
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
  availability_state text,
  confirmed_days_ago integer
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

  if _source is null or _source not in
     ('registration', 'dashboard', 'availability_toggle', 'reminder_link') then
    _source := 'dashboard';
  end if;

  return query
  update public.donors d
  set is_available                   = _available,
      last_availability_confirmed_at = case when _available then now()
                                            else d.last_availability_confirmed_at end,
      availability_declined_at       = case when _available then d.availability_declined_at
                                            else now() end,
      confirmation_source            = case when _available then _source
                                            else d.confirmation_source end,
      last_active                    = now()
  where d.id = d_id
  returning d.id, d.name,
            case when coalesce(d.phone_visible, true) then d.phone else null end,
            d.blood_group, d.address, d.area,
            d.last_donation_date, d.donation_count, d.is_available,
            coalesce(d.phone_visible, true), d.last_active, d.created_at,
            public.donor_availability_state(d.last_donation_date, d.is_available,
                                            d.last_availability_confirmed_at),
            case when d.last_availability_confirmed_at is null then null
                 else (current_date - d.last_availability_confirmed_at::date) end;
end;
$$;

grant execute on function public.confirm_availability(text, boolean, text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 5. Search: area mode RPC + nearby RPC, both freshness-ranked
-- ---------------------------------------------------------------------
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
  last_donation_date date,
  donation_count     integer,
  is_available       bool,
  phone_visible      bool,
  last_active        timestamptz,
  created_at         timestamptz,
  availability_state text,
  confirmed_days_ago integer
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
    public.donor_availability_state(d.last_donation_date, d.is_available,
                                    d.last_availability_confirmed_at),
    case when d.last_availability_confirmed_at is null then null
         else (current_date - d.last_availability_confirmed_at::date) end
  from public.donors d
  where (_bg is null or d.blood_group = _bg)
    and (_area is null or d.area ilike '%' || _area || '%')
    and (_available_only is false or d.is_available is true)
  order by
    -- 1. ready right now (no cooldown + opted in)
    (public.donor_availability_state(d.last_donation_date, d.is_available,
                                      d.last_availability_confirmed_at) = 'unavailable') asc,
    -- 2. freshness of the explicit confirmation
    public.donor_state_rank(
      public.donor_availability_state(d.last_donation_date, d.is_available,
                                      d.last_availability_confirmed_at)) asc,
    -- 3. reliability (neutral below 5 contact attempts)
    public.donor_reliability_rank(d.contact_attempts, d.successful_contacts,
                                  d.unanswered_contacts, d.unavailable_reports) asc,
    -- 4. website activity, tie-breaker only
    d.last_active desc nulls last
  limit 200;
$$;

grant execute on function public.search_donors_by_area(text, text, bool) to anon, authenticated;

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
  availability_state text,
  confirmed_days_ago integer,
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
    public.donor_availability_state(d.last_donation_date, d.is_available,
                                    d.last_availability_confirmed_at),
    case when d.last_availability_confirmed_at is null then null
         else (current_date - d.last_availability_confirmed_at::date) end,
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
    -- 1. ready right now
    (public.donor_availability_state(d.last_donation_date, d.is_available,
                                      d.last_availability_confirmed_at) = 'unavailable') asc,
    -- 2. freshness
    public.donor_state_rank(
      public.donor_availability_state(d.last_donation_date, d.is_available,
                                      d.last_availability_confirmed_at)) asc,
    -- 3. distance bucket (~2 km steps, so small gaps never beat freshness)
    case
      when _lat is not null and _lng is not null and d.location_geog is not null
      then floor(
        st_distance(d.location_geog,
                    st_setsrid(st_makepoint(_lng, _lat), 4326)::geography) / 2000.0
      )
      else 1e9
    end asc,
    -- 4. reliability (neutral below 5 attempts)
    public.donor_reliability_rank(d.contact_attempts, d.successful_contacts,
                                  d.unanswered_contacts, d.unavailable_reports) asc,
    -- 5. exact distance, then activity
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
-- 6. Seeker feedback — write-only through a definer RPC
-- ---------------------------------------------------------------------
create table if not exists public.donor_contact_feedback (
  id                 uuid primary key default gen_random_uuid(),
  donor_id           uuid not null references public.donors(id) on delete cascade,
  outcome            text not null check (outcome in ('contacted', 'no_answer', 'unavailable', 'arranged')),
  seeker_fingerprint text,
  created_at         timestamptz not null default now()
);

alter table public.donor_contact_feedback enable row level security;
revoke all on public.donor_contact_feedback from anon, authenticated;
-- no policies: only the security definer RPC below may read/write this table.

create index if not exists donor_feedback_donor_idx
  on public.donor_contact_feedback (donor_id, created_at desc);

create or replace function public.submit_contact_feedback(
  _donor_id    uuid,
  _outcome     text,
  _fingerprint text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_unavailable int;
begin
  if _outcome not in ('contacted', 'no_answer', 'unavailable', 'arranged') then
    return false;
  end if;

  -- anti-spam: one report per (donor, seeker) per 24h
  if _fingerprint is not null and exists (
    select 1 from public.donor_contact_feedback f
    where f.donor_id = _donor_id
      and f.seeker_fingerprint = _fingerprint
      and f.created_at > now() - interval '24 hours'
  ) then
    return false;
  end if;

  insert into public.donor_contact_feedback (donor_id, outcome, seeker_fingerprint)
  values (_donor_id, _outcome, _fingerprint);

  update public.donors d
  set contact_attempts        = d.contact_attempts + 1,
      successful_contacts     = d.successful_contacts
                                + case when _outcome = 'contacted' then 1 else 0 end,
      unanswered_contacts     = d.unanswered_contacts
                                + case when _outcome = 'no_answer' then 1 else 0 end,
      unavailable_reports     = d.unavailable_reports
                                + case when _outcome = 'unavailable' then 1 else 0 end,
      successful_help_reports = d.successful_help_reports
                                + case when _outcome = 'arranged' then 1 else 0 end
  where d.id = _donor_id;

  -- internal review signal only: never auto-hide, never flip is_available
  select count(distinct coalesce(f.seeker_fingerprint, f.id::text))
    into recent_unavailable
  from public.donor_contact_feedback f
  where f.donor_id = _donor_id
    and f.outcome = 'unavailable'
    and f.created_at > now() - interval '30 days';

  if recent_unavailable >= 3 then
    update public.donors set needs_review = true where id = _donor_id;
  end if;

  return true;
end;
$$;

grant execute on function public.submit_contact_feedback(uuid, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 7. Indexes
-- ---------------------------------------------------------------------
create index if not exists donors_bg_available_idx
  on public.donors (blood_group, is_available);
create index if not exists donors_confirmed_idx
  on public.donors (last_availability_confirmed_at desc nulls last);
create index if not exists donors_last_active_idx
  on public.donors (last_active desc);
create index if not exists donors_location_gix
  on public.donors using gist (location_geog);
