import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { supabaseAdminAuth } from "@/lib/admin";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "অ্যাডমিন লগইন — RoktoFinder" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Already signed in? go straight to the panel
  useEffect(() => {
    let cancelled = false;
    supabaseAdminAuth.auth.getUser().then(({ data }) => {
      if (!cancelled && data.user) navigate({ to: "/admin", replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabaseAdminAuth.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error || !data.user) {
      setLoading(false);
      toast.error("ইমেইল বা পাসওয়ার্ড সঠিক নয়");
      return;
    }

    const { data: row } = await supabaseAdminAuth
      .from("admin_users")
      .select("user_id, is_active")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (!row || !row.is_active) {
      await supabaseAdminAuth.auth.signOut();
      setLoading(false);
      toast.error("এই অ্যাকাউন্টটি অ্যাডমিন হিসেবে অনুমোদিত নয়");
      return;
    }

    toast.success("স্বাগতম!");
    navigate({ to: "/admin", replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background px-4">
      <Card className="w-full max-w-sm p-6">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="RoktoFinder" className="h-14 w-14 object-contain" />
          <h1 className="mt-3 text-xl font-bold text-foreground">অ্যাডমিন লগইন</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            শুধুমাত্র অনুমোদিত RoktoFinder টিম সদস্যদের জন্য
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-email">ইমেইল</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">পাসওয়ার্ড</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            লগইন
          </Button>
        </form>
      </Card>
    </div>
  );
}
