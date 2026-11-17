import { Link } from "@tanstack/react-router";
import {
  Radar,
  MapPin,
  Droplet,
  Building2,
  Ambulance,
  ArrowRight,
  Crosshair,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toBnNum } from "@/lib/supabase";

export function LiveRadarSection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20 border-t border-border/60 bg-gradient-to-b from-background via-rose-500/[0.02] to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
            <Radar className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "6s" }} />
            <span>ময়মনসিংহের প্রথম লাইভ রেডার</span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-extrabold text-foreground md:text-4xl lg:text-5xl">
            ম্যাপে দেখুন আপনার সবচেয়ে কাছের রক্তদাতা ও সেবা
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg leading-relaxed">
            ময়মনসিংহ মেডিকেল কলেজ বা আপনার এলাকার ২ থেকে ১৫ কি.মি. ব্যাসার্ধের মধ্যে কোন কোন
            রক্তদাতা প্রস্তুত আছেন, নিকটস্থ ব্লাড ব্যাংক এবং জরুরি অ্যাম্বুলেন্স স্ট্যান্ড
            কোথায়—সবকিছু দেখুন রিয়েলটাইম ইন্টারেক্টিভ ম্যাপে।
          </p>
        </div>

        {/* Content & Interactive Visual Mockup Grid */}
        <div className="mt-12 grid items-center gap-8 lg:grid-cols-12">
          {/* Left: Key Features & Benefits (5 Cols) */}
          <div className="space-y-4 lg:col-span-5">
            <Card className="border-border/80 bg-card/80 p-5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
                  <Crosshair className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">
                    ব্যাসার্ধ ভিত্তিক স্মার্ট রেডার
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    ২ কি.মি., ৫ কি.মি., ১০ কি.মি. বা ১৫ কি.মি. রেডার সার্কেল স্লাইড করে আপনার
                    কাঙ্ক্ষিত দূরত্বের ভেতরের ডোনারদের নিমিষে খুঁজে নিন।
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border/80 bg-card/80 p-5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Droplet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">
                    রক্তের গ্রুপ অনুযায়ী লাইভ পিন
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    যেকোনো নির্দিষ্ট রক্তের গ্রুপ (যেমন O+, A+, B+, AB-) ফিল্টার করে শুধুমাত্র
                    উপযুক্ত ডোনারদের চিহ্নিত করুন এবং সরাসরি কল করুন।
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border/80 bg-card/80 p-5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">
                    হাসপাতাল ও অ্যাম্বুলেন্স লেয়ার
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    ডোনারদের পাশাপাশি ময়মনসিংহের সকল সরকারি-বেসরকারি ব্লাড ব্যাংক ও অ্যাম্বুলেন্স
                    স্ট্যান্ডের লাইভ লোকেশন ম্যাপে দেখা যাবে।
                  </p>
                </div>
              </div>
            </Card>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 font-bold shadow-elegant">
                <Link to="/radar">
                  <Radar className="h-4 w-4" />
                  <span>লাইভ রেডার ম্যাপ খুলুন</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-semibold">
                <Link to="/directory">ডোনার ডিরেক্টরি দেখুন</Link>
              </Button>
            </div>
          </div>

          {/* Right: Stylized Radar Canvas Visual (7 Cols) */}
          <div className="relative lg:col-span-7">
            <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-accent/20 p-6 shadow-2xl backdrop-blur-xl">
              {/* Radar Rings Graphic Background */}
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/30 p-4 flex items-center justify-center">
                {/* Concentric Radar Rings */}
                <div
                  className="absolute h-72 w-72 rounded-full border border-rose-500/15 animate-ping"
                  style={{ animationDuration: "4s" }}
                />
                <div className="absolute h-56 w-56 rounded-full border border-rose-500/25" />
                <div className="absolute h-40 w-40 rounded-full border border-rose-500/35" />
                <div className="absolute h-24 w-24 rounded-full border border-rose-500/50 bg-rose-500/5" />

                {/* Radar Rotating Sweep Line */}
                <div className="absolute h-48 w-48 rounded-full overflow-hidden pointer-events-none">
                  <div
                    className="h-full w-full origin-center animate-spin"
                    style={{
                      animationDuration: "5s",
                      background:
                        "conic-gradient(from 0deg, transparent 0deg, rgba(244,63,94,0.25) 60deg, transparent 65deg)",
                    }}
                  />
                </div>

                {/* Center Pin: MMCH */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-rose-600 text-white shadow-lg font-bold">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="mt-1 rounded-md bg-background/90 px-2 py-0.5 text-[10px] font-bold text-foreground shadow-xs border border-border">
                    MMCH (কেন্দ্রবিন্দু)
                  </span>
                </div>

                {/* Floating Mockup Pins */}
                {/* Pin 1: Donor */}
                <div
                  className="absolute top-6 left-10 z-10 animate-bounce"
                  style={{ animationDuration: "3s" }}
                >
                  <div className="flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-background/95 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-md backdrop-blur-md">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-black">
                      B+
                    </span>
                    <span>মুহাম্মদ নাফিজ • কেওয়াটখালি ({toBnNum("০.৮")} কি.মি.)</span>
                  </div>
                </div>

                {/* Pin 2: Hospital */}
                <div className="absolute bottom-8 left-8 z-10">
                  <div className="flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-background/95 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-md backdrop-blur-md">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Building2 className="h-3 w-3" />
                    </span>
                    <span>সন্ধানী ব্লাড ব্যাংক ({toBnNum("১.২")} কি.মি.)</span>
                  </div>
                </div>

                {/* Pin 3: Ambulance */}
                <div className="absolute top-10 right-8 z-10">
                  <div className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-background/95 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-md backdrop-blur-md">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white">
                      <Ambulance className="h-3 w-3" />
                    </span>
                    <span>আইসিইউ অ্যাম্বুলেন্স ({toBnNum("০.৫")} কি.মি.)</span>
                  </div>
                </div>

                {/* Pin 4: Donor 2 */}
                <div className="absolute bottom-10 right-10 z-10">
                  <div className="flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-background/95 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-md backdrop-blur-md">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-black">
                      B+
                    </span>
                    <span>তানভীর • মাসকান্দা</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Stats Bar */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center border-t border-border/60 pt-3">
                <div>
                  <div className="text-sm font-black text-foreground">{toBnNum("৩০")}+ এলাকা</div>
                  <div className="text-[10px] text-muted-foreground">ময়মনসিংহ শহর ও উপজেলা</div>
                </div>
                <div>
                  <div className="text-sm font-black text-rose-600">
                    {toBnNum("৮")}টি রক্তের গ্রুপ
                  </div>
                  <div className="text-[10px] text-muted-foreground">তাত্ক্ষণিক ফিল্টার সুবিধা</div>
                </div>
                <div>
                  <div className="text-sm font-black text-foreground">{toBnNum("১৫")} কি.মি.</div>
                  <div className="text-[10px] text-muted-foreground">সর্বোচ্চ রেডার কভারেজ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
