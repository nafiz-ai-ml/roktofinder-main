import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldPlus, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  supabaseAdminAuth,
  adminErrorBn,
  ADMIN_ROLE_LABEL,
  type AdminRole,
  type AdminUser,
} from "@/lib/admin";

export const Route = createFileRoute("/admin/admins")({
  head: () => ({
    meta: [
      { title: "অ্যাডমিন ব্যবস্থাপনা — RoktoFinder" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell requireSuperAdmin>{(admin) => <AdminsPage self={admin} />}</AdminShell>
  ),
});

const ROLES: AdminRole[] = ["super_admin", "admin", "moderator", "volunteer"];

function AdminsPage({ self }: { self: AdminUser }) {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabaseAdminAuth
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: true });
    setRows((data as AdminUser[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const grant = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabaseAdminAuth.rpc("admin_grant_admin", {
      _email: email.trim().toLowerCase(),
      _role: role,
      _full_name: fullName.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error(adminErrorBn(error.message));
      return;
    }
    toast.success("অনুমতি দেওয়া হয়েছে");
    setEmail("");
    setFullName("");
    load();
  };

  const toggleActive = async (row: AdminUser) => {
    const { error } = await supabaseAdminAuth.rpc("admin_set_admin_active", {
      _user_id: row.user_id,
      _active: !row.is_active,
    });
    if (error) {
      toast.error(adminErrorBn(error.message));
      return;
    }
    toast.success(row.is_active ? "নিষ্ক্রিয় করা হয়েছে" : "সক্রিয় করা হয়েছে");
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">অ্যাডমিন ব্যবস্থাপনা</h1>
        <p className="text-xs text-muted-foreground">
          অনুমতি দেওয়ার আগে ব্যক্তির Supabase Auth অ্যাকাউন্ট তৈরি থাকতে হবে।
        </p>
      </div>

      <Card className="p-4">
        <h2 className="font-semibold text-foreground">নতুন অ্যাডমিন যোগ করুন</h2>
        <form onSubmit={grant} className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="grant-email">ইমেইল</Label>
            <Input
              id="grant-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="grant-name">নাম</Label>
            <Input
              id="grant-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="নাম (ঐচ্ছিক)"
            />
          </div>
          <div className="space-y-1.5">
            <Label>রোল</Label>
            <Select value={role} onValueChange={(v) => setRole(v as AdminRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {ADMIN_ROLE_LABEL[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-4">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldPlus className="h-4 w-4" />
              )}
              অনুমতি দিন
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold text-foreground">টিম</h2>
        {loading ? (
          <div className="py-8 text-center">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-border/60">
            {rows.map((r) => (
              <li key={r.user_id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">
                    {r.full_name || r.email}
                    {r.user_id === self.user_id && (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                        আপনি
                      </span>
                    )}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {r.email} · {ADMIN_ROLE_LABEL[r.role]} ·{" "}
                    {r.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </div>
                </div>
                {r.user_id !== self.user_id && (
                  <Button
                    size="sm"
                    variant={r.is_active ? "outline" : "default"}
                    onClick={() => toggleActive(r)}
                  >
                    {r.is_active ? (
                      <>
                        <UserX className="h-4 w-4" />
                        নিষ্ক্রিয়
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4" />
                        সক্রিয়
                      </>
                    )}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
