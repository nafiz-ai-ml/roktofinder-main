import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Building2,
  Phone,
  MapPin,
  Search,
  Droplet,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  HeartPulse,
  Sparkles,
  ArrowLeft,
  Ambulance,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HOSPITALS_DATA, type Hospital, type HospitalCategory } from "@/lib/data/hospitals-data";

export const Route = createFileRoute("/hospitals")({
  head: () => ({
    meta: [
      { title: "ময়মনসিংহের হাসপাতাল ও ব্লাড ব্যাংক ডিরেক্টরি — RoktoFinder" },
      {
        name: "description",
        content:
          "ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল (MMCH), সন্ধানী, রেড ক্রিসেন্ট, সিবিএমসিবি সহ ময়মনসিংহের শীর্ষ সরকারি ও বেসরকারি হাসপাতাল এবং ব্লাড ব্যাংকের জরুরি হটলাইন নম্বর ও ঠিকানা।",
      },
      {
        property: "og:title",
        content: "ময়মনসিংহের হাসপাতাল ও ব্লাড ব্যাংক ডিরেক্টরি — RoktoFinder",
      },
      {
        property: "og:description",
        content:
          "জরুরি রক্তের প্রয়োজনে কিংবা চিকিৎসার জন্য ময়মনসিংহের হাসপাতাল ও ব্লাড ব্যাংকসমূহের সরাসরি ফোন নম্বর ও লোকেশন গাইড।",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HospitalsPage,
});

function HospitalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<HospitalCategory>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");

  // Extract unique areas
  const areas = useMemo(() => {
    const list = Array.from(new Set(HOSPITALS_DATA.map((h) => h.area)));
    return ["all", ...list];
  }, []);

  // Filtered hospital list
  const filteredHospitals = useMemo(() => {
    return HOSPITALS_DATA.filter((hospital) => {
      // Category filter
      if (selectedCategory === "blood_bank" && !hospital.bloodBankAvailable) {
        return false;
      }
      if (
        selectedCategory !== "all" &&
        selectedCategory !== "blood_bank" &&
        hospital.category !== selectedCategory
      ) {
        return false;
      }

      // Area filter
      if (selectedArea !== "all" && hospital.area !== selectedArea) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = hospital.name.toLowerCase().includes(query);
        const matchNameBn = hospital.nameBn.toLowerCase().includes(query);
        const matchAddress = hospital.address.toLowerCase().includes(query);
        const matchArea = hospital.area.toLowerCase().includes(query);
        return matchName || matchNameBn || matchAddress || matchArea;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedArea]);

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
              <span className="text-foreground">হাসপাতাল ও ব্লাড ব্যাংক ডিরেক্টরি</span>
            </div>

            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Building2 className="h-3.5 w-3.5" />
                <span>ময়মনসিংহ স্বাস্থ্যসেবা ও রক্ত কেন্দ্র গাইড</span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                হাসপাতাল ও{" "}
                <span className="bg-gradient-to-r from-primary via-destructive to-primary bg-clip-text text-transparent">
                  ব্লাড ব্যাংক
                </span>{" "}
                ডিরেক্টরি
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
                ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল (MMCH), সন্ধানী, রেড ক্রিসেন্ট সহ শহরের অনুমোদিত
                হাসপাতাল ও ব্লাড ব্যাংকগুলোর জরুরি হটলাইন নম্বর ও সরাসরি ঠিকানা।
              </p>

              {/* Quick Jump Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link to="/ambulance">
                    <Ambulance className="h-4 w-4 text-primary" />
                    <span>জরুরি অ্যাম্বুলেন্স তালিকা দেখুন</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link to="/compatibility">
                    <Droplet className="h-4 w-4 text-destructive" />
                    <span>রক্তের সামঞ্জস্যতা ক্যালকুলেটর</span>
                  </Link>
                </Button>
              </div>
            </div>
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
                  placeholder="হাসপাতাল বা এলাকার নাম দিয়ে খুঁজুন (যেমন: চরপাড়া, চুরখাই, মেডিকেল)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>

              {/* Area select */}
              <div className="w-full md:w-auto min-w-[220px]">
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="h-11 w-full gap-2 rounded-xl border border-input bg-background/90 px-3.5 py-2 text-sm text-foreground shadow-xs hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/20">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <SelectValue placeholder="এলাকা নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 rounded-xl border-border/80 bg-popover/95 backdrop-blur-md shadow-lg">
                    <SelectItem value="all" className="font-semibold cursor-pointer">
                      সকল এলাকা ({HOSPITALS_DATA.length})
                    </SelectItem>
                    {areas
                      .filter((a) => a !== "all")
                      .map((a) => (
                        <SelectItem key={a} value={a} className="cursor-pointer">
                          {a}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
              {[
                { id: "all", label: "সকল প্রতিষ্ঠান", count: HOSPITALS_DATA.length },
                {
                  id: "blood_bank",
                  label: "ব্লাড ব্যাংক ও রক্ত সঞ্চালন কেন্দ্র",
                  count: HOSPITALS_DATA.filter((h) => h.bloodBankAvailable).length,
                },
                {
                  id: "government",
                  label: "সরকারি হাসপাতাল",
                  count: HOSPITALS_DATA.filter((h) => h.category === "government").length,
                },
                {
                  id: "private",
                  label: "বেসরকারি হাসপাতাল",
                  count: HOSPITALS_DATA.filter((h) => h.category === "private").length,
                },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as HospitalCategory)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      selectedCategory === cat.id
                        ? "bg-white/20 text-white"
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              মোট <strong>{filteredHospitals.length}টি</strong> স্বাস্থ্যসেবা কেন্দ্র প্রদর্শিত
              হচ্ছে
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedArea("all");
                }}
                className="text-primary hover:underline"
              >
                ফিল্টার রিসেট করুন
              </button>
            )}
          </div>

          {/* Hospital Cards Grid */}
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHospitals.map((hospital) => (
              <Card
                key={hospital.id}
                className="group flex flex-col justify-between overflow-hidden border-border/80 bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {hospital.bloodBankAvailable ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                        <Droplet className="h-3 w-3 fill-emerald-500/30" />
                        <span>ব্লাড ব্যাংক সংরক্ষিত</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        <span>সাধারণ ডায়াগনস্টিক</span>
                      </span>
                    )}

                    {hospital.hasICU && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                        <HeartPulse className="h-3 w-3" />
                        <span>ICU উপলব্ধ</span>
                      </span>
                    )}

                    {hospital.is24x7 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary">
                        <Clock className="h-3 w-3" />
                        <span>২৪/৭ জরুরি</span>
                      </span>
                    )}
                  </div>

                  {/* Hospital Title */}
                  <div className="mt-3.5">
                    <h3 className="font-display text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {hospital.nameBn}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      {hospital.name}
                    </p>
                  </div>

                  {/* Location & Area */}
                  <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{hospital.address}</span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground/90 border-t border-border/50 pt-2.5 line-clamp-3">
                    {hospital.descriptionBn}
                  </p>
                </div>

                {/* Bottom Actions Row */}
                <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
                  {/* Primary Emergency Dial button */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button
                      asChild
                      variant="destructive"
                      size="sm"
                      className="w-full gap-2 shadow-xs cursor-pointer"
                    >
                      <a href={`tel:${hospital.emergencyHotline}`}>
                        <Phone className="h-3.5 w-3.5" />
                        <span>জরুরি কল</span>
                      </a>
                    </Button>

                    {hospital.bloodBankPhone ? (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 cursor-pointer"
                      >
                        <a href={`tel:${hospital.bloodBankPhone}`}>
                          <Droplet className="h-3.5 w-3.5" />
                          <span>ব্লাড ব্যাংক</span>
                        </a>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 cursor-pointer"
                      >
                        <a href={hospital.mapUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>ম্যাপে রুট</span>
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* If blood bank button was shown in the grid, add secondary Map route button */}
                  {hospital.bloodBankPhone && hospital.mapUrl && (
                    <a
                      href={hospital.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors pt-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>গুগল ম্যাপে দিকনির্দেশনা (Directions) দেখুন</span>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Empty search state */}
          {filteredHospitals.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-bold text-foreground text-lg">কোনো ফলাফল পাওয়া যায়নি</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                "{searchQuery}" দিয়ে কোনো হাসপাতাল বা ব্লাড ব্যাংক খুঁজে পাওয়া যায়নি। বানান যাচাই
                করুন অথবা ফিল্টার পরিবর্তন করুন।
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedArea("all");
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
