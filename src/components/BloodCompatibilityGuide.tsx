import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Droplet, CheckCircle2, XCircle, Sparkles, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type BloodGroup, BLOOD_GROUPS } from "@/lib/supabase";
import { COMPATIBILITY_DATA, type CompatibilityMode } from "@/lib/blood-compatibility";

export function BloodCompatibilityGuide({ className = "" }: { className?: string }) {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>("O+");
  const [mode, setMode] = useState<CompatibilityMode>("donate");

  const current = COMPATIBILITY_DATA[selectedGroup];

  const isCompatible = (targetGroup: BloodGroup): boolean => {
    if (mode === "donate") {
      return current.canDonateTo.includes(targetGroup);
    }
    return current.canReceiveFrom.includes(targetGroup);
  };

  const compatibleList = mode === "donate" ? current.canDonateTo : current.canReceiveFrom;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Group Selector Pills */}
      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm md:p-6">
        <div className="mb-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            রক্তের গ্রুপ নির্বাচন করুন
          </span>
          <h3 className="mt-1 text-lg font-bold text-foreground md:text-xl">
            আপনার বা রোগীর রক্তের গ্রুপ কোনটি?
          </h3>
        </div>

        {/* 8 Blood Group Buttons */}
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-3">
          {BLOOD_GROUPS.map((bg) => {
            const isSelected = selectedGroup === bg;
            const data = COMPATIBILITY_DATA[bg];

            return (
              <button
                key={bg}
                type="button"
                onClick={() => setSelectedGroup(bg)}
                className={`relative flex flex-col items-center justify-center rounded-xl p-3 font-display transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-br from-primary to-[oklch(0.5_0.24_20)] text-white shadow-md scale-105 ring-2 ring-primary/40 ring-offset-2 ring-offset-background"
                    : "border border-border/80 bg-background text-foreground hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                {data.isUniversalDonor && (
                  <span
                    className="absolute -top-1.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-xs"
                    title="সার্বজনীন দাতা"
                  >
                    ★
                  </span>
                )}
                {data.isUniversalRecipient && (
                  <span
                    className="absolute -top-1.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white shadow-xs"
                    title="সার্বজনীন গ্রহীতা"
                  >
                    ★
                  </span>
                )}
                <span className="text-xl font-extrabold">{bg}</span>
                <span
                  className={`text-[10px] mt-0.5 ${isSelected ? "text-white/80" : "text-muted-foreground"}`}
                >
                  {data.nameBn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl border border-border bg-muted/40 p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setMode("donate")}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
              mode === "donate"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${mode === "donate" ? "text-primary fill-primary/20" : ""}`}
            />
            <span>আমি রক্ত দিতে চাই (Can Donate To)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("receive")}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
              mode === "receive"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Droplet
              className={`h-4 w-4 ${mode === "receive" ? "text-primary fill-primary/20" : ""}`}
            />
            <span>আমার রক্ত প্রয়োজন (Can Receive From)</span>
          </button>
        </div>
      </div>

      {/* Hero Summary Card for Selected Blood Group */}
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/[0.04] p-6 shadow-elegant md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
              <span className="font-display text-2xl font-black">{selectedGroup}</span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-xl font-bold text-foreground md:text-2xl">
                  রক্তের গ্রুপ: {selectedGroup} ({current.nameBn})
                </h4>
                {current.isUniversalDonor && (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                    সার্বজনীন দাতা (Universal Donor)
                  </span>
                )}
                {current.isUniversalRecipient && (
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 border border-amber-500/20">
                    সার্বজনীন গ্রহীতা (Universal Recipient)
                  </span>
                )}
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  {current.rarityBn}
                </span>
              </div>

              <p className="mt-2 text-sm font-medium text-primary">{current.summaryBn}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-2xl">
                {current.detailsBn}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <Button asChild variant="premium" size="lg" className="w-full md:w-auto">
              <Link to="/directory" search={{ bg: selectedGroup } as never}>
                <Search className="h-4 w-4" />
                <span>{selectedGroup} ডোনার খুঁজুন</span>
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Visual Compatibility Grid of all 8 Groups */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-foreground">
            {mode === "donate"
              ? `${selectedGroup} রক্তের ব্যক্তি যাদের রক্ত দিতে পারবেন (${compatibleList.length}টি গ্রুপ):`
              : `${selectedGroup} রক্তের রোগী যাদের থেকে রক্ত নিতে পারবেন (${compatibleList.length}টি গ্রুপ):`}
          </h4>
          <span className="text-xs text-muted-foreground">
            সবুজ চিহ্নিত গ্রুপগুলো সামঞ্জস্যপূর্ণ
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          {BLOOD_GROUPS.map((target) => {
            const compatible = isCompatible(target);

            return (
              <div
                key={target}
                className={`relative flex items-center justify-between rounded-2xl border p-4 transition-all ${
                  compatible
                    ? "border-emerald-500/40 bg-emerald-500/[0.08] shadow-sm hover:border-emerald-500/60"
                    : "border-border/60 bg-muted/20 opacity-55 hover:opacity-75"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl font-display text-lg font-extrabold ${
                      compatible
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {target}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      {COMPATIBILITY_DATA[target].nameBn}
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        compatible ? "text-emerald-600" : "text-muted-foreground"
                      }`}
                    >
                      {compatible ? "✓ সামঞ্জস্যপূর্ণ" : "✕ অসামঞ্জস্যপূর্ণ"}
                    </div>
                  </div>
                </div>

                {compatible ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground/60" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Medical Highlights & FAQ Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5 border-border/80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <h5 className="mt-3 font-bold text-foreground">সার্বজনীন রক্তদাতা (O-)</h5>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            O নেগেটিভ রক্তে কোনো অ্যান্টিজেন না থাকায় যে কাউকে জরুরি মুহূর্তে এই রক্ত দেওয়া যায়।
            যেকোনো ব্লাড ব্যাংকে O- রক্তের গুরুত্ব সর্বোচ্চ।
          </p>
        </Card>

        <Card className="p-5 border-border/80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Heart className="h-5 w-5" />
          </div>
          <h5 className="mt-3 font-bold text-foreground">সার্বজনীন রক্তগ্রহীতা (AB+)</h5>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            AB পজিটিভ রক্তের মানুষ যেকোনো গ্রুপের (A, B, AB, O) রক্ত গ্রহণ করতে পারেন। কোনো
            অ্যান্টিবডি অন্য রক্তকে আক্রমণ করে না।
          </p>
        </Card>

        <Card className="p-5 border-border/80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h5 className="mt-3 font-bold text-foreground">রক্তদানের বিরতি (৯০ দিন)</h5>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            একবার রক্তদানের পর মানবদেহ কয়েক সপ্তাহের মধ্যেই হারানো রক্ত কোষ পুনর্নির্মাণ করে। তবে
            পূর্ণ নিরাপত্তার জন্য প্রতি ৩ মাস (৯০ দিন) পরপর রক্ত দেওয়া নিরাপদ।
          </p>
        </Card>
      </div>
    </div>
  );
}
