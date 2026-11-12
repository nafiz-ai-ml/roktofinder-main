import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, UserPlus, Droplet, Archive, Clock, RefreshCw, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminShell } from "@/components/admin/AdminShell";
import { toBnNum, bnTimeAgo } from "@/lib/supabase";
import {
  supabaseAdminAuth,
  ADMIN_ACTION_LABEL,
  type AdminDonorStats,
  type AdminActivityRow,
} from "@/lib/admin";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "অ্যাডমিন ওভারভিউ — RoktoFinder" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <AdminShell>{() => <AdminOverview />}</AdminShell>,
});

function AdminOverview() {
  const [stats, setStats] = useState<AdminDonorStats | null>(null);
  const [log, setLog] = useState<AdminActivityRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [statsRes, logRes] = await Promise.all([
      supabaseAdminAuth.rpc("admin_donor_stats"),
      supabaseAdminAuth
        .from("admin_activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    const row = Array.isArray(statsRes.data) ? statsRes.data[0] : statsRes.data;
    setStats((row as AdminDonorStats) ?? null);
    setLog((logRes.data as AdminActivityRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const cards = [
    { label: "মোট ডোনার", value: stats?.total, icon: Users },
    { label: "নিজে রেজিস্টার করা", value: stats?.self_registered, icon: UserPlus },
    { label: "অ্যাডমিন ডিরেক্টরি", value: stats?.directory, icon: Droplet },
    { label: "এখন উপলব্ধ", value: stats?.available_now, icon: Clock },
    { label: "৭ দিনে নতুন", value: stats?.recently_added, icon: UserPlus },
    { label: "আর্কাইভ", value: stats?.archived, icon: Archive },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">ওভারভিউ</h1>
          <p className="text-xs text-muted-foreground">ডোনার ডাটাবেস ও অ্যাডমিন কার্যক্রমের সারসংক্ষেপ</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          রিফ্রেশ
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">
              {c.value === undefined || c.value === null ? "—" : toBnNum(c.value)}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">সাম্প্রতিক অ্যাডমিন কার্যক্রম</h2>
          <Button asChild size="sm" variant="ghost">
            <Link to="/admin/donors">ডিরেক্টরি খুলুন</Link>
          </Button>
        </div>
        {log.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">এখনো কোনো কার্যক্রম নেই।</p>
        ) : (
          <ul className="mt-3 divide-y divide-border/60">
            {log.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="text-foreground">
                  {ADMIN_ACTION_LABEL[l.action] ?? l.action}
                  {l.details ? (
                    <span className="text-muted-foreground"> · {l.details}</span>
                  ) : null}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {bnTimeAgo(l.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
