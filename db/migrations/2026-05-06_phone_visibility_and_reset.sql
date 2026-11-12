-- =====================================================================
-- Phone visibility + password reset requests
-- =====================================================================

-- 1. phone_visible flag on donors (default visible to keep existing behavior)
alter table public.donors
  add column if not exists phone_visible boolean not null default true;

-- 2. Update update_donor_profile to include phone_visible
create or replace function public.update_donor_profile(
  _phone              text,
  _password           text,
  _name               text,
  _blood_group        text,
  _address            text,
  _area               text,
  _last_donation_date date,
  _is_available       bool,
  _phone_visible      bool
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
      phone_visible      = _phone_visible,
      last_active        = now()
  where d.phone = _phone
    and d.password_hash = extensions.crypt(_password, d.password_hash)
  returning d.*;
end;
$$;

grant execute on function public.update_donor_profile(text, text, text, text, text, text, date, bool, bool) to anon, authenticated;

-- 3. Password reset requests table (admin reviews & resets manually)
create table if not exists public.password_reset_requests (
  id           uuid primary key default gen_random_uuid(),
  phone        text not null,
  contact_info text,
  status       text not null default 'pending',
  created_at   timestamptz not null default now()
);

alter table public.password_reset_requests enable row level security;

-- No public policies — only RPC writes via security definer.

-- 4. RPC: submit a reset request. Returns true if phone is registered.
create or replace function public.request_password_reset(
  _phone        text,
  _contact_info text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  exists_donor boolean;
begin
  select exists(select 1 from public.donors where phone = _phone) into exists_donor;
  if exists_donor then
    insert into public.password_reset_requests (phone, contact_info)
    values (_phone, _contact_info);
  end if;
  return exists_donor;
end;
$$;

grant execute on function public.request_password_reset(text, text) to anon, authenticated;
