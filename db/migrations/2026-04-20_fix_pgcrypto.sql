-- =====================================================================
-- FIX: pgcrypto crypt() not found error in login/register RPCs
-- Run this once in Supabase SQL Editor.
-- =====================================================================

-- 1. Make sure pgcrypto is installed (in extensions schema, the Supabase default)
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

-- 2. Fix register_donor: include `extensions` in search_path
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
  hashed := extensions.crypt(_password, extensions.gen_salt('bf'));

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

-- 3. Fix verify_donor_login: include `extensions` in search_path & use schema-qualified crypt
create or replace function public.verify_donor_login(
  _phone    text,
  _password text
)
returns setof public.donors
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
  select d.*
  from public.donors d
  where d.phone = _phone
    and d.password_hash = extensions.crypt(_password, d.password_hash)
  limit 1;

  -- Update last_active best-effort (ignore errors)
  begin
    update public.donors
    set last_active = now()
    where phone = _phone
      and password_hash = extensions.crypt(_password, password_hash);
  exception when others then null;
  end;
end;
$$;

grant execute on function public.verify_donor_login(text, text) to anon, authenticated;

-- 4. Fix update_donor_profile (same root cause)
create or replace function public.update_donor_profile(
  _phone              text,
  _password           text,
  _name               text,
  _blood_group        text,
  _address            text,
  _area               text,
  _last_donation_date date,
  _is_available       bool
)
returns setof public.donors
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
  update public.donors d
  set name               = _name,
      blood_group        = _blood_group,
      address            = _address,
      area               = _area,
      last_donation_date = _last_donation_date,
      is_available       = _is_available,
      last_active        = now()
  where d.phone = _phone
    and d.password_hash = extensions.crypt(_password, d.password_hash)
  returning d.*;
end;
$$;

grant execute on function public.update_donor_profile(text, text, text, text, text, text, date, bool) to anon, authenticated;
