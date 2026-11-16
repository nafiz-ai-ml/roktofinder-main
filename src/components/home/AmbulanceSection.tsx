import { Link } from "@tanstack/react-router";
import {
  Ambulance,
  Phone,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AmbulanceSection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20 border-t border-border/60 bg-gradient-to-b from-background via-amber-500/[0.02] to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Ambulance className="h-3.5 w-3.5" />
            <span>২৪/৭ জরুরি পরিবহন সেবা</span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-extrabold text-foreground md:text-4xl lg:text-5xl">
            মুহূর্তের প্রয়োজনে ময়মনসিংহের জরুরি অ্যাম্বুলেন্স নেটওয়ার্ক
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg leading-relaxed">
            রক্তের সন্ধানের পাশাপাশি সংকটময় মুহূর্তে রোগীর দ্রুত ও নিরাপদ যাতায়াতে চরপাড়া, মেডিকেল
            সেন্ট্রাল স্ট্যান্ড এবং চুরখাইয়ের লাইফ সাপোর্ট ও সাধারণ অ্যাম্বুলেন্স ড্রাইভারদের জরুরি
            যোগাযোগ নম্বর।
          </p>
        </div>

        {/* 3 Ambulance Types Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* ICU Ambulance */}
          <Card className="group overflow-hidden border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 font-bold group-hover:scale-110 transition-transform">
              <Ambulance className="h-6 w-6" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-foreground">আইসিইউ (ICU) অ্যাম্বুলেন্স</h3>
              <Badge className="border border-rose-500/30 bg-rose-500/10 text-rose-600 text-[10px] font-bold">
                লাইফ সাপোর্ট
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              পোর্টেবল ভেন্টিলেটর, অক্সিজেন সিলিন্ডার, সাকশন মেশিন ও প্যারামেডিক সুবিধা সহ
              ক্রিটিক্যাল রোগীদের ঢাকা বা দূরবর্তী হাসপাতালে স্থানান্তরের জন্য প্রস্তুত।
            </p>
            <div className="mt-4 text-xs font-semibold text-primary">
              স্ট্যান্ড: চরপাড়া মেডিকেল কলেজ গেট
            </div>
          </Card>

          {/* AC / Non-AC Ambulance */}
          <Card className="group overflow-hidden border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 font-bold group-hover:scale-110 transition-transform">
              <Ambulance className="h-6 w-6" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-foreground">এসি ও নন-এসি অ্যাম্বুলেন্স</h3>
              <Badge className="border border-amber-500/30 bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                স্ট্যান্ডবাই
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              সাধারণ রোগী পরিবহন, ময়মনসিংহ শহরের অভ্যন্তরে যেকোনো হাসপাতালে স্থানান্তর বা স্বল্প
              খরচে উপজেলা পর্যায়ে যাতায়াতের জন্য নির্ভরযোগ্য সেবা।
            </p>
            <div className="mt-4 text-xs font-semibold text-primary">
              স্ট্যান্ড: গাঙ্গিনারপাড়, নতুন বাজার ও চমেক
            </div>
          </Card>

          {/* Freezer Ambulance */}
          <Card className="group overflow-hidden border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 font-bold group-hover:scale-110 transition-transform">
              <Ambulance className="h-6 w-6" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-foreground">ফ্রিজার অ্যাম্বুলেন্স</h3>
              <Badge className="border border-blue-500/30 bg-blue-500/10 text-blue-600 text-[10px] font-bold">
                বিশেষায়িত
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              মরদেহ দীর্ঘ সময় সম্মানজনকভাবে সংরক্ষণে এবং দূরবর্তী যেকোনো জেলা বা বিভাগে পরিবহনের
              জন্য বিশেষায়িত কুলিং চেম্বার সমৃদ্ধ ফ্রিজার ভ্যান।
            </p>
            <div className="mt-4 text-xs font-semibold text-primary">
              স্ট্যান্ড: চরপাড়া ও চুরখাই
            </div>
          </Card>
        </div>

        {/* 999 National Helpline Banner */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-destructive/30 bg-gradient-to-r from-destructive/10 via-destructive/5 to-transparent p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive text-white shadow-md font-black text-xl">
                ৯৯৯
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-foreground">
                    জাতীয় জরুরি সেবা ৯৯৯ এ সরাসরি যোগাযোগ
                  </h4>
                  <Badge variant="destructive" className="text-[10px] font-bold">
                    টোল-ফ্রি ২৪/৭
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  যেকোনো বড় ধরনের সড়ক দুর্ঘটনা বা জরুরি অ্যাম্বুলেন্স না পেলে সরকারিভাবে তাৎক্ষণিক
                  অ্যাম্বুলেন্স সহায়তার জন্য সরাসরি ৯৯৯ ডায়াল করুন।
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2.5">
              <Button asChild variant="destructive" size="sm" className="gap-2 font-bold shadow-xs">
                <a href="tel:999">
                  <Phone className="h-4 w-4" />
                  <span>৯৯৯ এ কল করুন</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-2 font-semibold">
                <Link to="/ambulance">
                  <span>অ্যাম্বুলেন্স তালিকা দেখুন</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
