import { Heart, Users, Eye, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { bnNum } from "@/lib/donor-metrics";

interface ImpactStats {
  profileViews: number;
  contactsReceived: number;
  helped: number;
}

export function ActivityImpact({ stats }: { stats: ImpactStats }) {
  return (
    <Card className="p-5 hover-lift animate-fade-in-up">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Heart className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">আপনার প্রভাব</h3>
          <p className="text-xs text-muted-foreground">
            আপনার মাধ্যমে যা ঘটেছে
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatBox
          icon={<Eye className="h-4 w-4" />}
          value={stats.profileViews}
          label="প্রোফাইল ভিউ"
          tone="info"
        />
        <StatBox
          icon={<Phone className="h-4 w-4" />}
          value={stats.contactsReceived}
          label="যোগাযোগ"
          tone="success"
        />
        <StatBox
          icon={<Users className="h-4 w-4" />}
          value={stats.helped}
          label="সাহায্য করেছেন"
          tone="primary"
        />
      </div>

      {stats.helped > 0 ? (
        <div className="mt-4 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-transparent p-3 text-center">
          <p className="text-sm font-semibold text-foreground">
            আপনি <span className="text-primary">{bnNum(stats.helped)}</span> জনকে সাহায্য করেছেন ❤️
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            আপনার প্রতিটি দান একটি জীবন বাঁচায়।
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-muted/40 p-3 text-center text-xs text-muted-foreground">
          এখনো কেউ যোগাযোগ করেনি — আপনার প্রোফাইল শেয়ার করুন।
        </div>
      )}
    </Card>
  );
}

function StatBox({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  tone: "info" | "success" | "primary";
}) {
  const toneClass = {
    info: "from-blue-500/10 text-blue-600 dark:text-blue-400",
    success: "from-success/10 text-success",
    primary: "from-primary/10 text-primary",
  }[tone];
  return (
    <div className={`rounded-xl bg-gradient-to-br ${toneClass} to-transparent p-3 text-center`}>
      <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center">{icon}</div>
      <div className="text-xl font-bold text-foreground">{bnNum(value)}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
