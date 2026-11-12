import { supabase } from "@/lib/supabase";

/**
 * Lightweight, privacy-safe visitor tracking.
 * - One random session id per browser tab session (sessionStorage).
 * - Stores only: path, session id, referrer (first visit), device type.
 * - Never stores IP addresses or any personal data.
 * - Admin pages (/admin/*) are excluded.
 */

const SID_KEY = "rf_analytics_sid";
const VISITED_KEY = "rf_analytics_visited";

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SID_KEY);
    if (!sid) {
      sid =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SID_KEY, sid);
    }
    return sid;
  } catch {
    return `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

function detectDevice(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

/** Fire-and-forget pageview insert; never throws or blocks navigation. */
export function trackPageView(path: string): void {
  if (typeof window === "undefined") return;
  if (path.startsWith("/admin")) return;

  let isFirstVisit = false;
  try {
    isFirstVisit = !sessionStorage.getItem(VISITED_KEY);
    if (isFirstVisit) sessionStorage.setItem(VISITED_KEY, "1");
  } catch {
    /* storage unavailable — still track the view */
  }

  supabase
    .from("site_page_views")
    .insert({
      path,
      session_id: getSessionId(),
      referrer: isFirstVisit && document.referrer ? document.referrer.slice(0, 500) : null,
      device: detectDevice(),
    })
    .then(
      () => {},
      () => {},
    );
}
