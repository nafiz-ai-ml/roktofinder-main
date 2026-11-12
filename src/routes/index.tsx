import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  UserPlus,
  AlertCircle,
  Droplet,
  MapPin,
  Heart,
  Users,
  Mail,
  CheckCircle2,
  Activity,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  Trophy,
  HelpCircle,
  BarChart3,
  HeartHandshake,
  Zap,
  MapPinned,
  PhoneCall,
  BellRing,
  BadgeCheck,
  MapPinOff,
  UserX,
  Stethoscope,
  WifiOff,
  ThumbsUp,
  AlertTriangle,
  UserPlus2,
  Send,
  Bell,
  Timer,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BLOOD_GROUPS,
  MYMENSINGH_AREA_GROUPS,
  supabase,
  toBnNum,
  bnTimeAgo,
  type Donor,
  type EmergencyRequest,
} from "@/lib/supabase";
import { NotifyMeDialog } from "@/components/NotifyMeDialog";
import { AnnouncementTicker } from "@/components/AnnouncementTicker";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RoktoFinder — ময়মনসিংহের রক্তদাতা প্ল্যাটফর্ম" },
      {
        name: "description",
        content:
          "ময়মনসিংহে আপনার কাছাকাছি রক্তদাতা খুঁজুন। রক্তের গ্রুপ ও এলাকা অনুযায়ী দ্রুত ডোনার খুঁজুন, জরুরি অনুরোধ পোস্ট করুন বা ডোনার হিসেবে যুক্ত হন।",
      },
      { property: "og:title", content: "RoktoFinder — ময়মনসিংহের রক্তদাতা প্ল্যাটফর্ম" },
      {
        property: "og:description",
        content: "ময়মনসিংহে আপনার কাছাকাছি রক্তদাতা খুঁজুন। জীবন বাঁচাতে রক্ত দিন।",
      },
      { property: "og:url", content: "https://roktofinder.com/" },
    ],
    links: [{ rel: "canonical", href: "https://roktofinder.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "RoktoFinder",
              url: "https://roktofinder.com",
              description:
                "A local blood donor finder platform for Mymensingh, Bangladesh.",
              areaServed: { "@type": "City", name: "Mymensingh" },
            },
            {
              "@type": "WebSite",
              name: "RoktoFinder",
              url: "https://roktofinder.com",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://roktofinder.com/directory?bg={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});

interface Stats {
  total: number;
  available: number;
  groups: number;
  requests: number;
  donations: number;
}

type BgKey = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
type BgDist = Record<BgKey, number>;
const EMPTY_BG_DIST: BgDist = {
  "A+": 0, "A-": 0, "B+": 0, "B-": 0,
  "O+": 0, "O-": 0, "AB+": 0, "AB-": 0,
};

const HELP_EMAIL = "roktofinder@gmail.com";

function waLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? "88" + digits : digits;
  return `https://wa.me/${intl}`;
}

function HomePage() {
  const navigate = useNavigate();
  const [bg, setBg] = useState<string>("");
  const [area, setArea] = useState("");
  const [stats, setStats] = useState<Stats>({
    total: 0, available: 0, groups: 0, requests: 0, donations: 0,
  });
  const [bgDist, setBgDist] = useState<BgDist>(EMPTY_BG_DIST);
  const [featured, setFeatured] = useState<Donor[]>([]);
  const [recentRequests, setRecentRequests] = useState<EmergencyRequest[]>([]);

  useEffect(() => {
    const load = async () => {
      const [
        { count: total },
        { count: available },
        { count: donations },
        donorsRes,
        allBgRes,
        requestsRes,
        requestsCountRes,
      ] = await Promise.all([
        supabase.from("donors_public").select("*", { count: "exact", head: true }),
        supabase
          .from("donors_public")
          .select("*", { count: "exact", head: true })
          .eq("is_available", true),
        supabase
          .from("donors_public")
          .select("*", { count: "exact", head: true })
          .not("last_donation_date", "is", null),
        supabase
          .from("donors_public")
          .select(
            "id,name,phone,blood_group,address,area,last_donation_date,is_available,last_active,created_at",
          )
          .eq("is_available", true)
          .order("last_active", { ascending: false })
          .limit(6),
        supabase.from("donors_public").select("blood_group").limit(5000),
        supabase
          .from("emergency_requests_public")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(4),
        supabase.from("emergency_requests_public").select("*", { count: "exact", head: true }),
      ]);

      const dist: BgDist = { ...EMPTY_BG_DIST };
      for (const row of allBgRes.data ?? []) {
        const bg = row.blood_group as BgKey;
        if (bg in dist) dist[bg] += 1;
      }

      setStats({
        total: total ?? 0,
        available: available ?? 0,
        groups: 8,
        requests: requestsCountRes.count ?? 0,
        donations: donations ?? 0,
      });
      setBgDist(dist);
      setFeatured((donorsRes.data ?? []) as Donor[]);
      setRecentRequests((requestsRes.data ?? []) as EmergencyRequest[]);
    };
    load();
  }, []);

  const handleSearch = () => {
    navigate({
      to: "/directory",
      search: { bg: bg || undefined, area: area || undefined },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-destructive via-primary to-destructive">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-3 text-sm text-primary-foreground md:flex-row">
          <div className="flex items-center gap-2 text-center md:text-left">
            <AlertCircle className="h-4 w-4 shrink-0 animate-pulse" />
            <span className="font-medium">
              জরুরি রক্ত প্রয়োজন? এখনই ডোনার খুঁজুন বা অনুরোধ পোস্ট করুন।
            </span>
          </div>
          <Button asChild size="sm" variant="secondary" className="h-8 shrink-0">
            <Link to="/emergency">
              <AlertCircle className="h-3.5 w-3.5" />
              জরুরি অনুরোধ
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4">
        <AnnouncementTicker
          variant="inline"
          badge="মনে রাখুন"
          messages={[
            "🩸 প্রতি ৩ সেকেন্ডে কেউ না কেউ রক্তের জন্য অপেক্ষা করছে — আপনি কি প্রস্তুত?",
            "❤️ এক ব্যাগ রক্ত = ৩টি জীবন রক্ষা",
            "🤲 রক্তদান সদকায়ে জারিয়া — মৃত্যুর পরেও সওয়াব চলবে",
            "📚 আল ফাতিহ ইসলামিক পাঠাগার | জ্ঞান ও সেবা — দুটোই আমাদের লক্ষ্য",
          ]}
        />
      </div>

      <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-mesh" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/30 via-background to-background" />
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute -top-20 -left-20 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute -bottom-20 -right-20 -z-10 h-72 w-72 rounded-full bg-destructive/15 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="container mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-20">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              ময়মনসিংহের প্রথম রক্তদাতা প্ল্যাটফর্ম
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
              আপনার কাছাকাছি{" "}
              <span className="bg-gradient-to-r from-primary to-[oklch(0.5_0.24_20)] bg-clip-text text-transparent">
                রক্তদাতা
              </span>{" "}
              খুঁজুন
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
              রক্তের গ্রুপ ও এলাকা অনুযায়ী দ্রুত ডোনার খুঁজুন। এক ক্লিকেই কল ও WhatsApp এ
              যোগাযোগ করুন। জীবন বাঁচাতে আজই যুক্ত হন।
            </p>

            {/* Search bar */}
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-elegant)] md:p-4">
              <div className="grid gap-2 md:grid-cols-[1fr_1.4fr_auto]">
                <Select value={bg} onValueChange={setBg}>
                  <SelectTrigger className="h-12 gap-2 border-border [&>svg:last-child]:ml-auto">
                    <Droplet className="h-4 w-4 shrink-0 text-primary" />
                    <SelectValue placeholder="রক্তের গ্রুপ" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger className="h-12 gap-2 border-border [&>svg:last-child]:ml-auto">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
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

                <Button size="lg" variant="premium" className="h-12 px-6" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                  খুঁজুন
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="premium">
                <Link to="/directory">
                  <Search className="h-4 w-4" />
                  ডোনার খুঁজুন
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/register">
                  <UserPlus className="h-4 w-4" />
                  ডোনার হিসেবে যুক্ত হন
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5">
          {[
            { icon: Users, label: "মোট ডোনার", value: stats.total, color: "text-primary", bg: "bg-primary/10" },
            { icon: CheckCircle2, label: "উপলব্ধ ডোনার", value: stats.available, color: "text-success", bg: "bg-success/10" },
            { icon: HeartHandshake, label: "সফল রক্তদান", value: stats.donations, color: "text-destructive", bg: "bg-destructive/10" },
            { icon: Droplet, label: "রক্তের গ্রুপ", value: stats.groups, color: "text-primary", bg: "bg-primary/10" },
            { icon: Activity, label: "মোট অনুরোধ", value: stats.requests, color: "text-warning-foreground", bg: "bg-warning/20" },
          ].map((s, i) => (
            <Card
              key={s.label}
              className="p-4 md:p-5 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} ${s.color} transition-transform duration-300 group-hover:scale-110`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
                {toBnNum(s.value)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Blood Group Distribution */}
      <section className="container mx-auto px-4 pb-12">
        <Card className="p-5 md:p-6 hover-lift animate-fade-in-up">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground md:text-2xl">
                <BarChart3 className="h-5 w-5 text-primary" />
                রক্তের গ্রুপ অনুযায়ী ডোনার
              </h2>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                আমাদের ডোনার ডাটাবেসে প্রতিটি গ্রুপের সংখ্যা।
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              মোট {toBnNum(stats.total)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(Object.keys(bgDist) as BgKey[]).map((bg) => {
              const count = bgDist[bg];
              const max = Math.max(1, ...Object.values(bgDist));
              const pct = Math.round((count / max) * 100);
              const sharePct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div
                  key={bg}
                  className="rounded-xl border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.5_0.24_20)] px-2 text-sm font-bold text-primary-foreground shadow-[var(--shadow-elegant)]">
                      {bg}
                    </span>
                    <div className="text-right">
                      <div className="font-display text-lg font-bold leading-none text-foreground">
                        {toBnNum(count)}
                      </div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">
                        {toBnNum(sharePct)}%
                      </div>
                    </div>
                  </div>
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-[oklch(0.5_0.24_20)] transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* How It Works */}
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-accent/10 to-background" />
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              কীভাবে কাজ করে?
            </h2>
            <p className="mt-3 text-muted-foreground">মাত্র ৩টি সহজ ধাপে জীবন বাঁচান।</p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                step: "১",
                icon: Search,
                title: "ডোনার খুঁজুন",
                desc: "রক্তের গ্রুপ ও এলাকা সিলেক্ট করে কাছাকাছি ডোনার খুঁজে নিন।",
              },
              {
                step: "২",
                icon: Phone,
                title: "যোগাযোগ করুন",
                desc: "এক ক্লিকেই কল বা WhatsApp এ ডোনারের সাথে কথা বলুন।",
              },
              {
                step: "৩",
                icon: Heart,
                title: "জীবন বাঁচান",
                desc: "নিরাপদভাবে রক্ত সংগ্রহ করে রোগীর জীবন রক্ষা করুন।",
              },
            ].map((s, i) => (
              <Card
                key={s.step}
                className="group relative overflow-hidden p-6 hover-lift animate-fade-in-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="absolute -right-4 -top-4 font-display text-7xl font-bold text-primary/5 transition-all duration-500 group-hover:text-primary/10">
                  {toBnNum(s.step)}
                </div>
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.5_0.24_20)] text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform duration-300 hover:scale-110 hover:rotate-3">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why RoktoFinder — Benefits, Limitations & Workflow */}
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-accent/10 to-background" />
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              কেন RoktoFinder?
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              RoktoFinder এর সুবিধা ও সীমাবদ্ধতা
            </h2>
            <p className="mt-3 text-muted-foreground">
              আমরা সততার সাথে দেখাই — কী পাবেন, কী পাবেন না, এবং পুরো সিস্টেম কীভাবে কাজ করে।
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Benefits */}
            <Card className="p-5 md:p-6 hover-lift animate-fade-in-up">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
                  <ThumbsUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground md:text-xl">
                    সুবিধা
                  </h3>
                  <p className="text-xs text-muted-foreground">কেন মানুষ RoktoFinder ব্যবহার করেন</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  {
                    icon: Zap,
                    title: "সহজে ডোনার পাওয়া",
                    desc: "মাত্র ২ ক্লিকেই রক্তের গ্রুপ ও এলাকা অনুযায়ী ডোনার পাওয়া যায়।",
                  },
                  {
                    icon: MapPinned,
                    title: "লোকেশন ভিত্তিক দ্রুত সার্চ",
                    desc: "আপনার GPS লোকেশন অনুযায়ী কাছাকাছি ডোনার অগ্রাধিকার পায়।",
                  },
                  {
                    icon: PhoneCall,
                    title: "সরাসরি যোগাযোগ",
                    desc: "এক ক্লিকেই Call ও WhatsApp — মাঝে কোনো middleman নেই।",
                  },
                  {
                    icon: BellRing,
                    title: "জরুরি অনুরোধ সিস্টেম",
                    desc: "Emergency request পোস্ট করলে ম্যাচিং ডোনাররা দ্রুত জানতে পারেন।",
                  },
                  {
                    icon: ShieldCheck,
                    title: "সম্পূর্ণ ফ্রি ও বিজ্ঞাপনমুক্ত",
                    desc: "কোনো charge নেই, ডোনারের তথ্য কোথাও বিক্রি হয় না।",
                  },
                  {
                    icon: BadgeCheck,
                    title: "ভেরিফাইড ডোনার প্রোফাইল",
                    desc: "৯০ দিনের cooldown automatic track হয় — fake/expired donor কম।",
                  },
                ].map((b) => (
                  <div
                    key={b.title}
                    className="flex gap-3 rounded-xl border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                      <b.icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{b.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Limitations */}
            <Card className="p-5 md:p-6 hover-lift animate-fade-in-up" style={{ animationDelay: "120ms" }}>
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/20 text-warning-foreground">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground md:text-xl">
                    সীমাবদ্ধতা
                  </h3>
                  <p className="text-xs text-muted-foreground">আমরা যা সততার সাথে স্বীকার করি</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  {
                    icon: MapPinOff,
                    title: "শুধু ময়মনসিংহ অঞ্চলে সীমাবদ্ধ",
                    desc: "এখনো অন্য জেলায় coverage সীমিত — ধীরে ধীরে বিস্তৃত হচ্ছে।",
                  },
                  {
                    icon: UserX,
                    title: "ডোনারের সাড়া নিশ্চিত নয়",
                    desc: "আমরা ডোনার দেখাই, কিন্তু রাজি হওয়া তাঁর ব্যক্তিগত সিদ্ধান্ত।",
                  },
                  {
                    icon: Stethoscope,
                    title: "মেডিকেল টেস্ট আমরা করি না",
                    desc: "রক্ত নেওয়ার আগে হাসপাতাল/ব্লাড ব্যাংকে cross-match ও screening বাধ্যতামূলক।",
                  },
                  {
                    icon: WifiOff,
                    title: "ইন্টারনেট ও ফোন প্রয়োজন",
                    desc: "পুরো সিস্টেম online — নেটওয়ার্ক দুর্বল হলে delay হতে পারে।",
                  },
                ].map((l) => (
                  <div
                    key={l.title}
                    className="flex gap-3 rounded-xl border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground">
                      <l.icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{l.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{l.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Detailed workflow strip */}
          <div className="mt-10">
            <Card className="p-5 md:p-6 hover-lift animate-fade-in-up">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground md:text-xl">
                    RoktoFinder কীভাবে কাজ করে — পুরো ফ্লো
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Registration থেকে রক্তদান পর্যন্ত প্রতিটি ধাপ
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
                {[
                  { icon: UserPlus2, title: "রেজিস্টার", desc: "নাম, ফোন, গ্রুপ দিয়ে সাইনআপ।" },
                  { icon: MapPin, title: "লোকেশন সেভ", desc: "GPS অনুমতি দিয়ে নিজের অবস্থান।" },
                  { icon: Search, title: "সার্চ/Emergency", desc: "গ্রুপ ও এলাকা দিয়ে খোঁজা।" },
                  { icon: Bell, title: "নোটিফিকেশন", desc: "ম্যাচিং ডোনার দ্রুত জানেন।" },
                  { icon: Phone, title: "সরাসরি কল", desc: "Call বা WhatsApp এ যোগাযোগ।" },
                  { icon: Heart, title: "রক্তদান", desc: "হাসপাতালে নিরাপদে রক্তদান।" },
                  { icon: Timer, title: "Cooldown ট্র্যাক", desc: "৯০ দিনের cooldown auto-update।" },
                ].map((s, i) => (
                  <div
                    key={s.title}
                    className="relative rounded-xl border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.5_0.24_20)] text-primary-foreground shadow-[var(--shadow-elegant)]">
                        <s.icon className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {toBnNum(i + 1)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-foreground">{s.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
                    {i < 6 && (
                      <ArrowRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-primary/40 lg:block" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" variant="premium">
                  <Link to="/register">
                    <UserPlus className="h-4 w-4" />
                    এখনই ডোনার হন
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/directory">
                    <Search className="h-4 w-4" />
                    ডোনার খুঁজুন
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Donors */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                সক্রিয় ডোনার
              </h2>
              <p className="mt-2 text-muted-foreground">এই মুহূর্তে রক্ত দিতে প্রস্তুত।</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/directory">
                সব দেখুন
                <Search className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((d, i) => {
              const isTop = (d.donation_count ?? 0) >= 5;
              const isAvailable = d.is_available === true;
              return (
                <Card
                  key={d.id}
                  className="p-5 hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="truncate text-base font-semibold text-foreground">
                          {d.name}
                        </h3>
                        {isAvailable ? (
                          <span title="ডোনার এই মুহূর্তে রক্তদানের জন্য উপলব্ধ ও eligible" className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                            উপলব্ধ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                            অনুপলব্ধ
                          </span>
                        )}
                        {isTop && (
                          <span title="৫+ বার রক্তদান সম্পন্ন" className="inline-flex items-center gap-1 rounded-full bg-warning/20 px-2 py-0.5 text-[10px] font-medium text-warning-foreground">
                            <Trophy className="h-2.5 w-2.5" />
                            Top Donor
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{d.area || d.address}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {bnTimeAgo(d.last_active)}
                      </div>
                    </div>
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.5_0.24_20)] text-lg font-bold text-primary-foreground shadow-[var(--shadow-elegant)]">
                      {d.blood_group}
                    </div>
                  </div>
                  {d.phone ? (
                    <div className="mt-2 flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <a href={`tel:${d.phone}`}>
                          <Phone className="h-4 w-4" />
                          কল
                        </a>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <a href={waLink(d.phone)} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-4 w-4" />
                          WhatsApp
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-lg bg-muted/50 p-2.5 text-center text-xs text-muted-foreground">
                      ডোনার তার নম্বর গোপন রেখেছেন
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center">
            <NotifyMeDialog />
          </div>
        </section>
      )}

      {/* Recent Emergency Requests */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-3xl font-bold text-foreground md:text-4xl">
              <AlertCircle className="h-7 w-7 text-destructive" />
              সাম্প্রতিক জরুরি অনুরোধ
            </h2>
            <p className="mt-2 text-muted-foreground">এই অনুরোধগুলোতে দ্রুত সাড়া দিন।</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/emergency">
              সব দেখুন
              <AlertCircle className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {recentRequests.length === 0 ? (
          <Card className="border-dashed p-10 text-center">
            <p className="text-muted-foreground">এই মুহূর্তে কোনো সক্রিয় জরুরি অনুরোধ নেই।</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recentRequests.map((r, i) => (
              <Card
                key={r.id}
                className="border-destructive/30 p-5 hover-lift animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-destructive">
                        জরুরি
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {bnTimeAgo(r.created_at)}
                      </span>
                    </div>
                    <h3 className="mt-2 truncate font-semibold text-foreground">
                      {r.patient_name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {r.location}
                      {r.hospital ? ` · ${r.hospital}` : ""}
                    </p>
                    {r.message && (
                      <p className="mt-2 line-clamp-2 rounded-lg bg-muted/50 p-2 text-xs text-foreground">
                        {r.message}
                      </p>
                    )}
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.5_0.24_20)] font-bold text-primary-foreground">
                    {r.blood_group}
                  </div>
                </div>
                <Button asChild size="sm" variant="destructive" className="mt-3 w-full">
                  <a href={`tel:${r.contact_phone}`}>
                    <Phone className="h-4 w-4" />
                    এখনই কল করুন · {r.contact_phone}
                  </a>
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Why Donate Blood */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/40 via-background to-primary/5" />
        <div className="absolute top-1/2 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Heart className="h-3 w-3 fill-current" />
              রক্তদান সম্পর্কে
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              কেন রক্তদান করবেন?
            </h2>
            <p className="mt-3 font-display text-xl text-primary md:text-2xl">
              "আপনার ১ ব্যাগ রক্ত ৩ জনের জীবন বাঁচাতে পারে"
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "জীবন রক্ষা",
                desc: "প্রতিটি রক্তদান একাধিক রোগীকে নতুন জীবন উপহার দেয়।",
              },
              {
                icon: ShieldCheck,
                title: "নিরাপদ ও বিনামূল্য",
                desc: "চিকিৎসকের তত্ত্বাবধানে সম্পূর্ণ নিরাপদ প্রক্রিয়া। কোনো খরচ নেই।",
              },
              {
                icon: Sparkles,
                title: "আপনার স্বাস্থ্য",
                desc: "নিয়মিত রক্তদান হার্ট ও সাধারণ স্বাস্থ্যের জন্য ভালো।",
              },
            ].map((item, i) => (
              <Card
                key={item.title}
                className="p-6 hover-lift animate-fade-in-up group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Area */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              আমাদের কার্যক্রমের এলাকা
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-success/30 bg-gradient-to-br from-success/10 to-success/5 p-6 hover-lift animate-fade-in-up">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-success" />
                <span className="text-xs font-semibold uppercase tracking-wide text-success">
                  বর্তমানে সেবা দিচ্ছি
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold text-foreground">
                সম্পূর্ণ ময়মনসিংহ
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                ময়মনসিংহ শহর ও জেলার সকল উপজেলায় ডোনার ও জরুরি অনুরোধের জন্য সম্পূর্ণ সেবা উপলব্ধ।
              </p>
            </Card>
            <Card
              className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6 hover-lift animate-fade-in-up"
              style={{ animationDelay: "120ms" }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  শীঘ্রই আসছে
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold text-foreground">
                সম্পূর্ণ বাংলাদেশ
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                দেশের সকল জেলা ও বিভাগে রক্তদাতা নেটওয়ার্ক সম্প্রসারণের কাজ চলছে।
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <HelpCircle className="h-3 w-3" />
              FAQ
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              সাধারণ জিজ্ঞাসা
            </h2>
          </div>

          <Card className="p-2 md:p-4">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  q: "কে রক্ত দিতে পারবে?",
                  a: "১৮ থেকে ৬০ বছর বয়সী সুস্থ যেকোনো ব্যক্তি, যাঁর ওজন ৫০ কেজির বেশি এবং কোনো গুরুতর অসুখ নেই, তিনি রক্ত দিতে পারবেন। মহিলা দাতাদের ক্ষেত্রে গর্ভাবস্থা বা মাসিকের সময় রক্ত দেওয়া উচিত নয়।",
                },
                {
                  q: "কতদিন পর আবার রক্ত দেওয়া যায়?",
                  a: "একবার রক্ত দেওয়ার পর কমপক্ষে ৯০ দিন (৩ মাস) অপেক্ষা করতে হয়। এই সময়ে শরীর হারানো রক্ত পুনরায় তৈরি করে নেয়।",
                },
                {
                  q: "রক্ত দিলে কি কোনো ক্ষতি হয়?",
                  a: "না, সঠিকভাবে রক্ত দিলে কোনো ক্ষতি হয় না। বরং নিয়মিত রক্তদান হার্ট অ্যাটাকের ঝুঁকি কমায় এবং নতুন রক্ত কোষ তৈরিতে সহায়তা করে। রক্ত দেওয়ার আগে চিকিৎসক আপনাকে যাচাই করবেন।",
                },
                {
                  q: "রক্ত দেওয়ার আগে কী খাওয়া উচিত?",
                  a: "রক্ত দেওয়ার ২-৩ ঘণ্টা আগে হালকা খাবার খেয়ে নিন। প্রচুর পানি পান করুন। খালি পেটে রক্ত দেবেন না।",
                },
                {
                  q: "RoktoFinder কীভাবে কাজ করে?",
                  a: "আমরা ময়মনসিংহের রক্তদাতাদের একটি ডাটাবেস তৈরি করি। আপনি রক্তের গ্রুপ ও এলাকা দিয়ে সার্চ করে সরাসরি দাতার সাথে কল বা WhatsApp এ যোগাযোগ করতে পারবেন।",
                },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="px-3 text-base font-semibold">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-3 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </section>

      {/* Contact / Help */}
      <section className="container mx-auto px-4 pb-16">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.5_0.24_20)] p-8 text-center md:p-12 shadow-[var(--shadow-elegant)] animate-scale-in">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="relative">
          <Mail className="mx-auto h-10 w-10 text-primary-foreground" />
          <h2 className="mt-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl">
            সাহায্য দরকার?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            ডোনার খুঁজে পাচ্ছেন না? রেজিস্ট্রেশনে সমস্যা? সরাসরি Email এ আমাদের জানান।
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <a href={`mailto:${HELP_EMAIL}`}>
                <Mail className="h-4 w-4" />
                Email এ যোগাযোগ
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/register">
                <UserPlus className="h-4 w-4" />
                ডোনার হন
              </Link>
            </Button>
          </div>
          </div>
        </Card>
      </section>
      </main>

      <Footer />
    </div>
  );
}
