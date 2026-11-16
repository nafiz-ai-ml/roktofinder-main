import { createFileRoute, Link } from "@tanstack/react-router";
import { Radar, ArrowLeft, Droplet, Building2, Ambulance, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InteractiveLiveRadar } from "@/components/InteractiveLiveRadar";

export const Route = createFileRoute("/radar")({
  head: () => ({
    meta: [
      { title: "লাইভ ম্যাপ ও রেডার — ময়মনসিংহ জরুরি স্বাস্থ্যসেবা | RoktoFinder" },
      {
        name: "description",
        content:
          "ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল (MMCH) সহ শহরের ৫-১৫ কি.মি. ব্যাসার্ধের মধ্যে রক্তদাতা, ব্লাড ব্যাংক ও অ্যাম্বুলেন্স স্ট্যান্ডের লাইভ রেডার ও ইন্টারেক্টিভ ম্যাপ।",
      },
      {
        property: "og:title",
        content: "লাইভ ম্যাপ ও রেডার — RoktoFinder",
      },
      {
        property: "og:description",
        content:
          "মানচিত্রের ওপর নিকটস্থ রক্তদাতা, হাসপাতাল ও জরুরি অ্যাম্বুলেন্স স্ট্যান্ড খুঁজুন।",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RadarPage,
});

function RadarPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/[0.06] via-background to-background py-10 md:py-14">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6">
            {/* Breadcrumb */}
            <div className="mb-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Link
                to="/"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>হোমে ফিরে যান</span>
              </Link>
              <span>/</span>
              <span className="text-foreground">লাইভ ম্যাপ ও রেডার</span>
            </div>

            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Radar className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "6s" }} />
                <span>ময়মনসিংহ জরুরি স্বাস্থ্যসেবা রেডার</span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                লাইভ{" "}
                <span className="bg-gradient-to-r from-primary via-destructive to-primary bg-clip-text text-transparent">
                  ম্যাপ ভিউ
                </span>{" "}
                ও রেডার
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
                আপনার অবস্থান বা ময়মনসিংহ মেডিকেল থেকে ৫-১০ কি.মি. দূরত্বের মধ্যে কোন কোন রক্তদাতা,
                ব্লাড ব্যাংক ও অ্যাম্বুলেন্স রয়েছে তা ইন্টারেক্টিভ মানচিত্রে তাৎক্ষণিকভাবে চিহ্নিত
                করুন।
              </p>
            </div>
          </div>
        </section>

        {/* Live Radar Map Section */}
        <section className="container mx-auto px-4 py-8 sm:px-6 md:py-10">
          <InteractiveLiveRadar />
        </section>
      </main>

      <Footer />
    </div>
  );
}
