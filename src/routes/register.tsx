import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  Droplet,
  UserPlus,
  Lock,
  MapPin,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  LogIn,
  ArrowRight,
  Quote,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroVideoPlayer } from "@/components/HeroVideoPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  address: z.string().trim().min(2, "সঠিক ঠিকানা দিন").max(200),
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

      <main className="container mx-auto px-4 py-8 md:py-14 max-w-7xl">
        {/* Top Ticker */}
        <div className="mb-8">
          <AnnouncementTicker
            variant="inline"
            badge="নিরাপত্তা ও বিশ্বাস"
            messages={[
              "🔒 আপনার তথ্য সম্পূর্ণ নিরাপদ — শুধু যাচাইকৃত রক্তপ্রার্থী কল বোতাম পাবে",
              "📵 ইচ্ছা না করলে যেকোনো সময় ড্যাশবোর্ড থেকে নম্বর ও প্রোফাইল হাইড করতে পারবেন",
              "❤️ একটি রক্তদান, তিনটি জীবন রক্ষা",
            ]}
          />
        </div>

        {/* 2-Column SaaS Layout Grid */}
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Premium SaaS Value Proposition, Video & Testimonials (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                <Heart className="h-3.5 w-3.5 fill-current" />
                <span>স্বেচ্ছাসেবী রক্তদান নেটওয়ার্ক</span>
              </div>
              <h1 className="mt-4 font-heading text-3xl font-extrabold text-foreground md:text-4xl leading-tight">
                রক্ত দিন, জীবন বাঁচান। হয়ে উঠুন একজন গর্বিত ডোনার।
              </h1>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                ময়মনসিংহের সবচেয়ে বড় রক্তদাতা পরিবারের সাথে যুক্ত হোন। আপনার ১ ব্যাগ রক্ত
                হাসপাতালে অপেক্ষমাণ কোনো মুমূর্ষু শিশু বা রোগীর জীবন রক্ষা করতে পারে।
              </p>
            </div>

            {/* Platform Video Preview Card */}
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-lg">
              <HeroVideoPlayer className="aspect-video" />
            </div>

            {/* Perks List */}
            <div className="space-y-3.5 pt-1">
              <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 p-3.5 shadow-xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    ডিজিটাল ডোনার কার্ড ও সার্টিফিকেট
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    রেজিস্ট্রেশন সম্পন্ন হলেই পাবেন ভেরিফায়েড ৩x আল্ট্রা-এইচডি কার্ড ও সম্মাননা সনদ।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 p-3.5 shadow-xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    ১০০% তথ্য নিরাপত্তা ও নিয়ন্ত্রণ
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    আপনার নম্বর প্রকাশ্যে প্রদর্শিত হবে না। যেকোনো সময় প্রাপ্যতা অন/অফ করতে পারবেন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 p-3.5 shadow-xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    নিকটবর্তী জরুরি রক্তের অ্যালার্ট
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    আপনার এলাকায় রক্তের জরুরি প্রয়োজন হলে সরাসরি অ্যাপের মাধ্যমে নোটিফিকেশন পাবেন।
                  </p>
                </div>
              </div>
            </div>

            {/* Founder / Donor Testimonial Card */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <Quote className="h-6 w-6 text-primary shrink-0 opacity-40" />
                <div>
                  <p className="text-xs italic text-foreground leading-relaxed">
                    "একটি মানবিক উদ্যোগ হিসেবে RoktoFinder-এর জন্ম। স্বেচ্ছাসেবী রক্তদানের মাধ্যমে
                    আমরা ময়মনসিংহের প্রতিটি রোগীর কাছে সময়মতো রক্ত পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ।"
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground">মুহাম্মদ নাফিজ</div>
                      <div className="text-[10px] text-muted-foreground">
                        প্রতিষ্ঠাতা ও রক্তদাতা (B+) • কেওয়াটখালি
                      </div>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">
                      B+ ডোনার
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Sign In Box */}
            <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-foreground">
                  ইতোমধ্যে কি ডোনার হিসেবে যুক্ত আছেন?
                </div>
                <div className="text-[11px] text-muted-foreground">
                  আপনার ডোনার ড্যাশবোর্ডে প্রবেশ করুন
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="gap-1.5 font-bold shrink-0">
                <Link to="/dashboard">
                  <LogIn className="h-3.5 w-3.5" />
                  <span>লগইন করুন</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Premium Registration Form Card (7 Cols) */}
          <div className="lg:col-span-7">
            <Card className="border-border/80 bg-card p-6 md:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5 mb-6 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                      <UserPlus className="h-4 w-4" />
                    </div>
                    <h2 className="font-heading text-xl font-bold text-foreground">
                      ডোনার রেজিস্ট্রেশন ফর্ম
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    তারকা (*) চিহ্নিত ঘরগুলো সঠিকভাবে পূরণ করুন।
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-muted-foreground">অ্যাকাউন্ট আছে? </span>
                  <Link
                    to="/dashboard"
                    className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>লগইন করুন</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold text-foreground">
                    পূর্ণ নাম *
                  </Label>
                  <Input
                    id="name"
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold text-foreground">
                    মোবাইল নম্বর (WhatsApp সহ) *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    required
                    maxLength={11}
                    className="h-11 rounded-xl font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    যে নম্বরে জরুরি প্রয়োজনে কল ও WhatsApp উভয়ই পাওয়া যাবে।
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-bold text-foreground">
                    পাসওয়ার্ড * (পরবর্তীতে ড্যাশবোর্ডে প্রবেশের জন্য)
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="কমপক্ষে ৬ অক্ষর বা ডিজিট"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      required
                      minLength={6}
                      maxLength={72}
                      autoComplete="new-password"
                      className="h-11 rounded-xl pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                      aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Lock className="h-3 w-3 text-primary" />
                    কার্ড ডাউনলোড বা প্রোফাইল আপডেট করতে এই পাসওয়ার্ডটি লাগবে।
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-foreground">রক্তের গ্রুপ *</Label>
                  <Select
                    value={form.blood_group}
                    onValueChange={(v) => update("blood_group", v as BloodGroup)}
                  >
                    <SelectTrigger className="h-11 rounded-xl gap-2 [&>svg:last-child]:ml-auto">
                      <Droplet className="h-4 w-4 text-primary" />
                      <SelectValue placeholder="আপনার রক্তের গ্রুপ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border bg-popover/95 backdrop-blur-xl">
                      {BLOOD_GROUPS.map((g) => (
                        <SelectItem key={g} value={g} className="cursor-pointer font-bold py-2">
                          🩸 {g} গ্রুপ
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-xs font-bold text-foreground">
                      এলাকা
                    </Label>
                    <Select value={form.area} onValueChange={(v) => update("area", v)}>
                      <SelectTrigger
                        id="area"
                        className="h-11 rounded-xl gap-2 [&>svg:last-child]:ml-auto"
                      >
                        <SelectValue placeholder="এলাকা নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72 rounded-xl border-border bg-popover/95 backdrop-blur-xl">
                        {MYMENSINGH_AREA_GROUPS.map((g) => (
                          <SelectGroup key={g.label}>
                            <SelectLabel className="font-bold text-primary">{g.label}</SelectLabel>
                            {g.areas.map((a) => (
                              <SelectItem key={a} value={a} className="cursor-pointer py-1.5">
                                {a}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-xs font-bold text-foreground">
                      ঠিকানা *
                    </Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                      required
                      placeholder="যেমন: কেওয়াটখালি রেলওয়ে কলোনি"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                {/* Optional Geolocation Capture */}
                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <Label className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        বর্তমান জিপিএস অবস্থান (ঐচ্ছিক)
                      </Label>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                        যুক্ত করলে লাইভ ম্যাপে ও রেডারে আপনার কাছাকাছি রোগীদের দ্রুত সহায়তা করতে
                        পারবেন। আপনার সঠিক বাড়ি কাউকে দেখানো হয় না, শুধুমাত্র দূরত্ব পরিমাপ হয়।
                      </p>
                    </div>
                    {coords ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        যুক্ত হয়েছে
                      </span>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 gap-1.5 text-xs font-semibold rounded-lg cursor-pointer"
                    onClick={captureLocation}
                    disabled={locLoading}
                  >
                    {locLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <MapPin className="h-3.5 w-3.5" />
                    )}
                    {coords ? "অবস্থান আপডেট করুন" : "আমার বর্তমান অবস্থান চিহ্নিত করুন"}
                  </Button>
                </div>

                {/* Last donation date */}
                <div className="space-y-2">
                  <Label htmlFor="last" className="text-xs font-bold text-foreground">
                    সর্বশেষ রক্তদানের তারিখ (যদি ইতিপূর্বে দিয়ে থাকেন)
                  </Label>
                  <Input
                    id="last"
                    type="date"
                    value={form.last_donation_date}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => update("last_donation_date", e.target.value)}
                    className="h-11 rounded-xl"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    না দিলেও চলবে। শেষ রক্তদানের ৯০ দিন পার না হলে স্বয়ংক্রিয় সতর্কবার্তা থাকবে।
                  </p>
                </div>

                {/* Availability Switch */}
                <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 p-4">
                  <div>
                    <Label
                      htmlFor="avail"
                      className="cursor-pointer text-xs font-bold text-foreground"
                    >
                      বর্তমানে রক্তদানে উপলব্ধ
                    </Label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      জরুরি প্রয়োজনে ডাকলে রক্ত দিতে প্রস্তুত আছেন কিনা।
                    </p>
                  </div>
                  <Switch
                    id="avail"
                    checked={form.is_available}
                    onCheckedChange={(v) => update("is_available", v)}
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      checked={consent}
                      onCheckedChange={(v) => setConsent(v === true)}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="consent"
                      className="cursor-pointer text-xs font-normal leading-relaxed text-muted-foreground"
                    >
                      আমি সম্মতি দিচ্ছি যে আমার নাম, রক্তের গ্রুপ ও এলাকা RoktoFinder-এ public donor
                      list-এ দেখানো হবে যাতে রক্তপ্রার্থী আমার সাথে যোগাযোগ করতে পারে। আমার ফোন
                      নম্বর সরাসরি দেখানো হবে না — শুধু কল/WhatsApp বোতাম থাকবে। যেকোনো সময়
                      ড্যাশবোর্ড থেকে আমি প্রোফাইল hide/delete করতে পারব।{" "}
                      <Link to="/privacy" className="text-primary hover:underline font-semibold">
                        গোপনীয়তা নীতি
                      </Link>{" "}
                      পড়ুন।
                    </Label>
                  </div>
                </div>

                {/* Submit CTA */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-bold text-base shadow-elegant cursor-pointer h-12 rounded-xl"
                  disabled={loading || !consent}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>নিবন্ধন হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      <span>ডোনার হিসেবে নিবন্ধন সম্পন্ন করুন</span>
                    </>
                  )}
                </Button>

                <p className="text-center text-[11px] text-muted-foreground">
                  নিবন্ধন করার পর সরাসরি আপনার নিজস্ব ড্যাশবোর্ড ও ডিজিটাল আইডি কার্ড দেখতে পাবেন।
                </p>
              </form>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
