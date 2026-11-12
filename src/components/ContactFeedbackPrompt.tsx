import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type Outcome = "contacted" | "no_answer" | "unavailable" | "arranged";

const OPTIONS: { value: Outcome; label: string }[] = [
  { value: "contacted", label: "যোগাযোগ হয়েছে" },
  { value: "no_answer", label: "ফোন ধরেননি" },
  { value: "unavailable", label: "এখন দিতে পারছেন না" },
  { value: "arranged", label: "রক্তের ব্যবস্থা হয়ে গেছে" },
];

const FP_KEY = "rf_seeker_fp_v1";
const ASKED_KEY = "rf_feedback_asked_v1";
/** shown only if the tab-return signal never arrives */
const FALLBACK_MS = 28000;

function fingerprint(): string {
  try {
    let fp = localStorage.getItem(FP_KEY);
    if (!fp) {
      fp = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(FP_KEY, fp);
    }
    return fp;
  } catch {
    return "anon";
  }
}

function askedRecently(donorId: string): boolean {
  try {
    const raw = localStorage.getItem(ASKED_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    return Date.now() - (map[donorId] ?? 0) < 24 * 3600 * 1000;
  } catch {
    return false;
  }
}

function markAsked(donorId: string) {
  try {
    const raw = localStorage.getItem(ASKED_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    map[donorId] = Date.now();
    localStorage.setItem(ASKED_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function useContactFeedback() {
  const [pending, setPending] = useState<{ id: string; name: string } | null>(null);
  const [visible, setVisible] = useState(false);

  const requestFeedback = (donor: { id: string; name: string }) => {
    if (askedRecently(donor.id)) return;
    setPending(donor);
    setVisible(false);
  };

  // Prefer asking when the seeker comes back to the RoktoFinder tab.
  useEffect(() => {
    if (!pending) return;
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setVisible(true);
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") show();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", show);
    const timer = window.setTimeout(show, FALLBACK_MS);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", show);
      window.clearTimeout(timer);
    };
  }, [pending]);

  const dismiss = () => {
    if (pending) markAsked(pending.id);
    setPending(null);
    setVisible(false);
  };

  const submit = async (outcome: Outcome) => {
    if (!pending) return;
    markAsked(pending.id);
    const donorId = pending.id;
    setPending(null);
    setVisible(false);
    const { error } = await supabase.rpc("submit_contact_feedback", {
      _donor_id: donorId,
      _outcome: outcome,
      _fingerprint: fingerprint(),
    });
    if (!error) toast.success("ধন্যবাদ! আপনার মতামত সংরক্ষিত হয়েছে।");
  };

  return {
    requestFeedback,
    prompt:
      pending && visible ? (
        <ContactFeedbackPrompt donorName={pending.name} onSubmit={submit} onDismiss={dismiss} />
      ) : null,
  };
}

function ContactFeedbackPrompt({
  donorName,
  onSubmit,
  onDismiss,
}: {
  donorName: string;
  onSubmit: (o: Outcome) => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md animate-fade-in-up md:inset-x-auto md:right-4">
      <Card className="p-4 shadow-[var(--shadow-elegant)]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-foreground">যোগাযোগ কেমন হলো?</p>
            <p className="text-xs text-muted-foreground">{donorName} — এক ক্লিকে জানান</p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="বন্ধ করুন"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {OPTIONS.map((o) => (
            <Button
              key={o.value}
              variant="outline"
              size="sm"
              className="h-auto whitespace-normal py-2 text-xs"
              onClick={() => onSubmit(o.value)}
            >
              {o.label}
            </Button>
          ))}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          পরে বলব
        </button>
      </Card>
    </div>
  );
}
