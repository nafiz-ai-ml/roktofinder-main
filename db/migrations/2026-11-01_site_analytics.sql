-- =====================================================================
-- RoktoFinder site analytics (visitor + pageview tracking)
-- Run once in Supabase SQL Editor.
-- - Anonymous INSERT only (no personal data: no IP, no fingerprint).
-- - SELECT only for authenticated admin_users rows (via is_rf_admin).
-- =====================================================================

-- 1. Raw pageview table ---------------------------------------------------
create table if not exists public.site_page_views (
  id          uuid primary key default extensions.gen_random_uuid(),
  path        text not null,
  session_id  text not null,
  referrer    text,
  device      text,
  -- Day boundary in Asia/Dhaka timezone so daily counts match local days
  day         date not null default ((now() at time zone 'Asia/Dhaka')::date),
  created_at  timestamptz not null default now()
);

create index if not exists site_page_views_day_idx     on public.site_page_views (day);
create index if not exists site_page_views_path_idx    on public.site_page_views (path);
create index if not exists site_page_views_session_idx on public.site_page_views (session_id);

-- 2. Grants (RLS alone is not enough) -------------------------------------
grant insert on public.site_page_views to anon, authenticated;
grant select on public.site_page_views to authenticated;
grant all on public.site_page_views to service_role;

-- 3. RLS ------------------------------------------------------------------
alter table public.site_page_views enable row level security;

-- Anyone (even signed-out visitors) may add a pageview row
create policy site_page_views_insert_all
  on public.site_page_views
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated admins may read analytics data
create policy site_page_views_select_admin
  on public.site_page_views
  for select
  to authenticated
  using (public.is_rf_admin());

-- 4. Summary RPC for the admin analytics page ------------------------------
create or replace function public.admin_analytics_summary(_from date, _to date)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_rf_admin(auth.uid()) then
    raise exception 'not_authorized';
  end if;

  select jsonb_build_object(
    'total_views', (
      select count(*)::int
      from public.site_page_views pv
      where pv.day between _from and _to
    ),
    'total_visitors', (
      select count(distinct pv.session_id)::int
      from public.site_page_views pv
      where pv.day between _from and _to
    ),
    'daily', coalesce((
      select jsonb_agg(
        jsonb_build_object('day', s.day, 'visitors', s.visitors, 'views', s.views)
        order by s.day
      )
      from (
        select pv.day,
               count(distinct pv.session_id)::int as visitors,
               count(*)::int as views
        from public.site_page_views pv
        where pv.day between _from and _to
        group by pv.day
      ) s
    ), '[]'::jsonb),
    'top_pages', coalesce((
      select jsonb_agg(
        jsonb_build_object('path', t.path, 'views', t.views, 'visitors', t.visitors)
        order by t.views desc
      )
      from (
        select pv.path,
               count(*)::int as views,
               count(distinct pv.session_id)::int as visitors
        from public.site_page_views pv
        where pv.day between _from and _to
        group by pv.path
        order by count(*) desc
        limit 10
      ) t
    ), '[]'::jsonb),
    'devices', coalesce((
      select jsonb_agg(
        jsonb_build_object('device', d.device, 'views', d.views)
        order by d.views desc
      )
      from (
        select coalesce(pv.device, 'unknown') as device,
               count(*)::int as views
        from public.site_page_views pv
        where pv.day between _from and _to
        group by 1
        order by 2 desc
      ) d
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

grant execute on function public.admin_analytics_summary(date, date) to authenticated;
