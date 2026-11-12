import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { Eye, Users, TrendingUp, RefreshCw, Loader2, BarChart3, FileDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase, toBnNum } from "@/lib/supabase";
import {
  StatsReport,
  generateStatsPdf,
  type DailyRow,
  type StatsSummary,
} from "@/lib/stats-report";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "সাইট পরিসংখ্যান — RoktoFinder" },
      {
        name: "description",
        content:
          "RoktoFinder সাইটের পাবলিক ভিজিটর পরিসংখ্যান — প্রতিদিন কতজন ভিজিট করেছে, কোন পেজ সবচেয়ে বেশি দেখা হয়েছে। সম্পূর্ণ অ্যানোনিমাস, কোনো ব্যক্তিগত তথ্য নেই।",
      },
      { property: "og:title", content: "সাইট পরিসংখ্যান — RoktoFinder" },
      {
        property: "og:description",
        content:
          "প্রতিদিন কতজন ভিজিট করেছে, কোন পেজ সবচেয়ে বেশি দেখা হয়েছে — RoktoFinder-এর পাবলিক পরিসংখ্যান।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StatsPage,
});

// ---- Page -----------------------------------------------------------------

const RANGES = [
  { days: 7, label: "৭ দিন" },
  { days: 30, label: "৩০ দিন" },
  { days: 90, label: "৯০ দিন" },
] as const;

// Chart colors (match the site theme tokens; recharts can't read CSS vars)
const C_PRIMARY = "oklch(0.58 0.22 27)";
const C_SUCCESS = "oklch(0.62 0.16 152)";
const PIE_COLORS = [C_PRIMARY, C_SUCCESS, "oklch(0.6 0.12 250)", "oklch(0.65 0.15 80)"];

const PATH_LABELS: Record<string, string> = {
  "/": "হোম",
  "/directory": "ডিরেক্টরি",
  "/register": "ডোনার হন",
  "/emergency": "জরুরি রক্ত",
  "/about": "আমাদের সম্পর্কে",
  "/help": "সাহায্য",
  "/privacy": "প্রাইভেসি",
  "/stats": "পরিসংখ্যান",
  "/dashboard": "ডোনার ড্যাশবোর্ড",
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

function StatsPage() {
  const [rangeDays, setRangeDays] = useState<number>(30);
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async (days: number) => {
    setLoading(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc("public_site_stats", {
      _from: dhakaDate(days - 1),
      _to: dhakaToday(),
    });
    if (rpcError) {
      setError(rpcError.message);
    } else {
      setSummary(data as StatsSummary);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load(rangeDays);
  }, [rangeDays, load]);

  const downloadReport = useCallback(async () => {
    if (!summary) return;
    setGenerating(true);
    try {
      await generateStatsPdf(reportRef, `roktofinder-stats-${rangeDays}d.pdf`);
    } finally {
      setGenerating(false);
    }
  }, [summary, rangeDays]);

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

  const dailyChartData = daily.map((r) => ({ ...r, label: bnDay(r.day) }));
  const pageChartData = (summary?.top_pages ?? []).map((r) => ({
    ...r,
    label: pathLabel(r.path),
  }));
  const deviceChartData = (summary?.devices ?? []).map((r) => ({
    ...r,
    label: DEVICE_LABELS[r.device] ?? r.device,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BarChart3 className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">সাইট পরিসংখ্যান</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          RoktoFinder-এ প্রতিদিন কতজন ভিজিট করেছে এবং কোন পেজ সবচেয়ে বেশি দেখা হয়েছে
        </p>
      </div>

      {/* Range selector */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
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
        {summary && !loading ? (
          <Button size="sm" onClick={downloadReport} disabled={generating}>
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            PDF রিপোর্ট ডাউনলোড
          </Button>
        ) : null}
      </div>

      {error ? (
        <Card className="border-destructive/40 p-4 text-center text-sm text-destructive">
          ডেটা লোড করা যায়নি। সাইট অ্যাডমিন পরিসংখ্যান সেটআপ সম্পূর্ণ না করা পর্যন্ত এখানে ডেটা
          দেখা যাবে না।
        </Card>
      ) : null}

      {/* Totals */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={Eye} label="মোট পেজ ভিউ" value={summary ? summary.total_views : null} tone="text-primary" />
        <StatCard icon={Users} label="মোট ভিজিটর (ইউনিক)" value={summary ? summary.total_visitors : null} tone="text-success" />
        <StatCard
          icon={TrendingUp}
          label={`দৈনিক গড় ভিউ (${RANGES.find((r) => r.days === rangeDays)?.label})`}
          value={summary ? avgDaily : null}
          tone="text-info"
        />
      </div>

      {/* Daily chart */}
      <Card className="mt-4 p-4">
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
                <Tooltip formatter={(v) => toBnNum(Number(v))} labelFormatter={(l) => `দিন: ${l}`} />
                <Legend
                  formatter={(v) => (v === "views" ? "পেজ ভিউ" : "ভিজিটর")}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Line type="monotone" dataKey="views" stroke={C_PRIMARY} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="visitors" stroke={C_SUCCESS} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
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
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={110} />
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

      <p className="mt-8 text-center text-[11px] text-muted-foreground">
        ভিজিটর = আলাদা ব্রাউজার সেশন (একই মানুষ দিনে একাধিকবার খুললে ১ ভিজিটর)। কোনো ব্যক্তিগত
        তথ্য বা IP ঠিকানা সংরক্ষণ করা হয় না এবং এখানে শুধুমাত্র সামগ্রিক সংখ্যা দেখানো হয়।
      </p>

      {/* Off-screen report container captured into the PDF download */}
      {summary ? (
        <div
          ref={reportRef}
          aria-hidden
          style={{ position: "fixed", left: "-10000px", top: 0, zIndex: -1, pointerEvents: "none" }}
        >
          <StatsReport
            rangeLabel={RANGES.find((r) => r.days === rangeDays)?.label ?? `${rangeDays} দিন`}
            fromDate={dhakaDate(rangeDays - 1)}
            toDate={dhakaToday()}
            totalViews={summary.total_views}
            totalVisitors={summary.total_visitors}
            avgDaily={avgDaily}
            daily={daily}
            topPages={summary.top_pages}
            devices={summary.devices}
          />
        </div>
      ) : null}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Eye;
  label: string;
  value: number | null;
  tone: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${tone}`} />
      </div>
      <div className="mt-2 text-2xl font-bold text-foreground">
        {value === null || value === undefined ? "—" : toBnNum(value)}
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
