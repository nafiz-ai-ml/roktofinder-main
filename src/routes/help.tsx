import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LifeBuoy, UserPlus, Search, Mail, AlertCircle, MessageCircle, X, Shield, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "সাহায্য কেন্দ্র — RoktoFinder" },
      {
        name: "description",
        content:
          "RoktoFinder ব্যবহারের গাইড, সাধারণ প্রশ্নোত্তর ও সাপোর্ট — সবকিছু এক জায়গায়।",
      },
      { property: "og:title", content: "সাহায্য কেন্দ্র — RoktoFinder" },
      {
        property: "og:description",
        content: "রক্তদাতা খোঁজা, registration ও জরুরি অনুরোধ সম্পর্কে সকল প্রশ্নের উত্তর।",
      },
    ],
  }),
  component: HelpPage,
});

type FaqCategory = "all" | "account" | "privacy" | "donation";

function HelpPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FaqCategory>("all");
  const quickGuides = [
    {
      icon: UserPlus,
      title: "Registration",
      desc: "মাত্র ২ মিনিটে দাতা হিসেবে নিবন্ধন করুন।",
      to: "/register" as const,
    },
    {
      icon: Search,
      title: "দাতা খুঁজুন",
      desc: "রক্তের গ্রুপ ও এলাকা অনুযায়ী filter করুন।",
      to: "/directory" as const,
    },
    {
      icon: AlertCircle,
      title: "জরুরি অনুরোধ",
      desc: "Emergency পেজে গিয়ে দ্রুত সাহায্য নিন।",
      to: "/emergency" as const,
    },
  ];

  const faqs: { q: string; a: string; category: Exclude<FaqCategory, "all"> }[] = [
    {
      q: "Registration করতে কি টাকা লাগে?",
      a: "না, RoktoFinder সম্পূর্ণ ফ্রি। কোনো subscription বা hidden charge নেই।",
      category: "account",
    },
    {
      q: "আমার মোবাইল নম্বর কি সবাই দেখতে পাবে?",
      a: "না, শুধুমাত্র যাচাইকৃত (verified) ব্যবহারকারী যারা রক্ত খুঁজছেন তারাই আপনার নম্বর দেখতে পাবেন।",
      category: "privacy",
    },
    {
      q: "কতদিন পর পর রক্ত দেওয়া যায়?",
      a: "পুরুষদের জন্য ৩ মাস ও মহিলাদের জন্য ৪ মাস অন্তর রক্ত দেওয়া নিরাপদ। আমরা স্বয়ংক্রিয়ভাবে আপনার eligibility track করি।",
      category: "donation",
    },
    {
      q: "আমি কি যেকোনো সময় profile hide করতে পারি?",
      a: "হ্যাঁ, Dashboard-এ লগইন করে 'উপলব্ধতা' (Availability) toggle off করলে আপনার profile সাময়িকভাবে hide হয়ে যাবে — অর্থাৎ search-এ আর show করবে না। Permanently delete করতে roktofinder@gmail.com-এ যোগাযোগ করুন।",
      category: "privacy",
    },
    {
      q: "জরুরি প্রয়োজনে কীভাবে দ্রুত দাতা পাব?",
      a: "Emergency পেজে গিয়ে আপনার অনুরোধ post করুন। কাছাকাছি দাতাদের কাছে instant notification যাবে।",
      category: "donation",
    },
    {
      q: "Account delete করলে কি ডেটা থেকে যাবে?",
      a: "না, account delete করলে ৩০ দিনের মধ্যে আপনার সমস্ত ব্যক্তিগত তথ্য আমাদের server থেকে স্থায়ীভাবে মুছে যাবে। delete-এর জন্য roktofinder@gmail.com-এ যোগাযোগ করুন।",
      category: "account",
    },
    {
      q: "Password ভুলে গেলে কী করব?",
      a: "Login পেজে 'পাসওয়ার্ড ভুলে গেছেন?' বোতামে ক্লিক করে আপনার নিবন্ধিত মোবাইল নম্বর জমা দিন। আমরা যাচাই করে সম্ভব দ্রুততম সময়ে নতুন পাসওয়ার্ড আপনার নম্বর/ইমেইলে পাঠিয়ে দেব ইনশাআল্লাহ।",
      category: "account",
    },
    {
      q: "একাধিক device থেকে login করা যাবে কি?",
      a: "হ্যাঁ, একই account দিয়ে mobile, tablet ও desktop — সব device থেকে login করতে পারবেন। 'Remember me' tick দিলে session অনেকদিন থাকবে।",
      category: "account",
    },
    {
      q: "আমার তথ্য কি Google search এ দেখাবে?",
      a: "না, profile pages search engine থেকে block করা আছে। শুধু RoktoFinder এর verified user-রাই দাতা search করতে পারে।",
      category: "privacy",
    },
    {
      q: "Location share করা কি বাধ্যতামূলক?",
      a: "না, শুধু এলাকার নাম (যেমন: ময়মনসিংহ সদর) দিলেই হবে। Exact GPS location share করা ঐচ্ছিক — emergency দ্রুত matching এর জন্য কাজে লাগে।",
      category: "privacy",
    },
    {
      q: "প্রথমবার রক্ত দিতে চাইলে কী জানা দরকার?",
      a: "বয়স ১৮-৬০, ওজন কমপক্ষে ৫০ কেজি, hemoglobin ১২.৫+ থাকতে হবে। দান এর আগে ভালোভাবে খাবেন ও পানি খাবেন। প্রক্রিয়া মাত্র ১০-১৫ মিনিট।",
      category: "donation",
    },
    {
      q: "রক্ত দেওয়ার পর কী করতে হবে?",
      a: "১৫-২০ মিনিট বিশ্রাম, প্রচুর পানি ও তরল খাবার, ভারী কাজ ২৪ ঘণ্টা এড়িয়ে চলুন। দুর্বল লাগলে শুয়ে থাকুন ও কাউকে জানান।",
      category: "donation",
    },
    {
      q: "ঠাণ্ডা/জ্বর হলে কি রক্ত দিতে পারব?",
      a: "না, সুস্থ হওয়ার অন্তত ৭ দিন পর রক্ত দান করুন। Antibiotic চলমান থাকলেও দান করা যাবে না।",
      category: "donation",
    },
    {
      q: "Notification বন্ধ করব কীভাবে?",
      a: "Dashboard > Settings > Notifications থেকে SMS/Email/Push notification আলাদা ভাবে on-off করতে পারবেন।",
      category: "account",
    },
  ];

  const categories: { key: FaqCategory; label: string }[] = [
    { key: "all", label: "সব" },
    { key: "account", label: "Account" },
    { key: "privacy", label: "গোপনীয়তা" },
    { key: "donation", label: "রক্তদান" },
  ];

  const renderCategoryIcon = (key: FaqCategory) => {
    const cls = "h-3.5 w-3.5";
    if (key === "all") return <LifeBuoy className={cls} />;
    if (key === "account") return <UserPlus className={cls} />;
    if (key === "privacy") return <Shield className={cls} />;
    return <Droplet className={cls} />;
  };

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchCat = category === "all" || f.category === category;
      const matchQ = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, category]);


  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LifeBuoy className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              সাহায্য কেন্দ্র
            </h1>
            <p className="mt-3 text-muted-foreground">
              আপনার সব প্রশ্নের উত্তর এক জায়গায়
            </p>
          </div>

          <div className="mb-10 grid gap-5 md:grid-cols-3">
            {quickGuides.map((g) => (
              <Link key={g.title} to={g.to} className="block">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <g.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="mt-3 text-base">{g.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {g.desc}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">সাধারণ প্রশ্নোত্তর (FAQ)</CardTitle>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((c) => {
                  const active = category === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setCategory(c.key)}
                      className={
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all " +
                        (active
                          ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground")
                      }
                    >
                      {renderCategoryIcon(c.key)}
                      {c.label}
                    </button>
                  );
                })}
              </div>
              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="প্রশ্ন খুঁজুন... (যেমন: registration, মোবাইল)"
                  className="pl-9 pr-9"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  কোনো প্রশ্ন পাওয়া যায়নি। অন্য keyword দিয়ে চেষ্টা করুন।
                </p>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((f, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger className="text-left text-base">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <CardTitle>আরও সাহায্য প্রয়োজন?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                সরাসরি আমাদের সাথে যোগাযোগ করুন। সম্ভব দ্রুততম সময়ে উত্তর দেওয়ার চেষ্টা করব।
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href="mailto:roktofinder@gmail.com">
                    <Mail className="mr-2 h-4 w-4" />
                    roktofinder@gmail.com
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
