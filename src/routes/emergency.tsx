import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AlertCircle, Phone, MapPin, Droplet, Clock, Plus, X, AlertTriangle, EyeOff, Eye, Trash2, Send } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BLOOD_GROUPS,
  supabase,
  type BloodGroup,
  type EmergencyRequest,
  bnTimeAgo,
  toBnNum,
  isRequestExpired,
} from "@/lib/supabase";
import { AnnouncementTicker } from "@/components/AnnouncementTicker";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "জরুরি রক্তের অনুরোধ — RoktoFinder" },
      {
        name: "description",
        content:
          "ময়মনসিংহে জরুরি রক্তের প্রয়োজন? রোগীর তথ্য ও রক্তের গ্রুপ দিয়ে এখনই অনুরোধ পোস্ট করুন — কাছাকাছি ডোনারদের কাছে দ্রুত পৌঁছাবে।",
      },
      { property: "og:title", content: "জরুরি রক্তের অনুরোধ — RoktoFinder" },
      {
        property: "og:description",
        content: "জরুরি রক্তের প্রয়োজনে কাছাকাছি ডোনারদের কাছে দ্রুত অনুরোধ পাঠান।",
      },
      { property: "og:url", content: "https://roktofinder.com/emergency" },
    ],
    links: [{ rel: "canonical", href: "https://roktofinder.com/emergency" }],
  }),
  component: EmergencyPage,
});

const schema = z.object({
  patient_name: z.string().trim().min(2).max(80),
  blood_group: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
  location: z.string().trim().min(2).max(120),
  hospital: z.string().trim().max(120).optional(),
  contact_phone: z.string().trim().regex(/^01[3-9]\d{8}$/, "সঠিক মোবাইল নম্বর দিন"),
  units_needed: z.number().min(1).max(20),
  message: z.string().trim().max(500).optional(),
});

const EDIT_TOKENS_KEY = "rf_emergency_edit_tokens_v1";

function readEditTokens(): Record<string, string> {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(EDIT_TOKENS_KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function rememberEditToken(id: string, token: string) {
  try {
    const all = readEditTokens();
    all[id] = token;
    localStorage.setItem(EDIT_TOKENS_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

function getEditToken(id: string): string | null {
  return readEditTokens()[id] ?? null;
}

function EmergencyPage() {
  const [requests, setRequests] = useState<EmergencyRequest[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [hideExpired, setHideExpired] = useState(true);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    patient_name: "",
    blood_group: "" as BloodGroup | "",
    location: "ময়মনসিংহ",
    hospital: "",
    contact_phone: "",
    units_needed: 1,
    message: "",
  });

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("emergency_requests_public")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(50);
    setRequests((data ?? []) as EmergencyRequest[]);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "তথ্য সঠিকভাবে দিন");
      return;
    }
    setLoading(true);
    const editToken =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const { data: inserted, error } = await supabase
      .from("emergency_requests")
      .insert({
        ...parsed.data,
        hospital: parsed.data.hospital || null,
        message: parsed.data.message || null,
        edit_token: editToken,
      })
      .select("id")
      .single();
    setLoading(false);
    if (error) {
      toast.error("পোস্ট ব্যর্থ: " + error.message);
      return;
    }
    if (inserted?.id) rememberEditToken(inserted.id, editToken);
    toast.success("জরুরি অনুরোধ পোস্ট করা হয়েছে");
    setForm({
      patient_name: "",
      blood_group: "" as BloodGroup | "",
      location: "ময়মনসিংহ",
      hospital: "",
      contact_phone: "",
      units_needed: 1,
      message: "",
    });
    setShowForm(false);
    fetchRequests();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <AnnouncementTicker
            variant="inline"
            badge="সতর্কতা"
            messages={[
              "⚠️ জরুরি অনুরোধ ২ দিন পর স্বয়ংক্রিয়ভাবে মুছে যাবে",
              "📞 সঠিক ও সক্রিয় ফোন নম্বর দিন — ডোনার সরাসরি কল করবেন",
              "🏥 হাসপাতালের নাম দিলে ডোনার সহজে পৌঁছাতে পারবেন",
            ]}
          />
        </div>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">জরুরি রক্তের অনুরোধ</h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              জরুরি অবস্থায় রক্তের অনুরোধ পোস্ট করুন। সকল সক্রিয় অনুরোধ এখানে দেখা যাবে।
            </p>
          </div>
          <Button
            onClick={() => setShowForm((v) => !v)}
            variant={showForm ? "outline" : "destructive"}
            size="lg"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "বাতিল" : "নতুন অনুরোধ"}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 p-6">
            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>রোগীর নাম *</Label>
                <Input
                  value={form.patient_name}
                  onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>রক্তের গ্রুপ *</Label>
                <Select
                  value={form.blood_group}
                  onValueChange={(v) => setForm({ ...form, blood_group: v as BloodGroup })}
                >
                  <SelectTrigger>
                    <Droplet className="h-4 w-4 text-primary" />
                    <SelectValue placeholder="নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>হাসপাতাল</Label>
                <Input
                  value={form.hospital}
                  onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                  placeholder="যেমন: ময়মনসিংহ মেডিকেল কলেজ"
                />
              </div>
              <div className="space-y-2">
                <Label>লোকেশন *</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>যোগাযোগ নম্বর *</Label>
                <Input
                  type="tel"
                  value={form.contact_phone}
                  onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  maxLength={11}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>প্রয়োজনীয় ব্যাগ *</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={form.units_needed}
                  onChange={(e) =>
                    setForm({ ...form, units_needed: parseInt(e.target.value) || 1 })
                  }
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>বার্তা</Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="অতিরিক্ত তথ্য..."
                  rows={3}
                  maxLength={500}
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" size="lg" variant="destructive" disabled={loading}>
                  <Send className="h-4 w-4" />
                  {loading ? "পোস্ট হচ্ছে..." : "অনুরোধ পোস্ট করুন"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {requests === null ? (
          <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>
        ) : (
          <>
            {(() => {
              const expiredCount = requests.filter((r) => isRequestExpired(r.created_at)).length;
              const visible = hideExpired
                ? requests.filter((r) => !isRequestExpired(r.created_at))
                : [...requests].sort((a, b) => {
                    const ea = isRequestExpired(a.created_at) ? 1 : 0;
                    const eb = isRequestExpired(b.created_at) ? 1 : 0;
                    return ea - eb;
                  });

              const handleRemove = async (id: string) => {
                const token = getEditToken(id);
                if (!token) {
                  toast.error("এই অনুরোধটি শুধু যিনি পোস্ট করেছেন তিনিই সরাতে পারবেন");
                  return;
                }
                setRemovingId(id);
                const { data: ok, error } = await supabase.rpc("close_emergency_request", {
                  _id: id,
                  _token: token,
                });
                setRemovingId(null);
                if (error) {
                  toast.error("সরানো ব্যর্থ: " + error.message);
                  return;
                }
                if (ok !== true) {
                  toast.error("এই অনুরোধটি সরানোর অনুমতি নেই");
                  return;
                }
                toast.success("অনুরোধ সরানো হয়েছে");
                fetchRequests();
              };

              return (
                <>
                  {expiredCount > 0 && (
                    <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-2.5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {hideExpired ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span>
                          {toBnNum(expiredCount)} টি মেয়াদোত্তীর্ণ অনুরোধ{" "}
                          {hideExpired ? "লুকানো আছে" : "দেখানো হচ্ছে"}
                        </span>
                      </div>
                      <Switch checked={!hideExpired} onCheckedChange={(v) => setHideExpired(!v)} />
                    </div>
                  )}

                  {visible.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                      <p className="text-muted-foreground">এই মুহূর্তে কোনো সক্রিয় জরুরি অনুরোধ নেই।</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {visible.map((r) => {
                        const expired = isRequestExpired(r.created_at);
                        return (
                          <Card
                            key={r.id}
                            className={`p-5 animate-fade-in-up ${
                              expired
                                ? "border-border/60 opacity-70"
                                : "border-destructive/40 hover:border-destructive/70 hover:shadow-[0_18px_50px_-10px_oklch(0.55_0.24_27/0.35),0_0_40px_-8px_oklch(0.55_0.24_27/0.25)]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  {expired ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-destructive">
                                      <AlertTriangle className="h-3 w-3" />
                                      মেয়াদোত্তীর্ণ
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-destructive">
                                      জরুরি
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {bnTimeAgo(r.created_at)}
                                  </span>
                                </div>
                                <h3 className="mt-2 truncate text-base font-semibold text-foreground">
                                  {r.patient_name}
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {toBnNum(r.units_needed ?? 1)} ব্যাগ প্রয়োজন
                                </p>
                              </div>
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.5_0.24_20)] font-bold text-primary-foreground">
                                {r.blood_group}
                              </div>
                            </div>

                            <div className="mt-3 space-y-1.5 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>
                                  {r.location}
                                  {r.hospital ? ` · ${r.hospital}` : ""}
                                </span>
                              </div>
                              {r.message && (
                                <p className="rounded-lg bg-muted/50 p-2 text-xs text-foreground">
                                  {r.message}
                                </p>
                              )}
                            </div>

                            {expired ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 w-full"
                                onClick={() => handleRemove(r.id)}
                                disabled={removingId === r.id}
                              >
                                <Trash2 className="h-4 w-4" />
                                {removingId === r.id ? "সরানো হচ্ছে..." : "অনুরোধ সরান"}
                              </Button>
                            ) : (
                              <Button asChild variant="destructive" size="sm" className="mt-4 w-full">
                                <a href={`tel:${r.contact_phone}`}>
                                  <Phone className="h-4 w-4" />
                                  এখনই কল করুন
                                </a>
                              </Button>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
