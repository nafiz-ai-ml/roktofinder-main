import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LogIn, User, LogOut, Lock, CalendarPlus, Eye, EyeOff, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  supabase,
  toBnNum,
  type Donor,
  type EmergencyRequest,
} from "@/lib/supabase";
import { computeDonorMetrics, computeFreshness } from "@/lib/donor-metrics";
import { AvailabilityConfirmCard } from "@/components/dashboard/AvailabilityConfirmCard";

import { ProfileSummary } from "@/components/dashboard/ProfileSummary";
import { DonationTracker } from "@/components/dashboard/DonationTracker";
import {
  NotificationCenter,
  type NotificationItem,
} from "@/components/dashboard/NotificationCenter";
import { NearbyRequests } from "@/components/dashboard/NearbyRequests";
import {
  SettingsPanel,
  type DonorSettings,
} from "@/components/dashboard/SettingsPanel";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "ডোনার ড্যাশবোর্ড — RoktoFinder" },
      {
        name: "description",
        content: "আপনার রক্তদান, ব্যাজ, এলাকার অনুরোধ ও সেটিংস এক জায়গায়।",
      },
      { property: "og:title", content: "ডোনার ড্যাশবোর্ড — RoktoFinder" },
      {
        property: "og:description",
        content: "আপনার প্রভাব, ব্যাজ, এবং নোটিফিকেশন এক ক্লিকে দেখুন।",
      },
    ],
  }),
  component: DashboardPage,
});

const SETTINGS_KEY = "rf_donor_settings_v1";
const SESSION_KEY = "rf_donor_session_v1";

function loadSettings(): DonorSettings {
  if (typeof localStorage === "undefined") {
    return { notificationsOn: true };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DonorSettings>;
      return { notificationsOn: parsed.notificationsOn ?? true };
    }
  } catch {
    /* ignore */
  }
  return { notificationsOn: true };
}

interface SavedSession {
  donor: Donor;
  /** short-lived server-issued session token — never the raw password */
  token: string;
}

function loadSession(): { session: SavedSession; remember: boolean } | null {
  if (typeof window === "undefined") return null;
  try {
    const local = localStorage.getItem(SESSION_KEY);
    if (local) {
      const parsed = JSON.parse(local) as Partial<SavedSession>;
      if (parsed.token && parsed.donor) {
        return { session: parsed as SavedSession, remember: true };
      }
      localStorage.removeItem(SESSION_KEY); // legacy password-based session
    }
    const sess = sessionStorage.getItem(SESSION_KEY);
    if (sess) {
      const parsed = JSON.parse(sess) as Partial<SavedSession>;
      if (parsed.token && parsed.donor) {
        return { session: parsed as SavedSession, remember: false };
      }
      sessionStorage.removeItem(SESSION_KEY);
    }
  } catch {
    /* ignore */
  }
  return null;
}

function saveSession(s: SavedSession | null, remember: boolean) {
  if (typeof window === "undefined") return;
  try {
    // Always clear both first to avoid stale duplicates
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    if (s) {
      const store = remember ? localStorage : sessionStorage;
      store.setItem(SESSION_KEY, JSON.stringify(s));
    }
  } catch {
    /* ignore */
  }
}

function DashboardPage() {
  const initialSession = typeof window !== "undefined" ? loadSession() : null;
  const [phone, setPhone] = useState(initialSession?.session.donor.phone ?? "");
  const [password, setPassword] = useState("");
  const [sessionToken, setSessionToken] = useState(initialSession?.session.token ?? "");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(initialSession?.remember ?? true);
  const [donor, setDonor] = useState<Donor | null>(initialSession?.session.donor ?? null);
  const [draft, setDraft] = useState<Donor | null>(initialSession?.session.donor ?? null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [saving, setSaving] = useState(false);

  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [settings, setSettings] = useState<DonorSettings>(loadSettings);

  const [donationDialog, setDonationDialog] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotContact, setForgotContact] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [newDonationDate, setNewDonationDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^01[3-9]\d{8}$/.test(forgotPhone)) {
      toast.error("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন");
      return;
    }
    setForgotSubmitting(true);
    const { data, error } = await supabase.rpc("request_password_reset", {
      _phone: forgotPhone,
      _contact_info: forgotContact || null,
    });
    setForgotSubmitting(false);
    if (error) {
      toast.error("অনুরোধ পাঠানো যায়নি: " + error.message);
      return;
    }
    if (data === false) {
      toast.error("এই নম্বর দিয়ে কোনো ডোনার নিবন্ধিত নয়");
      return;
    }
    toast.success("✅ অনুরোধ পেয়েছি! যাচাই করে সম্ভব দ্রুততম সময়ে যোগাযোগ করব।");
    setForgotOpen(false);
    setForgotPhone("");
    setForgotContact("");
  };

  const metrics = useMemo(
    () => (donor ? computeDonorMetrics(donor) : null),
    [donor],
  );

  const freshness = useMemo(() => (donor ? computeFreshness(donor) : null), [donor]);

  const confirmAvailability = async (available: boolean) => {
    if (!donor) return;
    setSaving(true);
    const { data, error } = await supabase.rpc("confirm_availability", {
      _token: sessionToken,
      _available: available,
      _source: "dashboard",
    });
    setSaving(false);
    if (error) {
      toast.error("নিশ্চিত করা যায়নি: " + error.message);
      return;
    }
    const row = Array.isArray(data) ? (data[0] as Donor | undefined) : (data as Donor | null);
    if (row) {
      setDonor(row);
      setDraft((d) => (d ? { ...d, ...row } : d));
    }
    toast.success(
      available ? "✅ আপনার উপলব্ধতা নিশ্চিত হয়েছে" : "আপনাকে অনুপলব্ধ হিসেবে রাখা হলো",
    );
  };


  // Auto-set unavailable if not eligible
  useEffect(() => {
    if (!donor || !draft || !metrics) return;
    if (!metrics.isEligible && draft.is_available) {
      setDraft({ ...draft, is_available: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics?.isEligible]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  // Load nearby (same blood group OR same area) requests after login
  useEffect(() => {
    if (!donor) return;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase
        .from("emergency_requests_public")
        .select("*")
        .eq("is_active", true)
        .or(`blood_group.eq.${donor.blood_group},location.ilike.%${donor.area ?? ""}%`)
        .order("created_at", { ascending: false })
        .limit(10);
      if (!cancelled && data) setRequests(data as EmergencyRequest[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [donor]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      toast.error("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন");
      return;
    }
    if (password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }
    setLoggingIn(true);
    const { data, error } = await supabase.rpc("donor_login", {
      _phone: phone,
      _password: password,
    });
    setLoggingIn(false);
    if (error) {
      toast.error("লগইন ব্যর্থ: " + error.message);
      return;
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) {
      toast.error("ভুল মোবাইল নম্বর অথবা পাসওয়ার্ড");
      return;
    }
    const { session_token: token, ...rest } = row as Donor & { session_token: string };
    const loggedDonor = rest as Donor;
    setDonor(loggedDonor);
    setDraft(loggedDonor);
    setSessionToken(token);
    setPassword("");
    saveSession({ donor: loggedDonor, token }, rememberMe);
    toast.success("সফলভাবে লগইন হয়েছে");
  };

  const logout = () => {
    if (sessionToken) void supabase.rpc("donor_logout", { _token: sessionToken });
    setSessionToken("");
    setDonor(null);
    setDraft(null);
    setPassword("");
    setPhone("");
    setRequests([]);
    saveSession(null, false);
  };

  const save = async () => {
    if (!donor || !draft) return;
    setSaving(true);
    const { data, error } = await supabase.rpc("update_donor_profile_v2", {
      _token: sessionToken,
      _name: draft.name,
      _blood_group: draft.blood_group,
      _address: draft.address,
      _area: draft.area,
      _last_donation_date: draft.last_donation_date,
      _is_available: draft.is_available,
      _phone_visible: draft.phone_visible ?? true,
    });
    setSaving(false);
    if (error) {
      toast.error("আপডেট ব্যর্থ: " + error.message);
      return;
    }
    const row = Array.isArray(data) ? data[0] : data;
    const updated = (row ?? draft) as Donor;
    setDonor(updated);
    setDraft(updated);
    saveSession({ donor: updated, token: sessionToken }, rememberMe);
    toast.success("প্রোফাইল আপডেট হয়েছে ✓");
  };

  // Quick toggle helper for settings panel — saves immediately
  const quickUpdate = async (patch: Partial<Donor>) => {
    if (!donor) return;
    const next = { ...donor, ...patch } as Donor;
    setDonor(next);
    setDraft((d) => (d ? { ...d, ...patch } : d));
    setSaving(true);
    const { data, error } = await supabase.rpc("update_donor_profile_v2", {
      _token: sessionToken,
      _name: next.name,
      _blood_group: next.blood_group,
      _address: next.address,
      _area: next.area,
      _last_donation_date: next.last_donation_date,
      _is_available: next.is_available,
      _phone_visible: next.phone_visible ?? true,
    });
    setSaving(false);
    if (error) {
      toast.error("আপডেট ব্যর্থ: " + error.message);
      // rollback
      setDonor(donor);
      setDraft((d) => (d ? { ...d, ...donor } : d));
      return;
    }
    const row = Array.isArray(data) ? data[0] : data;
    const updated = (row ?? next) as Donor;
    setDonor(updated);
    setDraft(updated);
    saveSession({ donor: updated, token: sessionToken }, rememberMe);
    toast.success("সেটিংস সংরক্ষিত ✓");
  };

  const submitNewDonation = async () => {
    if (!donor) return;
    setSaving(true);
    const { data, error } = await supabase.rpc("record_donation_v2", {
      _token: sessionToken,
      _donation_date: newDonationDate,
    });
    setSaving(false);
    if (error) {
      toast.error("আপডেট ব্যর্থ: " + error.message);
      return;
    }
    const row = Array.isArray(data) ? data[0] : data;
    const fallback: Donor = {
      ...donor,
      last_donation_date: newDonationDate,
      is_available: false,
      donation_count: (donor.donation_count ?? 0) + 1,
    };
    const updated = (row ?? fallback) as Donor;
    setDonor(updated);
    setDraft(updated);
    saveSession({ donor: updated, token: sessionToken }, rememberMe);
    setDonationDialog(false);
    toast.success(
      `রক্তদান রেকর্ড হয়েছে ❤️ মোট: ${toBnNum(updated.donation_count)} বার`,
    );
  };

  // Build derived notifications from nearby requests
  const notifications: NotificationItem[] = useMemo(() => {
    if (!donor || !metrics) return [];
    const items: NotificationItem[] = requests.slice(0, 3).map((r) => ({
      id: r.id,
      type: "request" as const,
      title: `${r.blood_group} রক্তের জরুরি প্রয়োজন`,
      description: `${r.location} — ${r.patient_name}`,
      time: r.created_at,
      area: r.location,
    }));
    if (!metrics.isEligible && metrics.daysUntilEligible <= 14) {
      items.push({
        id: "reminder-eligible",
        type: "reminder",
        title: "শীঘ্রই আবার দান করতে পারবেন",
        description: `আর মাত্র ${metrics.daysUntilEligible} দিন বাকি`,
        time: new Date().toISOString(),
      });
    }
    return items;
  }, [requests, donor, metrics]);


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {!donor && (
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-3xl font-bold text-foreground">ডোনার ড্যাশবোর্ড</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                আপনার মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে লগইন করুন।
              </p>
            </div>

            <Card className="p-6 md:p-8">
              <form onSubmit={login} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lphone">মোবাইল নম্বর</Label>
                  <Input
                    id="lphone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={11}
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lpass">পাসওয়ার্ড</Label>
                  <div className="relative">
                    <Input
                      id="lpass"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    নিবন্ধনের সময় দেওয়া পাসওয়ার্ড।
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(v === true)}
                  />
                  <Label
                    htmlFor="remember"
                    className="cursor-pointer text-sm font-normal text-muted-foreground"
                  >
                    আমাকে মনে রাখুন (পরবর্তীতে স্বয়ংক্রিয় লগইন)
                  </Label>
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loggingIn}>
                  <LogIn className="h-4 w-4" />
                  {loggingIn ? "লগইন হচ্ছে..." : "লগইন করুন"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPhone(phone);
                      setForgotOpen(true);
                    }}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  এখনো নিবন্ধিত নন?{" "}
                  <a href="/register" className="text-primary hover:underline">
                    ডোনার হিসেবে যুক্ত হন
                  </a>
                </p>
              </form>
            </Card>
          </div>
        )}

        {donor && draft && metrics && (
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">আপনার ড্যাশবোর্ড</h1>
                <p className="text-sm text-muted-foreground">
                  স্বাগতম, আপনার সব তথ্য এক জায়গায়।
                </p>
              </div>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="h-4 w-4" />
                লগআউট
              </Button>
            </div>

            {/* Top: Profile */}
            <ProfileSummary
              donor={donor}
              draft={draft}
              setDraft={setDraft}
              onSave={save}
              saving={saving}
              status={metrics.status}
              completion={metrics.profileCompletion}
            />
            {/* Availability freshness */}
            {freshness && (
              <AvailabilityConfirmCard
                freshness={freshness}
                metrics={metrics}
                lastDonationDate={donor.last_donation_date}
                onConfirm={confirmAvailability}
                saving={saving}
              />
            )}


            {/* Middle: Donation tracker */}
            <DonationTracker metrics={metrics} onUpdate={() => setDonationDialog(true)} />

            {/* Bottom: Requests + Notifications */}
            <div className="grid gap-6 lg:grid-cols-2">
              <NearbyRequests requests={requests} />
              <NotificationCenter items={notifications} />
            </div>

            <SettingsPanel
              donor={donor}
              settings={settings}
              onSettingsChange={setSettings}
              onAvailabilityToggle={(v) => quickUpdate({ is_available: v })}
              saving={saving}
            />
          </div>
        )}
      </main>

      <Dialog open={donationDialog} onOpenChange={setDonationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5 text-primary" />
              রক্তদান আপডেট করুন
            </DialogTitle>
            <DialogDescription>
              নতুন রক্তদানের তারিখ দিন। ৯০ দিনের cooldown শুরু হবে।
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="ddate">রক্তদানের তারিখ</Label>
            <Input
              id="ddate"
              type="date"
              value={newDonationDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setNewDonationDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDonationDialog(false)}>
              <X className="h-4 w-4" />
              বাতিল
            </Button>
            <Button onClick={submitNewDonation} disabled={saving}>
              <Check className="h-4 w-4" />
              {saving ? "সংরক্ষণ..." : "নিশ্চিত করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              পাসওয়ার্ড রিসেট অনুরোধ
            </DialogTitle>
            <DialogDescription>
              আপনার নিবন্ধিত মোবাইল নম্বর দিন। আমরা যাচাই করে সম্ভব দ্রুততম সময়ে নতুন
              পাসওয়ার্ড আপনার নম্বরে / ইমেইলে পাঠিয়ে দেব ইনশাআল্লাহ।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitForgot} className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="fphone">নিবন্ধিত মোবাইল নম্বর *</Label>
              <Input
                id="fphone"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={forgotPhone}
                onChange={(e) => setForgotPhone(e.target.value)}
                maxLength={11}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fcontact">বিকল্প যোগাযোগ (ঐচ্ছিক)</Label>
              <Input
                id="fcontact"
                type="text"
                placeholder="ইমেইল বা WhatsApp নম্বর"
                value={forgotContact}
                onChange={(e) => setForgotContact(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                জরুরি না হলে আমরা এই মোবাইল নম্বরেই কল/SMS করব।
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setForgotOpen(false)}>
                বাতিল
              </Button>
              <Button type="submit" disabled={forgotSubmitting}>
                {forgotSubmitting ? "পাঠানো হচ্ছে..." : "অনুরোধ পাঠান"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
