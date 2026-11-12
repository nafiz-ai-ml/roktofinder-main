-- =====================================================================
-- RoktoFinder — PUBLIC site stats
-- Run once in Supabase SQL Editor (after 2026-11-01_site_analytics.sql).
--
-- Exposes AGGREGATE, anonymous visitor counts to everyone (no login).
-- Only derived numbers are public: totals, daily counts, top pages,
-- device split. No raw rows, no IPs, no personal data.
-- =====================================================================

create or replace function public.public_site_stats(_from date, _to date)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
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
        limit 8
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

-- Anyone (even signed-out visitors) may call the aggregate stats function
grant execute on function public.public_site_stats(date, date) to anon, authenticated;
