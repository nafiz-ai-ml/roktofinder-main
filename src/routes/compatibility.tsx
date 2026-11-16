import { createFileRoute, Link } from "@tanstack/react-router";
import { Droplet, Heart, ArrowLeft, Search, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BloodCompatibilityGuide } from "@/components/BloodCompatibilityGuide";

export const Route = createFileRoute("/compatibility")({
  head: () => ({
    meta: [
      { title: "রক্তের সামঞ্জস্যতা ক্যালকুলেটর ও গাইড — RoktoFinder" },
      {
        name: "description",
        content:
          "কোন রক্তের গ্রুপের রোগী কার রক্ত গ্রহণ করতে পারবেন এবং আপনি কাকে রক্ত দিতে পারবেন? সহজেই জানুন RoktoFinder-এর ইন্টারঅ্যাক্টিভ ব্লাড কম্প্যাটিবিলিটি ক্যালকুলেটরে।",
      },
      {
        property: "og:title",
        content: "রক্তের সামঞ্জস্যতা ক্যালকুলেটর — RoktoFinder",
      },
      {
        property: "og:description",
        content:
          "রক্তদানের পূর্বে জেনে নিন রক্তের সঠিক সামঞ্জস্যতা। O-, O+, A+, B+, AB+ সহ সকল গ্রুপের বিস্তারিত গাইড।",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CompatibilityPage,
});

function CompatibilityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/[0.06] via-background to-background py-12 md:py-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

          <div className="container mx-auto px-4 sm:px-6">
            {/* Breadcrumb / Back button */}
            <div className="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Link
                to="/"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>হোমে ফিরে যান</span>
              </Link>
              <span>/</span>
              <span className="text-foreground">রক্তের সামঞ্জস্যতা ক্যালকুলেটর</span>
            </div>

            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Droplet className="h-3.5 w-3.5" />
                <span>মেডিকেল ব্লাড কম্প্যাটিবিলিটি গাইড</span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                রক্তের{" "}
                <span className="bg-gradient-to-r from-primary via-destructive to-primary bg-clip-text text-transparent">
                  সামঞ্জস্যতা
                </span>{" "}
                ক্যালকুলেটর
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
                কোন রক্তের গ্রুপের মানুষ কার রক্ত নিতে পারবেন এবং কাকে রক্ত দিতে পারবেন? জরুরি
                প্রয়োজনে দ্রুত সঠিক সিদ্ধান্ত নিতে নিচের ইন্টারঅ্যাক্টিভ গাইডটি ব্যবহার করুন।
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="container mx-auto px-4 py-10 sm:px-6 md:py-14">
          <BloodCompatibilityGuide />
        </section>
      </main>

      <Footer />
    </div>
  );
}
