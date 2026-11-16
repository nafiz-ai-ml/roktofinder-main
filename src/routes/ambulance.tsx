import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Ambulance,
  Phone,
  MapPin,
  Search,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  Clock,
  HeartPulse,
  Sparkles,
  ArrowLeft,
  Snowflake,
  Wind,
  PhoneCall,
  Info,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AMBULANCE_DATA,
  type AmbulanceService,
  type AmbulanceType,
} from "@/lib/data/ambulance-data";

export const Route = createFileRoute("/ambulance")({
  head: () => ({
    meta: [
      { title: "ময়মনসিংহ ২৪/৭ অ্যাম্বুলেন্স সার্ভিস ডিরেক্টরি — RoktoFinder" },
      {
        name: "description",
        content:
          "চরপাড়া মেডিকেল গেট, চুরখাই, গাঙ্গিনারপাড় সহ ময়মনসিংহের জরুরি আইসিইউ (ICU), এসি, নন-এসি ও ফ্রিজার অ্যাম্বুলেন্স সার্ভিসের সরাসরি ফোন নম্বর ও তাৎক্ষণিক যোগাযোগ।",
      },
      {
        property: "og:title",
        content: "ময়মনসিংহ অ্যাম্বুলেন্স সার্ভিস — RoktoFinder",
      },
      {
        property: "og:description",
        content:
          "জরুরি রোগী স্থানান্তরে ময়মনসিংহের বিশ্বস্ত অ্যাম্বুলেন্স ড্রাইভার ও স্ট্যান্ডের হটলাইন নম্বর। এক ক্লিকেই সরাসরি কল ও WhatsApp এ লোকেশন শেয়ার করুন।",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AmbulancePage,
});

function AmbulancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<AmbulanceType>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Extract unique locations
  const locations = useMemo(() => {
    const list = Array.from(new Set(AMBULANCE_DATA.map((a) => a.baseLocation)));
    return ["all", ...list];
  }, []);

  // Filtered ambulance list
  const filteredAmbulances = useMemo(() => {
    return AMBULANCE_DATA.filter((item) => {
      // Type filter
      if (selectedType !== "all" && item.vehicleType !== selectedType) {
        return false;
      }

      // Location filter
      if (selectedLocation !== "all" && item.baseLocation !== selectedLocation) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.providerName.toLowerCase().includes(query);
        const matchDriver = item.driverOrContact.toLowerCase().includes(query);
        const matchLoc = item.baseLocation.toLowerCase().includes(query);
        const matchPhone = item.primaryPhone.includes(query);
        return matchName || matchDriver || matchLoc || matchPhone;
      }

      return true;
    });
  }, [searchQuery, selectedType, selectedLocation]);

  const getTypeBadge = (type: AmbulanceService["vehicleType"]) => {
    switch (type) {
      case "icu":
        return {
          label: "ICU / লাইফ সাপোর্ট",
          icon: HeartPulse,
          cls: "bg-blue-500/10 text-blue-600 border-blue-500/30",
        };
      case "ac":
        return {
          label: "এসি অ্যাম্বুলেন্স",
          icon: Wind,
          cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
        };
      case "non_ac":
        return {
          label: "নন-এসি অ্যাম্বুলেন্স",
          icon: Ambulance,
          cls: "bg-amber-500/10 text-amber-600 border-amber-500/30",
        };
      case "freezer":
        return {
          label: "ফ্রিজার অ্যাম্বুলেন্স",
          icon: Snowflake,
          cls: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
        };
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/[0.06] via-background to-background py-12 md:py-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Link
                to="/"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>হোমে ফিরে যান</span>
              </Link>
              <span>/</span>
              <span className="text-foreground">২৪/৭ অ্যাম্বুলেন্স সার্ভিস ডিরেক্টরি</span>
            </div>

            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Ambulance className="h-3.5 w-3.5" />
                <span>ময়মনসিংহ জরুরি রোগী পরিবহন নেটওয়ার্ক</span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                ২৪/৭ জরুরি{" "}
                <span className="bg-gradient-to-r from-primary via-destructive to-primary bg-clip-text text-transparent">
                  অ্যাম্বুলেন্স
                </span>{" "}
                ডিরেক্টরি
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
                ময়মনসিংহ মেডিকেল মোড় (চরপাড়া), চুরখাই, গাঙ্গিনারপাড় সহ নিকটস্থ স্ট্যান্ডের
                আইসিইউ (ICU), এসি, নন-এসি এবং ফ্রিজার অ্যাম্বুলেন্সের যাচাইকৃত সরাসরি ফোন নম্বর।
              </p>
            </div>
          </div>
        </section>

        {/* 999 National Emergency Call Out Banner */}
        <section className="container mx-auto px-4 pt-6 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive text-white shadow-md">
                <PhoneCall className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  জাতীয় জরুরি সেবা — ৯৯৯ (টোল-ফ্রি)
                </h3>
                <p className="text-xs text-muted-foreground">
                  যেকোনো সংকটজনক পরিস্থিতিতে পুলিশ, ফায়ার সার্ভিস ও সরকারি অ্যাম্বুলেন্সের জন্য
                  অবিলম্বে ৯৯৯ এ কল করুন।
                </p>
              </div>
            </div>

            <Button
              asChild
              variant="destructive"
              size="lg"
              className="shrink-0 gap-2 cursor-pointer shadow-sm"
            >
              <a href="tel:999">
                <Phone className="h-4 w-4" />
                <span>৯৯৯ এ কল করুন</span>
              </a>
            </Button>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 py-8 sm:px-6 md:py-12">
          {/* Search & Category Filter Bar */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="অ্যাম্বুলেন্সের নাম, স্ট্যান্ড বা নম্বর দিয়ে খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>

              {/* Location Select */}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="h-11 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <option value="all">সকল স্ট্যান্ড ({AMBULANCE_DATA.length})</option>
                  {locations
                    .filter((l) => l !== "all")
                    .map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Vehicle Type Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
              {[
                { id: "all", label: "সকল অ্যাম্বুলেন্স", count: AMBULANCE_DATA.length },
                {
                  id: "icu",
                  label: "ICU / লাইফ সাপোর্ট",
                  count: AMBULANCE_DATA.filter((a) => a.vehicleType === "icu").length,
                },
                {
                  id: "ac",
                  label: "এসি অ্যাম্বুলেন্স",
                  count: AMBULANCE_DATA.filter((a) => a.vehicleType === "ac").length,
                },
                {
                  id: "non_ac",
                  label: "নন-এসি",
                  count: AMBULANCE_DATA.filter((a) => a.vehicleType === "non_ac").length,
                },
                {
                  id: "freezer",
                  label: "ফ্রিজার (মরদেহ)",
                  count: AMBULANCE_DATA.filter((a) => a.vehicleType === "freezer").length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedType(tab.id as AmbulanceType)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    selectedType === tab.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      selectedType === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              মোট <strong>{filteredAmbulances.length}টি</strong> অ্যাম্বুলেন্স সার্ভিস পাওয়া গেছে
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setSelectedLocation("all");
                }}
                className="text-primary hover:underline"
              >
                ফিল্টার রিসেট করুন
              </button>
            )}
          </div>

          {/* Ambulance Cards Grid */}
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAmbulances.map((ambulance) => {
              const typeBadge = getTypeBadge(ambulance.vehicleType);

              return (
                <Card
                  key={ambulance.id}
                  className="group flex flex-col justify-between overflow-hidden border-border/80 bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${typeBadge.cls}`}
                      >
                        <typeBadge.icon className="h-3 w-3" />
                        <span>{typeBadge.label}</span>
                      </span>

                      {ambulance.hasOxygen && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-600">
                          <span>অক্সিজেন প্রস্তুত</span>
                        </span>
                      )}

                      {ambulance.hasVentilator && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-600">
                          <span>ভেন্টিলেটরযুক্ত</span>
                        </span>
                      )}

                      {ambulance.is24x7 && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary">
                          <Clock className="h-3 w-3" />
                          <span>২৪/৭</span>
                        </span>
                      )}
                    </div>

                    {/* Provider Name */}
                    <div className="mt-3.5">
                      <h3 className="font-display text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {ambulance.providerName}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        যোগাযোগ: {ambulance.driverOrContact}
                      </p>
                    </div>

                    {/* Location */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>স্ট্যান্ড: {ambulance.baseLocation}</span>
                    </div>

                    {/* Description & Pricing */}
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground/90 border-t border-border/50 pt-2.5 line-clamp-3">
                      {ambulance.descriptionBn}
                    </p>

                    <div className="mt-2.5 rounded-lg bg-muted/40 p-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{ambulance.pricingNote}</span>
                    </div>
                  </div>

                  {/* Bottom Actions Row */}
                  <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {/* Direct Call Button */}
                      <Button
                        asChild
                        variant="premium"
                        size="sm"
                        className="w-full gap-2 shadow-xs cursor-pointer"
                      >
                        <a href={`tel:${ambulance.primaryPhone}`}>
                          <Phone className="h-3.5 w-3.5" />
                          <span>সরাসরি কল</span>
                        </a>
                      </Button>

                      {/* WhatsApp / Location Button */}
                      {ambulance.hasWhatsApp ? (
                        <Button
                          asChild
                          variant="secondary"
                          size="sm"
                          className="w-full gap-2 hover:bg-emerald-500/10 hover:text-emerald-600 cursor-pointer"
                        >
                          <a
                            href={`https://wa.me/${ambulance.primaryPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              "আসসালামু আলাইকুম, RoktoFinder থেকে জরুরি অ্যাম্বুলেন্সের প্রয়োজনে যোগাযোগ করছি।",
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                            <span>WhatsApp</span>
                          </a>
                        </Button>
                      ) : (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full gap-2 cursor-pointer"
                        >
                          <a href={`tel:${ambulance.secondaryPhone || ambulance.primaryPhone}`}>
                            <Phone className="h-3.5 w-3.5" />
                            <span>বিকল্প নম্বর</span>
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="text-center">
                      <span className="text-[11px] font-mono font-medium text-foreground">
                        নম্বর: {ambulance.primaryPhone}
                        {ambulance.secondaryPhone && ` | ${ambulance.secondaryPhone}`}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Empty search state */}
          {filteredAmbulances.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center">
              <Ambulance className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-bold text-foreground text-lg">কোনো ফলাফল পাওয়া যায়নি</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                "{searchQuery}" দিয়ে কোনো অ্যাম্বুলেন্স খুঁজে পাওয়া যায়নি। বানান যাচাই করুন অথবা
                ফিল্টার পরিবর্তন করুন।
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setSelectedLocation("all");
                }}
                className="mt-4"
              >
                ফিল্টার রিসেট করুন
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
