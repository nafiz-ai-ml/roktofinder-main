-- Update search_donors_nearby to include phone_visible column
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
    d.id, d.name, d.phone, d.blood_group, d.address, d.area,
    d.last_donation_date, d.is_available, d.phone_visible, d.last_active, d.created_at,
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
