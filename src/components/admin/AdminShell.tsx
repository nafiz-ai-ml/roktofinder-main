import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutDashboard, Users, ShieldCheck, BarChart3, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import { supabaseAdminAuth, ADMIN_ROLE_LABEL, type AdminUser } from "@/lib/admin";

const NAV = [
  { to: "/admin", label: "ওভারভিউ", icon: LayoutDashboard, exact: true },
  { to: "/admin/analytics", label: "ভিজিটর অ্যানালিটিক্স", icon: BarChart3, exact: false },
  { to: "/admin/donors", label: "ডোনার ডিরেক্টরি", icon: Users, exact: false },
  { to: "/admin/admins", label: "অ্যাডমিন", icon: ShieldCheck, exact: false },
] as const;

/**
 * Client-side admin gate. Renders children only for an authenticated,
 * active admin_users row. Every write is additionally enforced
 * server-side by the SECURITY DEFINER RPCs + RLS.
 */
export function AdminShell({
  children,
  requireSuperAdmin,
}: {
  children: (admin: AdminUser) => ReactNode;
  requireSuperAdmin?: boolean;
}) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "denied">("loading");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data: userData } = await supabaseAdminAuth.auth.getUser();
      if (cancelled) return;
      if (!userData.user) {
        navigate({ to: "/admin/login", replace: true });
        return;
      }
      const { data, error } = await supabaseAdminAuth
        .from("admin_users")
        .select("*")
        .eq("user_id", userData.user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data || !data.is_active) {
        setState("denied");
        return;
      }
      setAdmin(data as AdminUser);
      setState("ready");
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const signOut = async () => {
    await supabaseAdminAuth.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (state === "denied" || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-bold text-foreground">প্রবেশাধিকার নেই</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            এই অ্যাকাউন্টটি RoktoFinder অ্যাডমিন হিসেবে অনুমোদিত নয়।
          </p>
          <Button className="mt-5" onClick={signOut}>
            লগআউট
          </Button>
        </div>
      </div>
    );
  }

  if (requireSuperAdmin && admin.role !== "super_admin") {
    return (
      <AdminChrome admin={admin} onSignOut={signOut}>
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <h2 className="font-semibold text-foreground">শুধু সুপার অ্যাডমিন</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            এই পেজটি দেখতে সুপার অ্যাডমিন অনুমতি প্রয়োজন।
          </p>
        </div>
      </AdminChrome>
    );
  }

  return (
    <AdminChrome admin={admin} onSignOut={signOut}>
      {children(admin)}
    </AdminChrome>
  );
}

function AdminChrome({
  admin,
  onSignOut,
  children,
}: {
  admin: AdminUser;
  onSignOut: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={logo} alt="RoktoFinder" className="h-10 w-10 object-contain" />
            <div className="leading-tight">
              <div className="text-base font-bold text-foreground">অ্যাডমিন প্যানেল</div>
              <div className="text-[10px] text-muted-foreground">
                {admin.full_name || admin.email} · {ADMIN_ROLE_LABEL[admin.role]}
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={onSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">লগআউট</span>
            </Button>
          </div>
        </div>
        <nav className="container mx-auto flex gap-1 overflow-x-auto px-4 pb-2">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact }}
              activeProps={{ className: "bg-primary/10 text-primary" }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
