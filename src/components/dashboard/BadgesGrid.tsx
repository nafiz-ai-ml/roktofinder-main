import { Award, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { type BadgeDef } from "@/lib/donor-metrics";
import { cn } from "@/lib/utils";

export function BadgesGrid({ badges }: { badges: BadgeDef[] }) {
  const earnedCount = badges.filter((b) => b.earned).length;
  return (
    <Card className="p-5 hover-lift animate-fade-in-up">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">আপনার ব্যাজসমূহ</h3>
            <p className="text-xs text-muted-foreground">
              {badges.length} টির মধ্যে {earnedCount} টি অর্জিত
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {badges.map((b) => (
          <div
            key={b.id}
            className={cn(
              "group relative rounded-xl border p-3 text-center transition-all duration-300",
              b.earned
                ? "border-warning/40 bg-gradient-to-br from-warning/10 to-warning/5 hover:scale-105 hover:shadow-[var(--shadow-elegant)]"
                : "border-dashed border-border bg-muted/30 opacity-60",
            )}
          >
            <div className="text-3xl">{b.earned ? b.emoji : <Lock className="mx-auto h-6 w-6 text-muted-foreground" />}</div>
            <div className="mt-2 text-xs font-semibold text-foreground">{b.label}</div>
            <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
              {b.description}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
