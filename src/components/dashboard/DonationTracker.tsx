import { Droplet, Calendar, AlertTriangle, CheckCircle2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { bnNum, formatBnDate, type DonorMetrics } from "@/lib/donor-metrics";

export function DonationTracker({
  metrics,
  onUpdate,
}: {
  metrics: DonorMetrics;
  onUpdate: () => void;
}) {
  const cooldownProgress = metrics.daysSinceLast
    ? Math.min(100, (metrics.daysSinceLast / 90) * 100)
    : 0;

  return (
    <Card className="p-5 hover-lift animate-fade-in-up">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Droplet className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">রক্তদান ট্র্যাকার</h3>
          <p className="text-xs text-muted-foreground">আপনার রক্তদানের ইতিহাস</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-muted/40 p-3">
          <div className="text-xs text-muted-foreground">মোট রক্তদান</div>
          <div className="mt-1 text-2xl font-bold text-foreground">
            {bnNum(metrics.donationCount)} <span className="text-sm font-normal text-muted-foreground">বার</span>
          </div>
        </div>
        <div className="rounded-xl bg-muted/40 p-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            সর্বশেষ রক্তদান
          </div>
          <div className="mt-1 text-sm font-semibold text-foreground">
            {metrics.daysSinceLast === null
              ? "নেই"
              : `${bnNum(metrics.daysSinceLast)} দিন আগে`}
          </div>
        </div>
      </div>

      {metrics.daysSinceLast !== null && (
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">পুনরায় দানের যোগ্যতা</span>
            <span className="font-semibold text-foreground">
              {bnNum(Math.min(metrics.daysSinceLast, 90))}/{bnNum(90)} দিন
            </span>
          </div>
          <Progress value={cooldownProgress} className="h-2" />
        </div>
      )}

      {metrics.isEligible ? (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-sm">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <div>
            <p className="font-semibold text-success">আপনি এখন রক্ত দিতে পারবেন ✓</p>
            <p className="text-xs text-muted-foreground">
              কেউ প্রয়োজন হলে যোগাযোগ করতে পারবে।
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
          <div>
            <p className="font-semibold text-warning-foreground">
              আপনি {bnNum(metrics.daysUntilEligible)} দিন পর আবার রক্ত দিতে পারবেন
            </p>
            <p className="text-xs text-muted-foreground">
              পরবর্তী যোগ্যতা: {formatBnDate(metrics.nextEligibleDate)}
            </p>
          </div>
        </div>
      )}

      <Button onClick={onUpdate} variant="outline" size="sm" className="mt-4 w-full">
        <Plus className="h-4 w-4" />
        রক্তদান আপডেট করুন
      </Button>
    </Card>
  );
}
