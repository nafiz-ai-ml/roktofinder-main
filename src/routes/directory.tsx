import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search as SearchIcon,
  MapPin,
  Droplet,
  Filter,
  Inbox,
  Navigation,
  Loader2,
  Users,
  Building2,
} from "lucide-react";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnnouncementTicker } from "@/components/AnnouncementTicker";
import { DonorCard, DonorCardSkeleton } from "@/components/DonorCard";
import { useContactFeedback } from "@/components/ContactFeedbackPrompt";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  BLOOD_GROUPS,
  MYMENSINGH_AREA_GROUPS,
  supabase,
  getUserLocation,
  getCachedUserLocation,
  type Donor,
  type UserCoords,
  toBnNum,
} from "@/lib/supabase";

const searchSchema = z.object({
  bg: z.string().optional(),
  area: z.string().optional(),
  availableOnly: z.boolean().optional(),
  mode: z.enum(["area", "nearby"]).optional(),
  radius: z.number().optional(),
  tab: z.enum(["self_registered", "admin_directory"]).optional(),
});

export const Route = createFileRoute("/directory")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "ডোনার ডিরেক্টরি ও খোঁজ — RoktoFinder" },
      {
        name: "description",
        content:
          "ময়মনসিংহে রক্তের গ্রুপ ও এলাকা অনুযায়ী ডোনার খুঁজুন — নিবন্ধিত ডোনার ও RoktoFinder Directory ডোনার আলাদাভাবে দেখুন। নম্বর লুকানো থাকে, কল বা WhatsApp দিয়ে যোগাযোগ করুন।",
      },
      { property: "og:title", content: "ডোনার ডিরেক্টরি ও খোঁজ — RoktoFinder" },
      {
        property: "og:description",
        content: "রক্তের গ্রুপ ও এলাকা অনুযায়ী দ্রুত ডোনার খুঁজুন।",
      },
      { property: "og:url", content: "https://roktofinder.com/directory" },
    ],
    links: [{ rel: "canonical", href: "https://roktofinder.com/directory" }],
  }),
  component: DirectoryPage,
});

type Mode = "area" | "nearby";
type TabKey = "self_registered" | "admin_directory";

function DirectoryPage() {
  const { bg, area, availableOnly, mode: modeParam, radius: radiusParam, tab } =
    Route.useSearch();
  const navigate = useNavigate();

  const [bgVal, setBgVal] = useState(bg ?? "");
  const [areaVal, setAreaVal] = useState(area ?? "");
  const [availOnly, setAvailOnly] = useState(availableOnly ?? false);
  const [mode, setMode] = useState<Mode>(modeParam ?? "area");
  const [radius, setRadius] = useState<number>(radiusParam ?? 10);
  const activeTab: TabKey = tab ?? "self_registered";

  const [coords, setCoords] = useState<UserCoords | null>(() => getCachedUserLocation());
  const [gpsLoading, setGpsLoading] = useState(false);

  const [donors, setDonors] = useState<Donor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { requestFeedback, prompt } = useContactFeedback();

  useEffect(() => {
    setBgVal(bg ?? "");
    setAreaVal(area ?? "");
    setAvailOnly(availableOnly ?? false);
    setMode(modeParam ?? "area");
    setRadius(radiusParam ?? 10);
  }, [bg, area, availableOnly, modeParam, radiusParam]);

  // Load results (both donor sources together)
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);

      if (mode === "nearby" && coords) {
        const { data, error } = await supabase.rpc("search_donors_nearby", {
          _bg: bg || null,
          _lat: coords.lat,
          _lng: coords.lng,
          _radius_km: radius,
          _available_only: availableOnly ?? false,
        });
        if (cancelled) return;
        if (error) {
          toast.error("কাছাকাছি ডোনার খোঁজা যায়নি");
          setDonors([]);
        } else {
          setDonors((data ?? []) as Donor[]);
        }
        setLoading(false);
        return;
      }

      const rpc = await supabase.rpc("search_donors_by_area", {
        _bg: bg || null,
        _area: area || null,
        _available_only: availableOnly ?? false,
      });
      if (cancelled) return;
      if (!rpc.error) {
        setDonors((rpc.data ?? []) as Donor[]);
        setLoading(false);
        return;
      }

      // Fallback: direct view query
      let q = supabase
        .from("donors_public")
        .select(
          "id,name,phone,blood_group,address,area,last_donation_date,is_available,phone_visible,last_active,created_at,donor_source",
        );
      if (bg) q = q.eq("blood_group", bg);
      if (area) q = q.ilike("area", `%${area}%`);
      if (availableOnly) q = q.eq("is_available", true);
      const { data, error } = await q.limit(200);
      if (cancelled) return;
      if (error) {
        setDonors([]);
      } else {
        const sorted = (data as Donor[]).sort((a, b) => {
          if (a.is_available !== b.is_available) return a.is_available ? -1 : 1;
          const la = a.last_active ? new Date(a.last_active).getTime() : 0;
          const lb = b.last_active ? new Date(b.last_active).getTime() : 0;
          return lb - la;
        });
        setDonors(sorted);
      }
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [bg, area, availableOnly, mode, radius, coords]);

  const apply = () => {
    navigate({
      to: "/directory",
      search: {
        bg: bgVal || undefined,
        area: mode === "area" ? areaVal || undefined : undefined,
        availableOnly: availOnly || undefined,
        mode: mode === "nearby" ? "nearby" : undefined,
        radius: mode === "nearby" ? radius : undefined,
        tab: activeTab === "self_registered" ? undefined : activeTab,
      },
    });
  };

  const clear = () => {
    setBgVal("");
    setAreaVal("");
    setAvailOnly(false);
    setMode("area");
    setRadius(10);
    navigate({ to: "/directory", search: {} });
  };

  const useMyLocation = async () => {
    setGpsLoading(true);
    try {
      const c = await getUserLocation({ forceFresh: true });
      setCoords(c);
      setMode("nearby");
      toast.success("আপনার অবস্থান অনুযায়ী খোঁজা হচ্ছে");
    } catch (e) {
      toast.error((e as Error).message || "অবস্থান নেওয়া যায়নি");
    } finally {
      setGpsLoading(false);
    }
  };

  const setTab = (t: TabKey) => {
    navigate({
      to: "/directory",
      search: (prev) => ({ ...prev, tab: t === "self_registered" ? undefined : t }),
    });
  };

  // donors without a source (pre-migration data) count as self_registered
  const tabDonors = (donors ?? []).filter(
    (d) => (d.donor_source ?? "self_registered") === activeTab,
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <AnnouncementTicker
            variant="inline"
            badge="টিপ"
            messages={[
              "💡 রক্তের গ্রুপ + এলাকা দিয়ে filter করলে দ্রুত ফল পাবেন",
              "📍 GPS অন করলে কাছাকাছি ডোনার আগে দেখানো হবে",
              "✅ শুধু 'উপলব্ধ' ডোনার দেখতে toggle ব্যবহার করুন",
              "🔒 গোপনীয়তার জন্য মোবাইল নম্বর লুকানো — কল বা WhatsApp বোতাম দিয়ে যোগাযোগ করুন",
            ]}
          />
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">ডোনার ডিরেক্টরি</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            রক্তের গ্রুপ ও এলাকা অনুযায়ী, অথবা আপনার কাছাকাছি ডোনার খুঁজুন — নিবন্ধিত
            ডোনার ও RoktoFinder Directory আলাদাভাবে দেখুন।
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="mb-4 inline-flex rounded-lg border border-border bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => setMode("area")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "area"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin className="mr-1 inline h-3.5 w-3.5" />
              এলাকা দিয়ে
            </button>
            <button
              type="button"
              onClick={() => {
                if (!coords) void useMyLocation();
                else setMode("nearby");
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "nearby"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Navigation className="mr-1 inline h-3.5 w-3.5" />
              আমার কাছাকাছি
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_1.5fr_auto_auto]">
            <Select value={bgVal} onValueChange={setBgVal}>
              <SelectTrigger className="h-11 gap-2 [&>svg:last-child]:ml-auto">
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

            {mode === "area" ? (
              <Select value={areaVal} onValueChange={setAreaVal}>
                <SelectTrigger className="h-11 gap-2 [&>svg:last-child]:ml-auto">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <SelectValue placeholder="এলাকা" />
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
            ) : (
              <div className="flex h-11 items-center gap-3 rounded-md border border-input bg-background px-3">
                <Navigation className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">দূরত্ব:</span>
                <span className="text-sm font-semibold text-foreground">
                  {toBnNum(radius)} কিমি
                </span>
                <Slider
                  value={[radius]}
                  onValueChange={(v) => setRadius(v[0])}
                  min={1}
                  max={25}
                  step={1}
                  className="ml-2 flex-1"
                />
              </div>
            )}

            <Button onClick={apply} className="h-11">
              <SearchIcon className="h-4 w-4" />
              ফিল্টার
            </Button>
            <Button onClick={clear} variant="outline" className="h-11">
              রিসেট
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="availOnly" className="cursor-pointer text-sm">
                শুধুমাত্র উপলব্ধ ডোনার
              </Label>
              <Switch
                id="availOnly"
                checked={availOnly}
                onCheckedChange={setAvailOnly}
              />
            </div>

            {mode === "nearby" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={useMyLocation}
                disabled={gpsLoading}
                className="ml-auto h-8 text-xs"
              >
                {gpsLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Navigation className="h-3.5 w-3.5" />
                )}
                {coords ? "অবস্থান রিফ্রেশ" : "আমার অবস্থান নিন"}
              </Button>
            )}
          </div>

          {mode === "nearby" && !coords && (
            <p className="mt-3 rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground">
              📍 কাছাকাছি ডোনার দেখতে আপনার ব্রাউজারে লোকেশন অনুমতি দিন।
            </p>
          )}
        </div>

        {/* Source tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setTab(v as TabKey)}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="self_registered">
              <Users className="h-4 w-4" />
              নিবন্ধিত ডোনার
            </TabsTrigger>
            <TabsTrigger value="admin_directory">
              <Building2 className="h-4 w-4" />
              RoktoFinder Directory
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Results */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <DonorCardSkeleton key={i} />
            ))}
          </div>
        ) : tabDonors.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              মোট {toBnNum(tabDonors.length)} জন ডোনার পাওয়া গেছে
              {mode === "nearby" && coords && ` (${toBnNum(radius)} কিমি এর মধ্যে)`}
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tabDonors.map((d) => (
                <DonorCard
                  key={d.id}
                  donor={d}
                  onContact={(donor) => requestFeedback({ id: donor.id, name: donor.name })}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-4 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {activeTab === "admin_directory"
                ? "এই তালিকায় এখনও কোনো ডোনার নেই"
                : "কোনো ডোনার পাওয়া যায়নি"}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              ভিন্ন রক্তের গ্রুপ, এলাকা বা বড় দূরত্ব দিয়ে চেষ্টা করুন।
            </p>
            <Button asChild className="mt-6">
              <a href="/register">ডোনার হন</a>
            </Button>
          </div>
        )}

        <p className="mt-10 rounded-xl border border-border bg-muted/40 p-4 text-center text-xs text-muted-foreground">
          ⚠️ যোগাযোগের আগে দাতাকে যাচাই করুন। শুধুমাত্র শারীরিকভাবে সক্ষম হলে রক্ত দিন।
        </p>
      </main>
      {prompt}
      <Footer />
    </div>
  );
}
