-- =====================================================================
-- Add donation_count tracking to donors + record_donation RPC
-- =====================================================================

-- 1. Add column with safe default
alter table public.donors
  add column if not exists donation_count integer not null default 0;

-- 2. Backfill: anyone with a last_donation_date but count = 0 → set to 1
update public.donors
set donation_count = 1
where last_donation_date is not null
  and donation_count = 0;

-- 3. New RPC: record a donation (increments count, sets date, starts cooldown)
create or replace function public.record_donation(
  _phone         text,
  _password      text,
  _donation_date date
)
returns setof public.donors
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
  update public.donors d
  set last_donation_date = _donation_date,
      donation_count     = d.donation_count + 1,
      is_available       = false,
      last_active        = now()
  where d.phone = _phone
    and d.password_hash = extensions.crypt(_password, d.password_hash)
  returning d.*;
end;
$$;

grant execute on function public.record_donation(text, text, date) to anon, authenticated;
