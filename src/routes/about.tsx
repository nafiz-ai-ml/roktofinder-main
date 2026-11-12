import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  Droplet,
  ArrowRight,
  MapPin,
  Quote,
  ShieldAlert,
  Search,
  UserCheck,
  AlertCircle,
  ExternalLink,
  Facebook,
  Linkedin,
  Github,
  Globe,
  Compass,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  founderInfo,
  founderMessage,
  aboutPlatformPillars,
  coreValues,
  howItWorksSteps,
  journeyMilestones,
} from "@/lib/about-config";

function XIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "আমাদের সম্পর্কে ও প্রতিষ্ঠাতা — RoktoFinder" },
      {
        name: "description",
        content:
          "RoktoFinder ময়মনসিংহের একটি মানবিক রক্তদাতা প্ল্যাটফর্ম। প্রতিষ্ঠাতা মুহাম্মদ নাফিজ-এর উদ্যোগে এবং আল ফাতিহ ইসলামিক পাঠাগারের সহযোগিতায় রক্তের প্রয়োজনে মানুষকে দ্রুত ও সহজে ডোনারের সাথে যুক্ত করা।",
      },
      {
        property: "og:title",
        content: "আমাদের সম্পর্কে ও প্রতিষ্ঠাতা — RoktoFinder",
      },
      {
        property: "og:description",
        content:
          "রক্তের প্রয়োজনে মানুষ যেন মানুষের পাশে দাঁড়াতে পারে — RoktoFinder ময়মনসিংহের একটি স্থানীয় রক্তদাতা খোঁজার উদ্যোগ। জানুন প্ল্যাটফর্মের লক্ষ্য ও প্রতিষ্ঠাতার কথা।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* SECTION 01 — HERO / INTRODUCTION                                          */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/[0.06] via-background to-background py-16 sm:py-20 md:py-24 lg:py-28">
          {/* Subtle background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
          >
            <div className="h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-xs">
                <Droplet className="h-3.5 w-3.5 fill-primary/30 text-primary" />
                <span>ABOUT ROKTOFINDER</span>
              </div>

              {/* Headline */}
              <h1 className="mt-6 font-display text-3xl font-extrabold leading-[1.2] text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                &ldquo;রক্তের প্রয়োজনে মানুষ যেন মানুষের পাশে দাঁড়াতে পারে&rdquo;
              </h1>

              {/* Supporting description */}
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                RoktoFinder একটি স্থানীয় রক্তদাতা খোঁজার উদ্যোগ, যার লক্ষ্য রক্তের প্রয়োজনে মানুষকে
                তাঁদের কাছাকাছি স্বেচ্ছাসেবী রক্তদাতাদের সঙ্গে সহজে যুক্ত করা।
              </p>

              {/* Two CTA buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-6 text-base font-semibold shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                >
                  <Link to="/directory" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>ডোনার খুঁজুন</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 border-border/80 px-6 text-base font-semibold transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
                >
                  <Link to="/register" className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>ডোনার হিসেবে যুক্ত হন</span>
                  </Link>
                </Button>
              </div>

              {/* Location micro-badge */}
              <div className="mt-8 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>ময়মনসিংহ থেকে সূচিত • সারা বাংলাদেশে বিস্তৃতির প্রত্যয়</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 02 — MEET THE FOUNDER                                             */}
        {/* ========================================================================= */}
        <section id="founder" className="border-b border-border/60 py-16 sm:py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-6xl">
              {/* Section Header */}
              <div className="mb-10 text-center md:mb-14">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>MEET THE FOUNDER</span>
                </div>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                  প্রতিষ্ঠাতার পরিচিতি ও রূপকল্প
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  RoktoFinder-এর পেছনের রূপকার ও প্রযুক্তি উদ্যোক্তা
                </p>
              </div>

              {/* Two-column Founder Introduction */}
              <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Left side: Founder Portrait with Social Icons beneath */}
                <div className="order-1 lg:col-span-5">
                  <div className="relative mx-auto max-w-md lg:max-w-none">
                    {/* Decorative subtle backdrop halo */}
                    <div
                      aria-hidden="true"
                      className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 blur-xl"
                    />

                    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-2.5 shadow-soft sm:rounded-3xl sm:p-3.5">
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/50 sm:rounded-2xl">
                        {!imageError ? (
                          <img
                            src={founderInfo.image}
                            alt={founderInfo.imageAlt}
                            loading="eager"
                            onError={() => setImageError(true)}
                            className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-muted/40 p-6 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
                              MN
                            </div>
                            <div className="mt-4 font-semibold text-foreground">
                              {founderInfo.name}
                            </div>
                            <div className="text-xs text-muted-foreground">{founderInfo.title}</div>
                          </div>
                        )}
                      </div>

                      {/* Location & Name strip */}
                      <div className="mt-3 flex items-center justify-between px-1.5 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{founderInfo.nameBn}</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary" />
                          {founderInfo.location}
                        </span>
                      </div>

                      {/* Social & Portfolio Icons Strip right below photo */}
                      <div className="mt-3.5 border-t border-border/70 pt-3">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            কানেক্ট করুন:
                          </span>
                          <div className="flex items-center gap-1.5">
                            {/* Facebook */}
                            {founderInfo.socialLinks.facebook ? (
                              <a
                                href={founderInfo.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Facebook Profile"
                                aria-label="Facebook Profile"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                              >
                                <Facebook className="h-4 w-4" />
                              </a>
                            ) : (
                              <div
                                title="Facebook (শীঘ্রই যুক্ত হবে)"
                                aria-label="Facebook (শীঘ্রই যুক্ত হবে)"
                                className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-border/50 bg-muted/40 text-muted-foreground/60 transition-colors"
                              >
                                <Facebook className="h-4 w-4" />
                              </div>
                            )}

                            {/* LinkedIn */}
                            {founderInfo.socialLinks.linkedin ? (
                              <a
                                href={founderInfo.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="LinkedIn Profile"
                                aria-label="LinkedIn Profile"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                              >
                                <Linkedin className="h-4 w-4" />
                              </a>
                            ) : (
                              <div
                                title="LinkedIn (শীঘ্রই যুক্ত হবে)"
                                aria-label="LinkedIn (শীঘ্রই যুক্ত হবে)"
                                className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-border/50 bg-muted/40 text-muted-foreground/60 transition-colors"
                              >
                                <Linkedin className="h-4 w-4" />
                              </div>
                            )}

                            {/* GitHub */}
                            {founderInfo.socialLinks.github ? (
                              <a
                                href={founderInfo.socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="GitHub Profile"
                                aria-label="GitHub Profile"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            ) : (
                              <div
                                title="GitHub (শীঘ্রই যুক্ত হবে)"
                                aria-label="GitHub (শীঘ্রই যুক্ত হবে)"
                                className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-border/50 bg-muted/40 text-muted-foreground/60 transition-colors"
                              >
                                <Github className="h-4 w-4" />
                              </div>
                            )}

                            {/* X (formerly Twitter) */}
                            {founderInfo.socialLinks.x ? (
                              <a
                                href={founderInfo.socialLinks.x}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="X (Twitter) Profile"
                                aria-label="X Profile"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                              >
                                <XIcon className="h-3.5 w-3.5" />
                              </a>
                            ) : (
                              <div
                                title="X (Twitter) (শীঘ্রই যুক্ত হবে)"
                                aria-label="X (Twitter) (শীঘ্রই যুক্ত হবে)"
                                className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-border/50 bg-muted/40 text-muted-foreground/60 transition-colors"
                              >
                                <XIcon className="h-3.5 w-3.5" />
                              </div>
                            )}

                            {/* Portfolio Site (Browser / Globe Icon) */}
                            {founderInfo.socialLinks.portfolio ? (
                              <a
                                href={founderInfo.socialLinks.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Portfolio Website: muhammadnafiz.netlify.app"
                                aria-label="Founder Portfolio"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary shadow-xs transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-soft"
                              >
                                <Globe className="h-4 w-4" />
                              </a>
                            ) : (
                              <div
                                title="Portfolio (শীঘ্রই যুক্ত হবে)"
                                aria-label="Portfolio (শীঘ্রই যুক্ত হবে)"
                                className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-border/50 bg-muted/40 text-muted-foreground/60 transition-colors"
                              >
                                <Globe className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Founder Name, Title, Location & English Biography */}
                <div className="order-2 lg:col-span-7">
                  <div className="space-y-6">
                    {/* Header info */}
                    <div className="border-b border-border/60 pb-5">
                      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        <span>FOUNDER & DEVELOPER</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {founderInfo.location}
                        </span>
                      </div>

                      <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                        {founderInfo.name}
                      </h3>

                      <p className="mt-2 text-sm font-medium text-primary sm:text-base">
                        {founderInfo.title}
                      </p>
                    </div>

                    {/* Confirmed English Biography */}
                    <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
                      {founderInfo.biography.map((paragraph, idx) => (
                        <p key={idx} className="text-foreground/85">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Quick highlights badge group */}
                    <div className="pt-2">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-md border border-border/80 bg-muted/40 px-3 py-1 font-medium text-foreground">
                          Digital Products
                        </span>
                        <span className="rounded-md border border-border/80 bg-muted/40 px-3 py-1 font-medium text-foreground">
                          Web Applications
                        </span>
                        <span className="rounded-md border border-border/80 bg-muted/40 px-3 py-1 font-medium text-foreground">
                          Python &amp; ML
                        </span>
                        <span className="rounded-md border border-border/80 bg-muted/40 px-3 py-1 font-medium text-foreground">
                          Deep Learning &amp; AI
                        </span>
                        <span className="rounded-md border border-primary/20 bg-primary/5 px-3 py-1 font-medium text-primary">
                          Practical Problem Solving
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 03 — FOUNDER'S MESSAGE (BENGALI ONLY)                              */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-muted/20 py-16 sm:py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-4xl">
              {/* Card wrapper */}
              <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-background p-6 shadow-soft sm:p-10 md:p-12">
                {/* Decorative quote icon watermark */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-4 text-primary/[0.08] sm:right-8 sm:top-8"
                >
                  <Quote className="h-24 w-24 sm:h-32 sm:w-32" />
                </div>

                {/* Section heading */}
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                    <Quote className="h-3.5 w-3.5" />
                    <span>প্রতিষ্ঠাতার বার্তা</span>
                  </div>

                  <h2 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                    {founderMessage.heading}
                  </h2>
                </div>

                {/* Bengali message paragraphs */}
                <div className="relative mt-6 space-y-4 text-base leading-relaxed text-foreground/90 sm:text-lg sm:leading-relaxed">
                  {founderMessage.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Highlighted final statement */}
                <div className="relative mt-8 rounded-2xl border-l-4 border-primary bg-primary/10 p-5 sm:p-6">
                  <p className="font-display text-lg font-bold text-foreground sm:text-xl md:text-2xl">
                    &ldquo;{founderMessage.highlightQuote}&rdquo;
                  </p>
                </div>

                {/* Signature Block */}
                <div className="relative mt-8 flex items-center justify-between border-t border-border/70 pt-6">
                  <div>
                    <div className="font-display text-lg font-bold text-foreground sm:text-xl">
                      {founderMessage.signature}
                    </div>
                    <div className="text-xs text-muted-foreground sm:text-sm">
                      {founderMessage.signatureRole}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <span className="block font-medium text-foreground">ময়মনসিংহ, বাংলাদেশ</span>
                    <span>সামাজিক ও প্রযুক্তি উদ্যোগ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 04 — ABOUT ROKTOFINDER                                             */}
        {/* ========================================================================= */}
        <section className="border-y border-border/60 py-16 sm:py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto max-w-3xl text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
                  <Compass className="h-3.5 w-3.5" />
                  <span>প্ল্যাটফর্ম পরিচিতি</span>
                </div>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  RoktoFinder সম্পর্কে
                </h2>
                <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                  ময়মনসিংহের প্রেক্ষাপটে রক্তদাতা সংকট নিরসনে একটি আধুনিক ও স্বেচ্ছাসেবী ডিজিটাল
                  সেতু
                </p>
              </div>

              {/* Four Explanatory Pillars */}
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {aboutPlatformPillars.map((pillar, idx) => (
                  <Card
                    key={idx}
                    className="group relative overflow-hidden border-border/70 bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft sm:p-7"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <pillar.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                          {pillar.badge}
                        </span>
                        <h3 className="mt-2 font-display text-lg font-bold text-foreground sm:text-xl">
                          {pillar.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 05 — OUR MISSION & VALUES                                          */}
        {/* ========================================================================= */}
        <section className="bg-muted/20 py-16 sm:py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto max-w-3xl text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                  <Heart className="h-3.5 w-3.5 fill-primary/20" />
                  <span>MISSION &amp; VALUES</span>
                </div>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  আমাদের লক্ষ্য ও মূল্যবোধ
                </h2>
                <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                  স্বেচ্ছাসেবা ও দায়িত্বশীল মানবিক যোগাযোগের ভিত্তিতে আমাদের এই পথচলা
                </p>
              </div>

              {/* Grid of four value cards */}
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {coreValues.map((value, idx) => (
                  <Card
                    key={idx}
                    className="group relative flex flex-col justify-between border-border/70 bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <value.icon className="h-6 w-6" />
                        </div>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {value.tag}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-xl font-bold text-foreground">
                        {value.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {value.text}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 06 — HOW ROKTOFINDER WORKS                                         */}
        {/* ========================================================================= */}
        <section className="border-y border-border/60 py-16 sm:py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto max-w-3xl text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>কার্যপ্রণালী</span>
                </div>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  যেভাবে কাজ করে
                </h2>
                <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                  মাত্র ৪টি সহজ পদক্ষেপে রক্তের প্রয়োজনে সংযোগ স্থাপন করুন
                </p>
              </div>

              {/* 4 Steps Grid */}
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {howItWorksSteps.map((item) => (
                  <Card
                    key={item.step}
                    className="relative overflow-hidden border-border/70 bg-card p-6 shadow-card"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-3xl font-extrabold text-primary/30">
                        {item.step}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </Card>
                ))}
              </div>

              {/* Disclaimers */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-warning-foreground">
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                  <p className="text-xs leading-relaxed sm:text-sm">
                    <strong>সতর্কতা:</strong> যোগাযোগের আগে দাতার পরিচয় ও বর্তমান উপলব্ধতা যাচাই
                    করুন।
                  </p>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/10 p-4 text-foreground">
                  <Heart className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed sm:text-sm">
                    <strong>স্বাস্থ্যবিধি:</strong> শুধুমাত্র শারীরিকভাবে সক্ষম হলে রক্ত দিন। কোনো
                    অনিবন্ধিত আর্থিক লেনদেন সমর্থনযোগ্য নয়।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 07 — OUR JOURNEY (TIMELINE)                                       */}
        {/* ========================================================================= */}
        <section className="bg-muted/20 py-16 sm:py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                  <Compass className="h-3.5 w-3.5" />
                  <span>ROADMAP &amp; TIMELINE</span>
                </div>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  আমাদের যাত্রা
                </h2>
                <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                  ময়মনসিংহের সূচনাবিন্দু থেকে শুরু করে আগামীর বিস্তার
                </p>
              </div>

              {/* Timeline Container */}
              <div className="relative mt-12 space-y-8 before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-border/80 md:before:left-1/2 md:before:-translate-x-1/2">
                {journeyMilestones.map((m, idx) => (
                  <div
                    key={idx}
                    className={`relative flex flex-col gap-4 md:flex-row md:items-center ${
                      idx % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="ml-12 flex-1 md:ml-0 md:text-right">
                      <Card
                        className={`border-border/70 bg-card p-5 shadow-card sm:p-6 ${
                          idx % 2 === 0 ? "md:text-right" : "md:text-left"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 ${
                            idx % 2 === 0 ? "md:justify-end" : "md:justify-start"
                          }`}
                        >
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              m.isCompleted
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {m.status}
                          </span>
                          <span className="text-xs text-muted-foreground">{m.phase}</span>
                        </div>

                        <h3 className="mt-2 font-display text-lg font-bold text-foreground sm:text-xl">
                          {m.title}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {m.desc}
                        </p>
                      </Card>
                    </div>

                    {/* Timeline Node */}
                    <div className="absolute left-5 top-4 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-xs md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>

                    <div className="hidden flex-1 md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 08 — SOCIAL PROFILES (CONNECT WITH THE FOUNDER)                    */}
        {/* ========================================================================= */}
        <section className="border-t border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>CONNECT WITH THE FOUNDER</span>
              </div>

              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                আমাকে অনুসরণ করুন
              </h2>

              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                RoktoFinder-এর উন্নয়ন, প্রযুক্তি ভাবনা ও নতুন কার্যক্রমের সাথে যুক্ত থাকুন
              </p>

              {/* Social Cards Grid (Facebook, LinkedIn, GitHub, X, Portfolio) */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Facebook */}
                {founderInfo.socialLinks.facebook ? (
                  <a
                    href={founderInfo.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Facebook className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-foreground">Facebook</div>
                        <div className="text-xs text-muted-foreground">প্রোফাইল দেখুন</div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </a>
                ) : (
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 p-4 text-muted-foreground opacity-85">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Facebook className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-foreground/80">Facebook</div>
                        <div className="text-xs text-muted-foreground">মুহাম্মদ নাফিজ</div>
                      </div>
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      শিগগিরই যুক্ত হবে
                    </span>
                  </div>
                )}

                {/* LinkedIn */}
                {founderInfo.socialLinks.linkedin ? (
                  <a
                    href={founderInfo.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Linkedin className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-foreground">LinkedIn</div>
                        <div className="text-xs text-muted-foreground">কানেক্ট করুন</div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </a>
                ) : (
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 p-4 text-muted-foreground opacity-85">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Linkedin className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-foreground/80">LinkedIn</div>
                        <div className="text-xs text-muted-foreground">Muhammad Nafiz</div>
                      </div>
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      শিগগিরই যুক্ত হবে
                    </span>
                  </div>
                )}

                {/* GitHub */}
                {founderInfo.socialLinks.github ? (
                  <a
                    href={founderInfo.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Github className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-foreground">GitHub</div>
                        <div className="text-xs text-muted-foreground">প্রজেক্ট দেখুন</div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </a>
                ) : (
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 p-4 text-muted-foreground opacity-85">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Github className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-foreground/80">GitHub</div>
                        <div className="text-xs text-muted-foreground">ওপেন সোর্স</div>
                      </div>
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      শিগগিরই যুক্ত হবে
                    </span>
                  </div>
                )}

                {/* X (formerly Twitter) */}
                {founderInfo.socialLinks.x ? (
                  <a
                    href={founderInfo.socialLinks.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <XIcon className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-foreground">X (Twitter)</div>
                        <div className="text-xs text-muted-foreground">ফলো করুন</div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </a>
                ) : (
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 p-4 text-muted-foreground opacity-85">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <XIcon className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-foreground/80">X (Twitter)</div>
                        <div className="text-xs text-muted-foreground">টেক আপডেট</div>
                      </div>
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      শিগগিরই যুক্ত হবে
                    </span>
                  </div>
                )}

                {/* Portfolio Site (Browser / Globe Icon) */}
                {founderInfo.socialLinks.portfolio ? (
                  <a
                    href={founderInfo.socialLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:shadow-soft sm:col-span-2 lg:col-span-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            পোর্টফোলিও ওয়েবসাইট
                          </span>
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            লাইভ
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          muhammadnafiz.netlify.app
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ) : (
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 p-4 text-muted-foreground opacity-85 sm:col-span-2 lg:col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-foreground/80">
                          পোর্টফোলিও ওয়েবসাইট
                        </div>
                        <div className="text-xs text-muted-foreground">ব্রাউজার লিংক</div>
                      </div>
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      শিগগিরই যুক্ত হবে
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 09 — FINAL CALL TO ACTION                                         */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden border-t border-border/60 bg-gradient-to-b from-background via-primary/[0.04] to-primary/[0.08] py-16 sm:py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <Card className="mx-auto max-w-4xl overflow-hidden border-primary/20 bg-card/90 p-8 text-center shadow-elegant backdrop-blur-xs sm:p-12 md:p-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-xs">
                <Heart className="h-8 w-8 fill-primary/20" />
              </div>

              <h2 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                আপনিও হতে পারেন কারও বেঁচে থাকার আশার অংশ
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                আপনার একটি স্বেচ্ছাসেবী উদ্যোগ হয়তো কারও কঠিন সময়ে নতুন আশার আলো হয়ে উঠতে পারে।
              </p>

              {/* 3 CTA buttons using existing routes */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-6 text-base font-semibold shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                >
                  <Link to="/register" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>ডোনার হিসেবে যুক্ত হন</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 border-border/80 px-6 text-base font-semibold transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
                >
                  <Link to="/directory" className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    <span>ডোনার খুঁজুন</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="destructive"
                  size="lg"
                  className="h-11 px-6 text-base font-semibold transition-all hover:-translate-y-0.5"
                >
                  <Link to="/emergency" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>জরুরি রক্ত প্রয়োজন</span>
                  </Link>
                </Button>
              </div>

              {/* Supporting note */}
              <div className="mt-8 text-xs text-muted-foreground">
                <span>RoktoFinder • ময়মনসিংহের স্বেচ্ছাসেবী উদ্যোগ</span>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
