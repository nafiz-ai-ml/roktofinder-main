-- =====================================================================
-- Location-based donor search (Hybrid: area tag + coordinates + PostGIS)
-- Run this in your Supabase SQL editor.
-- =====================================================================

-- 1. Enable PostGIS
create extension if not exists postgis;
create extension if not exists pgcrypto;

-- 2. Add lat/lng + generated geography column to donors
alter table public.donors
  add column if not exists latitude  numeric(10, 7),
  add column if not exists longitude numeric(10, 7);

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'donors' and column_name = 'location_geog'
  ) then
    alter table public.donors
      add column location_geog geography(Point, 4326)
      generated always as (
        case
          when latitude is not null and longitude is not null
          then st_setsrid(st_makepoint(longitude::float8, latitude::float8), 4326)::geography
        end
      ) stored;
  end if;
end $$;

-- 3. Indexes
create index if not exists donors_location_geog_gix
  on public.donors using gist (location_geog);
create index if not exists donors_bg_avail_idx
  on public.donors (blood_group, is_available);
create index if not exists donors_area_idx
  on public.donors (area);

-- 4. Areas table (scalable across cities)
create table if not exists public.areas (
  id          uuid primary key default gen_random_uuid(),
  name_bn     text not null,
  name_en     text,
  district    text not null default 'Mymensingh',
  division    text not null default 'Mymensingh',
  center_lat  numeric(10, 7) not null,
  center_lng  numeric(10, 7) not null,
  created_at  timestamptz not null default now(),
  unique (name_bn, district)
);

alter table public.areas enable row level security;
drop policy if exists "areas_public_read" on public.areas;
create policy "areas_public_read" on public.areas for select using (true);

-- 5. Seed Mymensingh area centroids (approx coordinates)
insert into public.areas (name_bn, name_en, district, center_lat, center_lng) values
  ('কেওয়াটখালি',  'Kewatkhali',   'Mymensingh', 24.7350, 90.4080),
  ('চরপাড়া',      'Charpara',     'Mymensingh', 24.7470, 90.4060),
  ('মাসকান্দা',    'Maskanda',     'Mymensingh', 24.7600, 90.4280),
  ('গাঙ্গিনারপাড়', 'Ganginarpar',  'Mymensingh', 24.7510, 90.4030),
  ('নতুন বাজার',  'Notun Bazar',  'Mymensingh', 24.7520, 90.4060),
  ('ব্রাহ্মপল্লী',   'Brahmapalli',  'Mymensingh', 24.7530, 90.4090),
  ('সানকিপাড়া',  'Sankipara',    'Mymensingh', 24.7560, 90.4120),
  ('কাচিঝুলি',     'Kachijhuli',   'Mymensingh', 24.7480, 90.4150),
  ('বাঘমারা',     'Baghmara',     'Mymensingh', 24.7620, 90.4180),
  ('আকুয়া',       'Akua',         'Mymensingh', 24.7400, 90.4200),
  ('কাঠগোলা',    'Kathgola',     'Mymensingh', 24.7550, 90.4070),
  ('নওমহল',      'Naomahal',     'Mymensingh', 24.7490, 90.4100),
  ('বলাশপুর',     'Balashpur',    'Mymensingh', 24.7700, 90.4100),
  ('কলেজ রোড',  'College Road', 'Mymensingh', 24.7530, 90.4050),
  ('জুবিলি ঘাট',  'Jubilee Ghat', 'Mymensingh', 24.7460, 90.4020),
  ('টাউন হল',    'Town Hall',    'Mymensingh', 24.7500, 90.4070),
  ('ভাটিকাশর',    'Bhatikashor',  'Mymensingh', 24.7430, 90.4250),
  ('কৃষ্টপুর',      'Krishtopur',   'Mymensingh', 24.7380, 90.4180),
  ('ছোট বাজার',  'Choto Bazar',  'Mymensingh', 24.7510, 90.4080),
  ('বড় বাজার',   'Boro Bazar',   'Mymensingh', 24.7505, 90.4075),
  ('গোহাইলকান্দি','Gohailkandi',  'Mymensingh', 24.7300, 90.4150),
  ('শম্ভুগঞ্জ',     'Shambhuganj',  'Mymensingh', 24.7600, 90.4500),
  ('BAU (বাংলাদেশ কৃষি বিশ্ববিদ্যালয়)', 'BAU', 'Mymensingh', 24.7256, 90.4264),
  ('ত্রিশাল',      'Trishal',      'Mymensingh', 24.5700, 90.4100),
  ('ভালুকা',      'Bhaluka',      'Mymensingh', 24.3550, 90.4000),
  ('মুক্তাগাছা',    'Muktagacha',   'Mymensingh', 24.7700, 90.2500),
  ('ফুলবাড়িয়া',   'Fulbaria',     'Mymensingh', 24.6500, 90.2900),
  ('গফরগাঁও',    'Gafargaon',    'Mymensingh', 24.4350, 90.5550),
  ('গৌরীপুর',     'Gauripur',     'Mymensingh', 24.7450, 90.6300),
  ('ঈশ্বরগঞ্জ',    'Ishwarganj',   'Mymensingh', 24.6500, 90.5700),
  ('নান্দাইল',     'Nandail',      'Mymensingh', 24.6000, 90.6900),
  ('ফুলপুর',      'Fulpur',       'Mymensingh', 24.9100, 90.4000),
  ('হালুয়াঘাট',   'Haluaghat',    'Mymensingh', 25.0700, 90.3000),
  ('ধোবাউড়া',    'Dhobaura',     'Mymensingh', 25.1500, 90.4200),
  ('তারাকান্দা',   'Tarakanda',    'Mymensingh', 24.8500, 90.3800)
on conflict (name_bn, district) do nothing;

-- 6. Backfill existing donors with area centroid (only if lat/lng null)
update public.donors d
set latitude  = a.center_lat,
    longitude = a.center_lng
from public.areas a
where d.area = a.name_bn
  and d.latitude is null
  and d.longitude is null;

-- 7. Distance-based search RPC
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
  is_available       bool,
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
    d.id, d.name, d.phone, d.blood_group, d.address, d.area,
    d.last_donation_date, d.is_available, d.last_active, d.created_at,
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

-- 8. Update register_donor to accept optional lat/lng
do $$
declare fn_oid oid;
begin
  for fn_oid in
    select p.oid from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'register_donor'
  loop
    execute 'drop function ' || fn_oid::regprocedure;
  end loop;
end $$;

create or replace function public.register_donor(
  _name              text,
  _phone             text,
  _password          text,
  _blood_group       text,
  _address           text,
  _area              text default null,
  _last_donation_date date default null,
  _is_available      bool default true,
  _latitude          numeric default null,
  _longitude         numeric default null
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  new_id uuid;
  hashed text;
  final_lat numeric;
  final_lng numeric;
begin
  hashed := crypt(_password, gen_salt('bf'));

  final_lat := _latitude;
  final_lng := _longitude;
  if final_lat is null or final_lng is null then
    select a.center_lat, a.center_lng into final_lat, final_lng
    from public.areas a
    where a.name_bn = _area
    limit 1;
  end if;

  insert into public.donors (
    name, phone, password_hash, blood_group, address, area,
    last_donation_date, is_available, latitude, longitude, last_active
  ) values (
    _name, _phone, hashed, _blood_group::text, _address, _area,
    _last_donation_date, _is_available, final_lat, final_lng, now()
  )
  returning id into new_id;

  return new_id;
end;
$$;

grant execute on function public.register_donor(text, text, text, text, text, text, date, bool, numeric, numeric) to anon, authenticated;
