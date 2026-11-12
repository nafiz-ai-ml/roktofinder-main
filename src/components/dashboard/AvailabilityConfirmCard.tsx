import { ShieldCheck, CalendarCheck, HeartPulse, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  bnNum,
  confirmedAgoLabel,
  formatBnDate,
  type FreshnessInfo,
  type DonorMetrics,
} from "@/lib/donor-metrics";

const TONE: Record<FreshnessInfo["tone"], string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/20 text-warning-foreground",
  muted: "bg-muted text-muted-foreground",
  destructive: "bg-destructive/10 text-destructive",
};

export function AvailabilityConfirmCard({
  freshness,
  metrics,
  lastDonationDate,
  onConfirm,
  saving,
}: {
  freshness: FreshnessInfo;
  metrics: DonorMetrics;
  lastDonationDate: string | null;
  onConfirm: (available: boolean) => void;
  saving: boolean;
}) {
  const needsConfirm =
    freshness.state === "unconfirmed" ||
    freshness.state === "stale" ||
    freshness.state === "inactive";

  return (
    <Card className="p-5 hover-lift animate-fade-in-up">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">উপলব্ধতা</h3>
          <p className="text-xs text-muted-foreground">
            আপনার বর্তমান অবস্থা ও সর্বশেষ নিশ্চিতকরণ
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-muted/40 p-3">
          <div className="text-xs text-muted-foreground">বর্তমান অবস্থা</div>
          <span
            className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${TONE[freshness.tone]}`}
          >
            {freshness.state === "fresh" ? (
              <ShieldCheck className="h-3 w-3" />
            ) : (
              <HelpCircle className="h-3 w-3" />
            )}
            {freshness.label}
          </span>
        </div>
        <div className="rounded-xl bg-muted/40 p-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarCheck className="h-3 w-3" />
            সর্বশেষ নিশ্চিত
          </div>
          <div className="mt-1 text-sm font-semibold text-foreground">
            {confirmedAgoLabel(freshness.confirmedDaysAgo)}
          </div>
        </div>
        <div className="rounded-xl bg-muted/40 p-3">
          <div className="text-xs text-muted-foreground">সর্বশেষ রক্তদান</div>
          <div className="mt-1 text-sm font-semibold text-foreground">
            {lastDonationDate ? formatBnDate(lastDonationDate) : "নেই"}
          </div>
        </div>
      </div>

      {!metrics.isEligible ? (
        <p className="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning-foreground">
          আপনি {bnNum(metrics.daysUntilEligible)} দিন পর আবার রক্ত দিতে পারবেন — তার আগে
          উপলব্ধতা নিশ্চিত করার দরকার নেই।
        </p>
      ) : needsConfirm ? (
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-sm font-semibold text-foreground">
            আপনি কি এখনো রক্তদানের জন্য প্রস্তুত?
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            নিশ্চিত করলে খোঁজার সময় আপনাকে আগে দেখানো হবে।
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button
              size="sm"
              className="flex-1"
              disabled={saving}
              onClick={() => onConfirm(true)}
            >
              হ্যাঁ, আমি প্রস্তুত
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              disabled={saving}
              onClick={() => onConfirm(false)}
            >
              না, এখন পারছি না
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-success/30 bg-success/10 p-3">
          <p className="text-xs text-success">
            ✓ আপনার উপলব্ধতা সম্প্রতি নিশ্চিত করা হয়েছে।
          </p>
          <Button
            size="sm"
            variant="outline"
            disabled={saving}
            onClick={() => onConfirm(true)}
          >
            আবার নিশ্চিত করুন
          </Button>
        </div>
      )}
    </Card>
  );
}
