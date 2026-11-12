import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Droplet, UserPlus, Lock, MapPin, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BLOOD_GROUPS,
  MYMENSINGH_AREA_GROUPS,
  supabase,
  getUserLocation,
  type BloodGroup,
  type UserCoords,
} from "@/lib/supabase";
import { AnnouncementTicker } from "@/components/AnnouncementTicker";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "ডোনার হিসেবে নিবন্ধন করুন — RoktoFinder" },
      {
        name: "description",
        content:
          "ময়মনসিংহের রক্তদাতা তালিকায় যুক্ত হন। নাম, রক্তের গ্রুপ ও এলাকা দিয়ে রেজিস্টার করে অন্যের জীবন বাঁচানোর সুযোগ নিন।",
      },
      { property: "og:title", content: "ডোনার হিসেবে নিবন্ধন করুন — RoktoFinder" },
      {
        property: "og:description",
        content: "RoktoFinder-এ ডোনার হিসেবে যুক্ত হয়ে জীবন বাঁচাতে সাহায্য করুন।",
      },
      { property: "og:url", content: "https://roktofinder.com/register" },
    ],
    links: [{ rel: "canonical", href: "https://roktofinder.com/register" }],
  }),
  component: RegisterPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)"),
  password: z
    .string()
    .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে")
    .max(72, "পাসওয়ার্ড সর্বোচ্চ ৭২ অক্ষরের হতে পারে"),
  blood_group: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
  address: z.string().trim().min(2).max(200),
  area: z.string().trim().max(80).optional(),
  last_donation_date: z.string().optional(),
  is_available: z.boolean(),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [coords, setCoords] = useState<UserCoords | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    blood_group: "" as BloodGroup | "",
    address: "কেওয়াটখালি, ময়মনসিংহ",
    area: "কেওয়াটখালি",
    last_donation_date: "",
    is_available: true,
  });

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const captureLocation = async () => {
    setLocLoading(true);
    try {
      const c = await getUserLocation({ forceFresh: true });
      setCoords(c);
      toast.success("অবস্থান যোগ হয়েছে ✓");
    } catch (e) {
      toast.error((e as Error).message || "অবস্থান নেওয়া যায়নি");
    } finally {
      setLocLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast.error("চালিয়ে যেতে গোপনীয়তা ও সম্মতি বক্সে টিক দিন");
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "অনুগ্রহ করে সব তথ্য সঠিকভাবে দিন");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.rpc("register_donor", {
      _name: parsed.data.name,
      _phone: parsed.data.phone,
      _password: parsed.data.password,
      _blood_group: parsed.data.blood_group,
      _address: parsed.data.address,
      _area: parsed.data.area || null,
      _last_donation_date: parsed.data.last_donation_date || null,
      _is_available: parsed.data.is_available,
      _latitude: coords?.lat ?? null,
      _longitude: coords?.lng ?? null,
    });
    setLoading(false);
    if (error) {
      if (error.code === "23505" || /duplicate|unique/i.test(error.message)) {
        toast.error("এই মোবাইল নম্বরটি ইতিমধ্যে নিবন্ধিত");
      } else {
        toast.error("নিবন্ধন ব্যর্থ: " + error.message);
      }
      return;
    }
    void data;
    toast.success("সফলভাবে নিবন্ধন সম্পন্ন হয়েছে! ধন্যবাদ ❤️");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container mx-auto max-w-2xl px-4 py-10 md:py-16">
        <div className="mb-6">
          <AnnouncementTicker
            variant="inline"
            badge="নিরাপত্তা"
            messages={[
              "🔒 আপনার তথ্য সম্পূর্ণ নিরাপদ — শুধু verified user দেখবে",
              "📵 ইচ্ছা না করলে যেকোনো সময় profile hide করতে পারবেন",
              "❤️ একটি রক্তদান, তিনটি জীবন রক্ষা",
            ]}
          />
        </div>
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-foreground">ডোনার হিসেবে যুক্ত হন</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            আপনার তথ্য দিয়ে নিবন্ধন করুন এবং কারো জীবন বাঁচানোর সুযোগ নিন।
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">নাম *</Label>
              <Input
                id="name"
                placeholder="পূর্ণ নাম"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">মোবাইল নম্বর (WhatsApp সহ) *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                required
                maxLength={11}
              />
              <p className="text-xs text-muted-foreground">
                যে নম্বরে কল ও WhatsApp উভয়ই পাওয়া যাবে।
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড * (ড্যাশবোর্ডে লগইনের জন্য)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                  minLength={6}
                  maxLength={72}
                  autoComplete="new-password"
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
                পরে প্রোফাইল আপডেট করতে এই পাসওয়ার্ডটি লাগবে।
              </p>
            </div>

            <div className="space-y-2">
              <Label>রক্তের গ্রুপ *</Label>
              <Select
                value={form.blood_group}
                onValueChange={(v) => update("blood_group", v as BloodGroup)}
              >
                <SelectTrigger>
                  <Droplet className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="রক্তের গ্রুপ নির্বাচন করুন" />
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

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="area">এলাকা</Label>
                <Select value={form.area} onValueChange={(v) => update("area", v)}>
                  <SelectTrigger id="area">
                    <SelectValue placeholder="এলাকা নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {MYMENSINGH_AREA_GROUPS.map((g) => (
                      <SelectGroup key={g.label}>
                        <SelectLabel>{g.label}</SelectLabel>
                        {g.areas.map((a) => (
                          <SelectItem key={a} value={a}>
                            {a}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">ঠিকানা *</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <Label className="flex items-center gap-1.5 text-sm font-semibold">
                    <MapPin className="h-4 w-4 text-primary" />
                    আমার বর্তমান অবস্থান (ঐচ্ছিক)
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    যোগ করলে কাছাকাছি থাকা মানুষ আপনাকে সহজে খুঁজে পাবে। আপনার সঠিক
                    অবস্থান কাউকে দেখানো হবে না, শুধু দূরত্ব হিসাব হবে।
                  </p>
                </div>
                {coords ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    যোগ হয়েছে
                  </span>
                ) : null}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={captureLocation}
                disabled={locLoading}
              >
                {locLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {coords ? "অবস্থান আপডেট করুন" : "আমার অবস্থান যোগ করুন"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="last">সর্বশেষ রক্তদানের তারিখ</Label>
              <Input
                id="last"
                type="date"
                value={form.last_donation_date}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => update("last_donation_date", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                না দিলেও চলবে। ৯০ দিনের মধ্যে দিলে সতর্কতা দেখানো হবে।
              </p>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-4">
              <div>
                <Label htmlFor="avail" className="cursor-pointer">
                  বর্তমানে উপলব্ধ
                </Label>
                <p className="text-xs text-muted-foreground">
                  এখনই রক্ত দিতে পারবেন কিনা।
                </p>
              </div>
              <Switch
                id="avail"
                checked={form.is_available}
                onCheckedChange={(v) => update("is_available", v)}
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="consent" className="cursor-pointer text-xs font-normal leading-relaxed text-muted-foreground">
                  আমি সম্মতি দিচ্ছি যে আমার নাম, রক্তের গ্রুপ ও এলাকা RoktoFinder-এ public donor list-এ দেখানো হবে যাতে রক্তপ্রার্থী আমার সাথে যোগাযোগ করতে পারে। আমার ফোন নম্বর সরাসরি দেখানো হবে না — শুধু কল/WhatsApp বোতাম থাকবে। যেকোনো সময় ড্যাশবোর্ড থেকে আমি প্রোফাইল hide/delete করতে পারব। <a href="/privacy" target="_blank" rel="noopener" className="text-primary hover:underline">গোপনীয়তা নীতি</a> পড়ুন।
                </Label>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading || !consent}>
              {loading ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন সম্পন্ন করুন"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              নিবন্ধন করে আপনি স্বীকার করছেন যে শুধুমাত্র শারীরিকভাবে সক্ষম হলে রক্ত দেবেন।
            </p>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
