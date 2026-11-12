import { Bell, MapPin, AlertCircle, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { bnTimeAgo } from "@/lib/supabase";

export interface NotificationItem {
  id: string;
  type: "request" | "contact" | "reminder";
  title: string;
  description: string;
  time: string; // ISO
  area?: string;
}

export function NotificationCenter({ items }: { items: NotificationItem[] }) {
  return (
    <Card className="p-5 hover-lift animate-fade-in-up">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">নোটিফিকেশন</h3>
          <p className="text-xs text-muted-foreground">
            {items.length > 0 ? `${items.length} টি নতুন` : "কোনো নতুন নোটিফিকেশন নেই"}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl bg-muted/40 p-4 text-center text-xs text-muted-foreground">
          সব আপডেট দেখা হয়েছে ✓
        </div>
      ) : (
        <div className="space-y-2">
          {items.slice(0, 5).map((n) => (
            <div
              key={n.id}
              className="group flex items-start gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                {n.type === "request" && <AlertCircle className="h-4 w-4 text-destructive" />}
                {n.type === "contact" && <MapPin className="h-4 w-4 text-primary" />}
                {n.type === "reminder" && <Calendar className="h-4 w-4 text-warning-foreground" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="truncate text-xs text-muted-foreground">{n.description}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{bnTimeAgo(n.time)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
