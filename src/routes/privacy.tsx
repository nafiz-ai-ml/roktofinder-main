import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "গোপনীয়তা নীতি — RoktoFinder" },
      {
        name: "description",
        content:
          "RoktoFinder কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার ও সুরক্ষিত রাখে — আমাদের গোপনীয়তা নীতি পড়ুন।",
      },
      { property: "og:title", content: "গোপনীয়তা নীতি — RoktoFinder" },
      {
        property: "og:description",
        content: "আপনার তথ্যের সুরক্ষা ও গোপনীয়তা সম্পর্কিত আমাদের নীতিমালা।",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: "আমরা কী তথ্য সংগ্রহ করি",
      content:
        "নাম, রক্তের গ্রুপ, মোবাইল নম্বর, এলাকা ও সর্বশেষ রক্তদানের তারিখ। ছবি ঐচ্ছিক। আমরা শুধু রক্তদাতা মেলাতে প্রয়োজনীয় তথ্যই নিই।",
    },
    {
      icon: Eye,
      title: "তথ্য কীভাবে দেখানো হয়",
      content:
        "আপনার নাম ও রক্তের গ্রুপ পাবলিক, কিন্তু মোবাইল নম্বর শুধুমাত্র যাচাইকৃত ব্যবহারকারীদের কাছে দৃশ্যমান। আপনি যেকোনো সময় profile hide করতে পারবেন।",
    },
    {
      icon: Lock,
      title: "তথ্য সুরক্ষা",
      content:
        "সব password encrypted আকারে সংরক্ষিত। ডেটাবেসে Row Level Security (RLS) প্রয়োগ করা আছে যাতে কেউ অননুমোদিতভাবে তথ্য access করতে না পারে।",
    },
    {
      icon: UserCheck,
      title: "আপনার অধিকার",
      content:
        "আপনি যেকোনো সময় account delete বা তথ্য update করতে পারবেন। ডেটা export এর জন্য আমাদের সাথে যোগাযোগ করুন।",
    },
    {
      icon: Shield,
      title: "তৃতীয় পক্ষের সাথে শেয়ারিং",
      content:
        "আমরা আপনার ব্যক্তিগত তথ্য কোনো বিজ্ঞাপনদাতা বা তৃতীয় পক্ষের কাছে বিক্রি করি না। শুধু আইনি প্রয়োজনে কর্তৃপক্ষের সাথে শেয়ার হতে পারে।",
    },
    {
      icon: Mail,
      title: "যোগাযোগ",
      content:
        "গোপনীয়তা সংক্রান্ত যেকোনো প্রশ্নে আমাদের email করুন: roktofinder@gmail.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              গোপনীয়তা নীতি
            </h1>
            <p className="mt-3 text-muted-foreground">
              সর্বশেষ আপডেট: {new Date().toLocaleDateString("bn-BD")}
            </p>
          </div>

          <div className="grid gap-5">
            {sections.map((s) => (
              <Card key={s.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{s.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {s.content}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
