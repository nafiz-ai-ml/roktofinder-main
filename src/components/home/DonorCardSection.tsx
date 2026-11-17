import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Download,
  Share2,
  ArrowRight,
  CheckCircle2,
  Sun,
  Moon,
  Smartphone,
  CreditCard,
  FileText,
  Sparkles,
} from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import {
  IdCardFrontView,
  IdCardBackView,
  SocialCardView,
  CertificateView,
} from "@/components/cards/DonorCardTemplates";
import { ScaledCardWrapper } from "@/components/cards/ScaledCardWrapper";
import type { CardData } from "@/components/cards/types";

export function DonorCardSection() {
  const [cardTheme, setCardTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState<"id-front" | "id-back" | "social" | "certificate">(
    "id-front",
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    async function makeQR() {
      try {
        const url = await QRCode.toDataURL("https://roktofinder.com/verify/RF-F5430D5E", {
          margin: 1,
          errorCorrectionLevel: "M",
          color: { dark: "#000000", light: "#ffffff" },
          width: 320,
        });
        if (isMounted) setQrDataUrl(url);
      } catch (err) {
        console.error("QR generation error:", err);
      }
    }
    makeQR();
    return () => {
      isMounted = false;
    };
  }, []);

  const cardData: CardData = {
    name: "মুহাম্মদ নাফিজ",
    bloodGroup: "B+",
    area: "কেওয়াটখালি, ময়মনসিংহ",
    donorId: "RF-F5430D5E",
    donationCount: 3,
    qrDataUrl,
    theme: cardTheme,
    showName: true,
    showArea: true,
    variant: "feed",
  };

  return (
    <section className="relative overflow-hidden py-14 md:py-20 border-t border-border/60 bg-gradient-to-b from-background via-rose-500/[0.03] to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Award className="h-3.5 w-3.5" />
            <span>স্বীকৃতি ও সম্মাননা</span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-extrabold text-foreground md:text-4xl lg:text-5xl">
            প্রতিটি রক্তদাতার জন্য ভেরিফায়েড ডিজিটাল ডোনার কার্ড ও প্রশংসাপত্র
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg leading-relaxed">
            রক্তদান মানবসেবার এক অনন্য নজির। RoktoFinder এর প্রতিটি নিবন্ধিত রক্তদাতা পাচ্ছেন তাদের
            নিজস্ব অফিসিয়াল ডিজিটাল কার্ড (আইডি কার্ড, সোশ্যাল শেয়ার কার্ড ও A4 সনদপত্র) এবং ডার্ক ও
            লাইট উভয় সংস্করণে জীবনরক্ষার অফিশিয়াল স্বীকৃতি।
          </p>

          {/* Interactive Format & Theme Switcher Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {/* Format Tabs */}
            <div className="inline-flex flex-wrap items-center justify-center rounded-xl border border-border bg-card p-1.5 shadow-sm gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("id-front")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "id-front"
                    ? "bg-[#E4002B] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>আইডি কার্ড (সামনে)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("id-back")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "id-back"
                    ? "bg-[#E4002B] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>আইডি কার্ড (পেছনে)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("social")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "social"
                    ? "bg-[#E4002B] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>সোশ্যাল কার্ড</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("certificate")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "certificate"
                    ? "bg-[#E4002B] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>সনদপত্র (A4)</span>
              </button>
            </div>

            {/* Theme Switcher Toggle */}
            <div className="inline-flex items-center rounded-xl border border-border bg-card p-1.5 shadow-sm gap-1">
              <button
                type="button"
                onClick={() => setCardTheme("light")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  cardTheme === "light"
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sun className="h-3.5 w-3.5 text-amber-500" />
                <span>লাইট</span>
              </button>

              <button
                type="button"
                onClick={() => setCardTheme("dark")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  cardTheme === "dark"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Moon className="h-3.5 w-3.5 text-rose-400" />
                <span>ডার্ক</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Showcase */}
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-12">
          {/* Left Column: 100% Fully Visible, Scaled-to-Fit Card Mockup */}
          <div className="flex flex-col items-center justify-center lg:col-span-6">
            <div className="w-full flex justify-center items-center p-4 sm:p-6 rounded-2xl border border-border/80 bg-neutral-900/5 dark:bg-black/30 shadow-inner">
              {activeTab === "id-front" && (
                <ScaledCardWrapper
                  targetWidth={856}
                  targetHeight={540}
                  maxWidth={520}
                  className="rounded-2xl shadow-xl shadow-rose-950/15"
                >
                  <IdCardFrontView {...cardData} />
                </ScaledCardWrapper>
              )}

              {activeTab === "id-back" && (
                <ScaledCardWrapper
                  targetWidth={856}
                  targetHeight={540}
                  maxWidth={520}
                  className="rounded-2xl shadow-xl shadow-rose-950/15"
                >
                  <IdCardBackView {...cardData} />
                </ScaledCardWrapper>
              )}

              {activeTab === "social" && (
                <ScaledCardWrapper
                  targetWidth={1080}
                  targetHeight={1350}
                  maxWidth={400}
                  className="rounded-2xl shadow-xl shadow-rose-950/15"
                >
                  <SocialCardView {...cardData} variant="feed" />
                </ScaledCardWrapper>
              )}

              {activeTab === "certificate" && (
                <ScaledCardWrapper
                  targetWidth={1123}
                  targetHeight={794}
                  maxWidth={520}
                  className="rounded-2xl shadow-xl shadow-rose-950/15"
                >
                  <CertificateView {...cardData} />
                </ScaledCardWrapper>
              )}
            </div>

            {/* Helper Caption */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>উপরে ক্লিক করে কার্ডের বিভিন্ন পাশ ও রঙ পরীক্ষা করে দেখুন</span>
            </div>
          </div>

          {/* Right Column: Key Features & Direct Action Buttons */}
          <div className="space-y-5 lg:col-span-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">
                    ৩x আল্ট্রা-রেটিনা কোয়ালিটি PNG ও প্রিন্ট PDF (৩০০ DPI)
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    সোশ্যাল ফিড (১০৮০×১৩৫০), স্টোরি (১০৮০×১৯২০) এবং প্লাস্টিক আইডি কার্ড প্রিন্টের
                    উপযোগী ৩০০ DPI ফরম্যাটে এক ক্লিকেই ডাউনলোড করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">
                    অফিশিয়াল প্রশংসাপত্র (A4 Certificate PDF)
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    মানবতার সেবায় বিশেষ অবদানের স্বীকৃতিস্বরূপ RoktoFinder-এর ভেরিফায়েড ডিজিটাল A4
                    সনদপত্র ডাউনলোড করে বাঁধাই বা প্রিন্ট করতে পারবেন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">
                    হোয়াটসঅ্যাপ ও সোশ্যাল শেয়ারিং + লাইভ QR স্ক্যান
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    প্রতিটি কার্ডের সাথে রয়েছে ইউনিক ভেরিফিকেশন QR কোড। যেকোনো স্মার্টফোন দিয়ে
                    স্ক্যান করলেই রক্তদাতার অফিশিয়াল পরিচিতি যাচাই করা যায়।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">
                    ব্রোঞ্জ, সিলভার ও গোল্ড এচিভমেন্ট ব্যাজ এবং প্রাইভেসি মোড
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    রক্তদানের সংখ্যার ভিত্তিতে বিশেষ সম্মাননা ব্যাজ। এছাড়াও ডাউনলোডের পূর্বে নাম ও
                    এলাকা গোপন রাখার নিজস্ব নিয়ন্ত্রণ সুবিধা।
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="gap-2 font-bold shadow-elegant rounded-xl bg-[#E4002B] hover:bg-[#C8102E] text-white cursor-pointer"
              >
                <Link to="/dashboard">
                  <Award className="h-4 w-4" />
                  <span>আপনার ডোনার কার্ড পান</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-semibold rounded-xl border-border cursor-pointer hover:bg-muted"
              >
                <Link to="/register">নতুন ডোনার রেজিস্ট্রেশন</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
