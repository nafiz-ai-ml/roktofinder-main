import { Link } from "@tanstack/react-router";
import { Building2, Phone, MapPin, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HOSPITALS_DATA } from "@/lib/data/hospitals-data";

export function HospitalsSection() {
  // Show first 4 top hospitals
  const topHospitals = HOSPITALS_DATA.slice(0, 4);

  return (
    <section className="relative overflow-hidden py-14 md:py-20 border-t border-border/60 bg-gradient-to-b from-background via-blue-500/[0.02] to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
            <Building2 className="h-3.5 w-3.5" />
            <span>ময়মনসিংহ স্বাস্থ্যসেবা নেটওয়ার্ক</span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-extrabold text-foreground md:text-4xl lg:text-5xl">
            ময়মনসিংহের প্রধান হাসপাতাল ও ব্লাড ব্যাংক ডিরেক্টরি
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg leading-relaxed">
            জরুরি প্রয়োজনে রক্তের সন্ধানে বা রোগীর উন্নত চিকিৎসার জন্য ময়মনসিংহের শীর্ষ সরকারি ও
            বেসরকারি স্বাস্থ্যকেন্দ্রগুলোর ভেরিফায়েড হটলাইন এবং রক্তের ব্যাংকের ঠিকানা।
          </p>
        </div>

        {/* 4 Featured Hospital Cards Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {topHospitals.map((hosp) => (
            <Card
              key={hosp.id}
              className="group flex flex-col justify-between overflow-hidden border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 font-bold group-hover:scale-110 transition-transform">
                    <Building2 className="h-5 w-5" />
                  </div>
                  {hosp.bloodBankAvailable ? (
                    <Badge className="border border-rose-500/30 bg-rose-500/10 text-rose-600 text-[10px] font-bold">
                      🩸 ব্লাড ব্যাংক
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      হাসপাতাল
                    </Badge>
                  )}
                </div>

                <h3 className="mt-4 font-bold text-base text-foreground group-hover:text-blue-600 transition-colors leading-snug">
                  {hosp.nameBn}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{hosp.address}</p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-semibold">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span>{hosp.area}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-border/60 pt-3">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full gap-2 border-blue-500/30 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold"
                >
                  <a href={`tel:${hosp.emergencyHotline}`}>
                    <Phone className="h-3.5 w-3.5" />
                    <span>কল: {hosp.emergencyHotline}</span>
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Banner & CTA Link */}
        <div className="mt-10 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/5 via-blue-500/10 to-transparent p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">
                সকল সরকারি, বেসরকারি হাসপাতাল ও ব্লাড ব্যাংক
              </h4>
              <p className="text-xs text-muted-foreground">
                রেড ক্রিসেন্ট, সন্ধানী, সিবিএমসিবি, স্বদেশ, নেক্সাস, পপুলার সহ সকল
                স্বাস্থ্যকেন্দ্রের লাইভ ডিরেক্টরি।
              </p>
            </div>
          </div>

          <Button asChild className="shrink-0 gap-2 font-bold shadow-md">
            <Link to="/hospitals">
              <span>সম্পূর্ণ হাসপাতাল ডিরেক্টরি দেখুন</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
