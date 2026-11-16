import { useEffect, useState } from "react";
import type { Donor } from "@/lib/supabase";

export const DONOR_SESSION_KEY = "rf_donor_session_v1";

export interface SavedDonorSession {
  donor: Donor;
  token: string;
}

export function getStoredDonorSession(): SavedDonorSession | null {
  if (typeof window === "undefined") return null;
  try {
    const local = localStorage.getItem(DONOR_SESSION_KEY);
    if (local) {
      const parsed = JSON.parse(local) as Partial<SavedDonorSession>;
      if (parsed.token && parsed.donor) {
        return parsed as SavedDonorSession;
      }
      localStorage.removeItem(DONOR_SESSION_KEY);
    }
    const sess = sessionStorage.getItem(DONOR_SESSION_KEY);
    if (sess) {
      const parsed = JSON.parse(sess) as Partial<SavedDonorSession>;
      if (parsed.token && parsed.donor) {
        return parsed as SavedDonorSession;
      }
      sessionStorage.removeItem(DONOR_SESSION_KEY);
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function clearDonorSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DONOR_SESSION_KEY);
    sessionStorage.removeItem(DONOR_SESSION_KEY);
    window.dispatchEvent(new Event("rf_session_change"));
  } catch {
    /* ignore */
  }
}

export function notifyDonorSessionChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("rf_session_change"));
}

export function useDonorSession() {
  const [session, setSession] = useState<SavedDonorSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      setSession(getStoredDonorSession());
      setIsLoaded(true);
    };

    checkSession();

    window.addEventListener("rf_session_change", checkSession);
    window.addEventListener("storage", checkSession);

    return () => {
      window.removeEventListener("rf_session_change", checkSession);
      window.removeEventListener("storage", checkSession);
    };
  }, []);

  return {
    session,
    donor: session?.donor ?? null,
    isLoggedIn: Boolean(session?.donor),
    isLoaded,
    logout: clearDonorSession,
  };
}

