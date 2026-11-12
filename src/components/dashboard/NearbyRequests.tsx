import { MapPin, Phone, Inbox, Hospital, AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type EmergencyRequest, bnTimeAgo, isRequestExpired } from "@/lib/supabase";

export function NearbyRequests({ requests }: { requests: EmergencyRequest[] }) {
  const sorted = useMemo(() => {
    return [...requests].sort((a, b) => {
      const ea = isRequestExpired(a.created_at) ? 1 : 0;
      const eb = isRequestExpired(b.created_at) ? 1 : 0;
      return ea - eb;
    });
  }, [requests]);
  const activeCount = requests.filter((r) => !isRequestExpired(r.created_at)).length;

  return (
    <Card className="p-5 hover-lift animate-fade-in-up">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
          <Hospital className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">আপনার এলাকার অনুরোধ</h3>
          <p className="text-xs text-muted-foreground">
            {activeCount > 0 ? `${activeCount} টি সক্রিয় অনুরোধ` : "এখন কোনো অনুরোধ নেই"}
          </p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-muted/40 px-4 py-8 text-center">
          <Inbox className="h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">এই মুহূর্তে কোনো জরুরি অনুরোধ নেই।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.slice(0, 5).map((r) => {
            const expired = isRequestExpired(r.created_at);
            return (
              <div
                key={r.id}
                className={`group rounded-xl border bg-card p-3 transition-all ${
                  expired
                    ? "border-border/60 opacity-60"
                    : "border-border hover:border-destructive/40 hover:shadow-[var(--shadow-soft)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {r.patient_name}
                      </p>
                      <span className="rounded-md bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive">
                        {r.blood_group}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{r.location}</span>
                    </div>
                    {r.message && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.message}</p>
                    )}
                    {expired ? (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        মেয়াদোত্তীর্ণ
                      </span>
                    ) : (
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {bnTimeAgo(r.created_at)}
                      </p>
                    )}
                  </div>
                </div>
                {!expired && (
                  <Button asChild size="sm" className="mt-3 w-full">
                    <a href={`tel:${r.contact_phone}`}>
                      <Phone className="h-3.5 w-3.5" />
                      যোগাযোগ করুন
                    </a>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
