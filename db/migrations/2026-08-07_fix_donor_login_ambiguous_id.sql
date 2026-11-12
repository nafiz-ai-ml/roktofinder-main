-- Fix: "column reference \"id\" is ambiguous" during donor_login.
-- Cause: donor_login RETURNS TABLE declares an OUT column named `id`, which
-- shadows column names inside the function body. The UPDATE ... WHERE id = d_id
-- was therefore ambiguous. Qualify it with the table alias.

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

  update public.donors d set last_active = now() where d.id = d_id;

  delete from public.donor_sessions s where s.expires_at < now();

  return query
  select d.id, d.name, d.phone, d.blood_group, d.address, d.area,
         d.last_donation_date, d.donation_count, d.is_available,
         coalesce(d.phone_visible, true), d.last_active, d.created_at, tok
  from public.donors d
  where d.id = d_id;
end;
$$;

grant execute on function public.donor_login(text, text) to anon, authenticated;
