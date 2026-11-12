import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Eye, Users, TrendingUp, MousePointerClick, RefreshCw, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabaseAdminAuth } from "@/lib/admin";
import { toBnNum } from "@/lib/supabase";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "ভিজিটর অ্যানালিটিক্স — RoktoFinder" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <AdminShell>{() => <AnalyticsPage />}</AdminShell>,
});

// ---- Types ---------------------------------------------------------------

interface DailyRow {
  day: string;
  visitors: number;
  views: number;
}
interface PageRow {
  path: string;
  views: number;
  visitors: number;
}
interface DeviceRow {
  device: string;
  views: number;
}
interface AnalyticsSummary {
  total_views: number;
  total_visitors: number;
  daily: DailyRow[];
  top_pages: PageRow[];
  devices: DeviceRow[];
}

// ---- Constants ------------------------------------------------------------

const RANGES = [
  { days: 7, label: "৭ দিন" },
  { days: 30, label: "৩০ দিন" },
  { days: 90, label: "৯০ দিন" },
] as const;

// Chart colors (match the site theme tokens; recharts can't read CSS vars)
const C_PRIMARY = "oklch(0.58 0.22 27)";
const C_SUCCESS = "oklch(0.62 0.16 152)";
const C_MUTED = "oklch(0.7 0.02 25)";
const PIE_COLORS = [C_PRIMARY, C_SUCCESS, "oklch(0.6 0.12 250)", "oklch(0.65 0.15 80)"];

const PATH_LABELS: Record<string, string> = {
  "/": "হোম",
  "/directory": "ডিরেক্টরি",
  "/register": "ডোনার হন",
  "/emergency": "জরুরি রক্ত",
  "/about": "আমাদের সম্পর্কে",
  "/help": "সাহায্য",
  "/privacy": "প্রাইভেসি",
  "/dashboard": "ডোনার ড্যাশবোর্ড",
  "/search": "পুরনো সার্চ (রিডাইরেক্ট)",
};

const DEVICE_LABELS: Record<string, string> = {
  mobile: "মোবাইল",
  desktop: "কম্পিউটার",
  tablet: "ট্যাবলেট",
  unknown: "অজানা",
};

function pathLabel(p: string): string {
  return PATH_LABELS[p] ?? p;
}

function bnDay(day: string): string {
  const [, m, d] = day.split("-");
  return toBnNum(`${d}/${m}`);
}

/** Today's date (YYYY-MM-DD) in the site's timezone. */
function dhakaToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(new Date());
}

function dhakaDate(daysAgo: number): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(
    new Date(Date.now() - daysAgo * 86_400_000),
  );
}

// ---- Page -----------------------------------------------------------------

function AnalyticsPage() {
  const [rangeDays, setRangeDays] = useState<number>(30);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (days: number) => {
    setLoading(true);
    setError(null);
    const { data, error: rpcError } = await supabaseAdminAuth.rpc("admin_analytics_summary", {
      _from: dhakaDate(days - 1),
      _to: dhakaToday(),
    });
    if (rpcError) {
      setError(rpcError.message);
    } else {
      setSummary(data as AnalyticsSummary);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load(rangeDays);
  }, [rangeDays, load]);

  // Fill missing days with zeros so the graph is continuous
  const daily: DailyRow[] = [];
  if (summary) {
    const byDay = new Map(summary.daily.map((r) => [r.day, r]));
    for (let i = rangeDays - 1; i >= 0; i--) {
      const day = dhakaDate(i);
      const row = byDay.get(day);
      daily.push({ day, visitors: row?.visitors ?? 0, views: row?.views ?? 0 });
    }
  }

  const avgDaily =
    summary && summary.total_views > 0 ? Math.round(summary.total_views / rangeDays) : 0;
  const topPage = summary?.top_pages?.[0];

  const dailyChartData = daily.map((r) => ({
    ...r,
    label: bnDay(r.day),
  }));
  const pageChartData = (summary?.top_pages ?? []).map((r) => ({
    ...r,
    label: pathLabel(r.path),
  }));
  const deviceChartData = (summary?.devices ?? []).map((r) => ({
    ...r,
    label: DEVICE_LABELS[r.device] ?? r.device,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">ভিজিটর অ্যানালিটিক্স</h1>
          <p className="text-xs text-muted-foreground">
            প্রতিদিন কতজন ভিজিট করেছে এবং কোন পেজে কতবার গেছে
          </p>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <Button
              key={r.days}
              size="sm"
              variant={rangeDays === r.days ? "default" : "outline"}
              onClick={() => setRangeDays(r.days)}
            >
              {r.label}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => load(rangeDays)} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="border-destructive/40 p-4 text-sm text-destructive">
          ডেটা লোড করা যায়নি: {error}
        </Card>
      ) : null}

      {/* Totals */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Eye}
          label="মোট পেজ ভিউ"
          value={summary ? summary.total_views : null}
          tone="text-primary"
        />
        <StatCard
          icon={Users}
          label="মোট ভিজিটর (ইউনিক)"
          value={summary ? summary.total_visitors : null}
          tone="text-success"
        />
        <StatCard
          icon={TrendingUp}
          label={`দৈনিক গড় ভিউ (${RANGES.find((r) => r.days === rangeDays)?.label})`}
          value={summary ? avgDaily : null}
          tone="text-info"
        />
        <StatCard
          icon={MousePointerClick}
          label="সবচেয়ে জনপ্রিয় পেজ"
          value={null}
          text={topPage ? pathLabel(topPage.path) : "—"}
          tone="text-primary"
        />
      </div>

      {/* Daily chart */}
      <Card className="p-4">
        <h2 className="mb-4 font-semibold text-foreground">দৈনিক ভিজিটর ও পেজ ভিউ</h2>
        <div className="h-72 w-full">
          {loading ? (
            <ChartLoading />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 25)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} width={40} />
                <Tooltip
                  formatter={(v) => toBnNum(Number(v))}
                  labelFormatter={(l) => `দিন: ${l}`}
                />
                <Legend
                  formatter={(v) => (v === "views" ? "পেজ ভিউ" : "ভিজিটর")}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke={C_PRIMARY}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke={C_SUCCESS}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Top pages */}
        <Card className="p-4 lg:col-span-3">
          <h2 className="mb-4 font-semibold text-foreground">সবচেয়ে বেশি দেখা পেজ</h2>
          <div className="h-72 w-full">
            {loading ? (
              <ChartLoading />
            ) : pageChartData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pageChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.005 25)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    width={110}
                  />
                  <Tooltip formatter={(v) => toBnNum(Number(v))} />
                  <Bar dataKey="views" fill={C_PRIMARY} radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Devices */}
        <Card className="p-4 lg:col-span-2">
          <h2 className="mb-4 font-semibold text-foreground">ডিভাইস</h2>
          <div className="h-72 w-full">
            {loading ? (
              <ChartLoading />
            ) : deviceChartData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceChartData}
                    dataKey="views"
                    nameKey="label"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {deviceChartData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => toBnNum(Number(v))} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <p className="text-[11px] text-muted-foreground">
        ভিজিটর = আলাদা ব্রাউজার সেশন (একই মানুষ দিনে একাধিকবার খুললে ১ ভিজিটর)। কোনো ব্যক্তিগত
        তথ্য বা IP ঠিকানা সংরক্ষণ করা হয় না।
      </p>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  text,
  tone,
}: {
  icon: typeof Eye;
  label: string;
  value: number | null;
  text?: string;
  tone: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${tone}`} />
      </div>
      <div className="mt-2 text-2xl font-bold text-foreground">
        {text ? text : value === null || value === undefined ? "—" : toBnNum(value)}
      </div>
    </Card>
  );
}

function ChartLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      এই সময়ে কোনো ডেটা নেই।
    </div>
  );
}
