import { Link } from "@tanstack/react-router";
import {
  Award,
  Download,
  Share2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";

export function DonorCardSection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20 border-t border-border/60 bg-gradient-to-b from-background via-rose-500/[0.03] to-background">
      <div className="container mx-auto px-4">
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
            রক্তদান মানবসেবার এক অনন্য নজির। RoktoFinder এর প্রতিটি রেজিস্টার্ড রক্তদাতা পাচ্ছেন
            তাদের নিজস্ব প্রিমিয়াম ডিজিটাল কার্ড এবং জীবনরক্ষার অফিশিয়াল স্বীকৃতি সার্টিফিকেট।
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-12">
          {/* Left: Replica of Holographic Donor Card (6 Cols) */}
          <div className="flex justify-center lg:col-span-6">
            <div className="relative w-full max-w-md">
              {/* Glow backdrop */}
              <div
                className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 opacity-30 blur-xl animate-pulse"
                style={{ animationDuration: "5s" }}
              />

              {/* The Ruby Card Body */}
              <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-950 via-neutral-900 to-rose-950 p-6 text-white shadow-2xl">
                {/* Holographic light streak effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                {/* Card Top: Brand + Verified Tag */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <img src={logo} alt="RoktoFinder" className="h-9 w-9 object-contain" />
                    <div>
                      <div className="font-extrabold text-sm tracking-wider text-white">
                        ROKTOFINDER
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-rose-300">
                        Official Donor Card
                      </div>
                    </div>
                  </div>

                  <Badge className="border border-emerald-400/40 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] gap-1 px-2 py-0.5">
                    <ShieldCheck className="h-3 w-3" />
                    ভেরিফাইড ডোনার
                  </Badge>
                </div>

                {/* Card Middle: Gold Chip + Donor Info */}
                <div className="my-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                      রক্তদাতার নাম
                    </span>
                    <h3 className="font-bold text-lg text-white">মুরাদ হাসান</h3>
                    <p className="text-xs text-rose-200 mt-0.5">📍 চরপাড়া, ময়মনসিংহ</p>
                    <div className="mt-2 text-[10px] text-neutral-400 font-mono">
                      ID: #RF-MYM-8080 • REG: 2026
                    </div>
                  </div>

                  {/* Blood Group Medallion */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-rose-400/50 bg-gradient-to-br from-rose-600 to-rose-800 text-white font-black text-2xl shadow-lg shadow-rose-950">
                      O+
                    </div>
                    <span className="mt-1 text-[9px] font-bold text-amber-400 uppercase tracking-widest">
                      Blood Group
                    </span>
                  </div>
                </div>

                {/* Card Bottom: Gold Medal Stamp & QR Watermark */}
                <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-neutral-300">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Award className="h-4 w-4" />
                    <span>জীবনরক্ষক হিরো ব্যাজ</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">roktofinder.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Key Features & Downloads (6 Cols) */}
          <div className="space-y-5 lg:col-span-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">
                    ৩x রেটিনা কোয়ালিটি PNG কার্ড
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    স্মার্টফোনের যেকোনো রেজোলিউশনে ঝকঝকে স্পষ্ট থাকবে। এক ক্লিকেই গ্যালারিতে সেভ
                    করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">
                    অফিশিয়াল প্রশংসাপত্র (PDF Certificate)
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    জীবন বাঁচানোর প্রশংসাস্বরূপ RoktoFinder এর ভেরিফায়েড ডিজিটাল সার্টিফিকেট ডাউনলোড
                    ও প্রিন্ট করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">
                    হোয়াটসঅ্যাপ ও সোশ্যাল শেয়ারিং
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    রক্তদানের পর আপনার কার্ড বন্ধু ও পরিবারের সাথে শেয়ার করে অন্যদেরও রক্তদানে
                    অনুপ্রাণিত করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">
                    রক্তদান ট্র্যাকার ও এচিভমেন্ট ব্যাজ
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    আপনার মোট রক্তদানের সংখ্যা, পরবর্তী সম্ভাব্য রক্তদানের তারিখ ও বিশেষ ব্যাজ
                    ট্র্যাক করুন।
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 font-bold shadow-elegant">
                <Link to="/dashboard">
                  <Award className="h-4 w-4" />
                  <span>আপনার ডোনার কার্ড পান</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-semibold">
                <Link to="/register">নতুন ডোনার রেজিস্ট্রেশন</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
