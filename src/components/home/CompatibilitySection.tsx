import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { HeartHandshake, CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/supabase";
import { COMPATIBILITY_DATA } from "@/lib/blood-compatibility";

export function CompatibilitySection() {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>("O+");
  const currentInfo = COMPATIBILITY_DATA[selectedGroup];

  return (
    <section className="relative overflow-hidden py-14 md:py-20 border-t border-border/60 bg-gradient-to-b from-background via-accent/15 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>বিজ্ঞানসম্মত সামঞ্জস্যতা নির্দেশিকা</span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-extrabold text-foreground md:text-4xl lg:text-5xl">
            কে কাকে রক্ত দিতে পারবেন? সহজে জানুন
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg leading-relaxed">
            রক্তদানের ক্ষেত্রে রক্তের গ্রুপ ও Rh ফ্যাক্টরের সঠিক সামঞ্জস্য জীবন রক্ষার মূল শর্ত।
            নিচের যেকোনো রক্তের গ্রুপ নির্বাচন করে এখনই দেখে নিন তার সামঞ্জস্যতা।
          </p>
        </div>

        {/* Blood Group Quick Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {BLOOD_GROUPS.map((bg) => {
            const isSelected = selectedGroup === bg;
            return (
              <button
                key={bg}
                type="button"
                onClick={() => setSelectedGroup(bg)}
                className={`flex h-12 w-14 cursor-pointer items-center justify-center rounded-2xl text-base font-black transition-all duration-200 md:h-14 md:w-16 md:text-lg ${
                  isSelected
                    ? "scale-105 border-2 border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "border border-border/70 bg-card text-foreground hover:border-primary/40 hover:bg-accent"
                }`}
              >
                {bg}
              </button>
            );
          })}
        </div>

        {/* Selected Group Dynamic Result Matrix */}
        <div className="mt-8 mx-auto max-w-4xl">
          <Card className="overflow-hidden border-border/80 bg-card/90 p-6 shadow-xl backdrop-blur-xl md:p-8">
            <div className="flex flex-col items-center justify-between gap-4 border-b border-border/60 pb-6 md:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-black shadow-md">
                  {selectedGroup}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    রক্তের গ্রুপ: {selectedGroup} ({currentInfo?.nameBn})
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {currentInfo?.summaryBn || currentInfo?.detailsBn}
                  </p>
                </div>
              </div>

              <Button asChild variant="outline" size="sm" className="gap-1.5 font-semibold">
                <Link to="/directory" search={{ bg: selectedGroup }}>
                  <span>{selectedGroup} ডোনার খুঁজুন</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            {/* Give vs Receive Two-Column Display */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Can Donate To */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>কাকে রক্ত দিতে পারবেন (Can Donate To)</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedGroup} গ্রুপের দাতা এই রোগীদের রক্ত দিতে পারবেন:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(currentInfo?.canDonateTo || []).map((bg) => (
                    <Badge
                      key={bg}
                      className="border border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1 text-xs"
                    >
                      {bg}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Can Receive From */}
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
                  <ShieldCheck className="h-4 w-4" />
                  <span>কার থেকে রক্ত নিতে পারবেন (Can Receive From)</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedGroup} গ্রুপের রোগী এই দাতাদের রক্ত গ্রহণ করতে পারবেন:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(currentInfo?.canReceiveFrom || []).map((bg) => (
                    <Badge
                      key={bg}
                      className="border border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-300 font-bold px-3 py-1 text-xs"
                    >
                      {bg}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Universal Donor & Recipient Highlight Cards */}
        <div className="mt-8 mx-auto max-w-4xl grid gap-4 md:grid-cols-2">
          <Card className="border-border/70 bg-card p-5 shadow-sm transition-all hover:border-primary/40">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 font-black text-sm">
                O-
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">
                    সার্বজনীন রক্তদাতা (Universal Donor)
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-amber-500/30 text-amber-600 font-semibold"
                  >
                    জরুরি ভরসা
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  O- নেগেটিভ গ্রুপের রক্তে কোনো অ্যান্টিজেন না থাকায় যেকোনো রক্তের গ্রুপের রোগীকে
                  জরুরি মুহূর্তে এই রক্ত দেওয়া যায়।
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-border/70 bg-card p-5 shadow-sm transition-all hover:border-primary/40">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-black text-sm">
                AB+
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">
                    সার্বজনীন গ্রহীতা (Universal Recipient)
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-primary/30 text-primary font-semibold"
                  >
                    সর্বগ্রাহী
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  AB+ পজিটিভ গ্রুপের রক্তের রোগীরা যেকোনো গ্রুপের (A, B, AB, O) রক্ত নিরাপদে শরীরে
                  গ্রহণ করতে পারেন।
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Full Guide Link */}
        <div className="mt-8 text-center">
          <Button asChild size="lg" className="gap-2 font-bold shadow-elegant">
            <Link to="/compatibility">
              <Sparkles className="h-4 w-4" />
              <span>পূর্ণাঙ্গ রক্তের সামঞ্জস্যতা ক্যালকুলেটর খুলুন</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
