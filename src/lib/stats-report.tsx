import type { RefObject } from "react";
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
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import logo from "@/assets/logo.png";
import { toBnNum } from "@/lib/supabase";

// ---- Shared types ---------------------------------------------------------

export interface DailyRow {
  day: string;
  visitors: number;
  views: number;
}
export interface PageRow {
  path: string;
  views: number;
  visitors: number;
}
export interface DeviceRow {
  device: string;
  views: number;
}
export interface StatsSummary {
  total_views: number;
  total_visitors: number;
  daily: DailyRow[];
  top_pages: PageRow[];
  devices: DeviceRow[];
}

// ---- Colors (literal values so the canvas capture never depends on CSS) ----

const C_PRIMARY = "#c0392b";
const C_SUCCESS = "#1f9d63";
const PIE_COLORS = [C_PRIMARY, C_SUCCESS, "#3567b0", "#b07f1e"];
const GRID = "#e8e2e0";
const TEXT = "#212121";
const MUTED = "#6b7280";
const CARD_BG = "#faf6f5";
const BORDER = "#eadcd9";

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

function bnDay(day: string): string {
  const [, m, d] = day.split("-");
  return toBnNum(`${d}/${m}`);
}

/** Short Bengali date, e.g. "৫ নভেম্বর, ২০২৬" (site timezone). */
export function bnDateNow(): string {
  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "long",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

// ---- Report layout (rendered off-screen, captured to PDF) ------------------

export interface StatsReportProps {
  rangeLabel: string;
  fromDate: string;
  toDate: string;
  totalViews: number;
  totalVisitors: number;
  avgDaily: number;
  daily: DailyRow[];
  topPages: PageRow[];
  devices: DeviceRow[];
}

export function StatsReport(props: StatsReportProps) {
  const dailyData = props.daily.map((r) => ({ ...r, label: bnDay(r.day) }));
  const pageData = props.topPages.map((r) => ({
    ...r,
    label: PATH_LABELS[r.path] ?? r.path,
  }));
  const deviceData = props.devices.map((r) => ({
    ...r,
    label: DEVICE_LABELS[r.device] ?? r.device,
  }));

  return (
    <div style={{ width: 794, background: "#ffffff", color: TEXT, fontFamily: '"Hind Siliguri", "Noto Sans Bengali", sans-serif' }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "26px 40px 18px",
          borderBottom: `3px solid ${C_PRIMARY}`,
        }}
      >
        <img src={logo} alt="" style={{ width: 52, height: 52, objectFit: "contain" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.25 }}>
            RoktoFinder — সাইট পরিসংখ্যান রিপোর্ট
          </div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>
            roktofinder.com · নির্বাচিত সময়সীমা: {props.rangeLabel} ({props.fromDate} –{" "}
            {props.toDate})
          </div>
        </div>
        <div style={{ fontSize: 12, color: MUTED, textAlign: "right" }}>
          তৈরি: {bnDateNow()}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 14, padding: "20px 40px 0" }}>
        <SummaryCard label="মোট পেজ ভিউ" value={props.totalViews} color={C_PRIMARY} />
        <SummaryCard label="মোট ভিজিটর (ইউনিক)" value={props.totalVisitors} color={C_SUCCESS} />
        <SummaryCard label={`দৈনিক গড় ভিউ (${props.rangeLabel})`} value={props.avgDaily} color="#3567b0" />
      </div>

      {/* Daily chart */}
      <ChartCard title="দৈনিক ভিজিটর ও পেজ ভিউ">
        <LineChart width={690} height={270} data={dailyData} margin={{ top: 5, right: 15, left: -5, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: MUTED }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: MUTED }} allowDecimals={false} width={38} />
          <Tooltip formatter={(v) => toBnNum(Number(v))} />
          <Legend formatter={(v) => (v === "views" ? "পেজ ভিউ" : "ভিজিটর")} wrapperStyle={{ fontSize: 11, color: TEXT }} />
          <Line type="monotone" dataKey="views" stroke={C_PRIMARY} strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="visitors" stroke={C_SUCCESS} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ChartCard>

      {/* Top pages + devices */}
      <div style={{ display: "flex", gap: 14, padding: "0 40px" }}>
        <ChartCard title="সবচেয়ে বেশি দেখা পেজ" style={{ width: 420 }}>
          <BarChart
            width={340}
            height={250}
            data={pageData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: MUTED }} allowDecimals={false} />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 10, fill: TEXT }} width={100} />
            <Bar dataKey="views" fill={C_PRIMARY} radius={[0, 4, 4, 0]} barSize={14} isAnimationActive={false} />
          </BarChart>
        </ChartCard>

        <ChartCard title="ডিভাইস" style={{ width: 280 }}>
          <PieChart width={240} height={250}>
            <Pie
              data={deviceData}
              dataKey="views"
              nameKey="label"
              cx="50%"
              cy="45%"
              innerRadius={48}
              outerRadius={78}
              paddingAngle={2}
              isAnimationActive={false}
            >
              {deviceData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Legend wrapperStyle={{ fontSize: 11, color: TEXT }} />
          </PieChart>
        </ChartCard>
      </div>

      {/* Footer note */}
      <div
        style={{
          margin: "18px 40px 26px",
          padding: "10px 14px",
          background: CARD_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          fontSize: 11,
          color: MUTED,
          lineHeight: 1.6,
        }}
      >
        ভিজিটর = আলাদা ব্রাউজার সেশন (একই মানুষ দিনে একাধিকবার খুললে ১ ভিজিটর)। কোনো ব্যক্তিগত
        তথ্য বা IP ঠিকানা সংরক্ষণ করা হয় না; এই রিপোর্টে শুধুমাত্র সামগ্রিক সংখ্যা আছে।
        যোগাযোগ: roktofinder@gmail.com
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        flex: 1,
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: "12px 16px",
      }}
    >
      <div style={{ fontSize: 12, color: MUTED }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, marginTop: 4 }}>{toBnNum(value)}</div>
    </div>
  );
}

function ChartCard({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        marginTop: 18,
        flex: 1,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: "14px 16px",
        ...style,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

// ---- PDF generation ---------------------------------------------------------

/** Trigger a client-side blob download. */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/**
 * Capture the off-screen report container and save it as an A4 PDF
 * (multi-page if the report is taller than one page).
 */
export async function generateStatsPdf(container: RefObject<HTMLElement | null>, filename: string): Promise<void> {
  const el = container.current;
  if (!el) throw new Error("report container missing");

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });

  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const pxPerPt = canvas.width / pageW;
  const pageHpx = Math.floor(pageH * pxPerPt);

  let offset = 0;
  let page = 0;
  while (offset < canvas.height) {
    const sliceH = Math.min(pageHpx, canvas.height - offset);
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = sliceH;
    const ctx = slice.getContext("2d");
    if (!ctx) throw new Error("canvas context missing");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(canvas, 0, offset, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

    if (page > 0) pdf.addPage();
    pdf.addImage(slice.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, pageW, sliceH / pxPerPt);
    offset += sliceH;
    page += 1;
  }

  downloadBlob(pdf.output("blob"), filename);
}
