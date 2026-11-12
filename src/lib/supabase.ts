import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fmjmbamksnnduzwyqfbu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtam1iYW1rc25uZHV6d3lxZmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDc5NTcsImV4cCI6MjA5MjE4Mzk1N30.CkoAyH-YWVUfFdVlqvOZy3OlwCqpIf0Ks4aboAaPo3o";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

export const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// ময়মনসিংহ শহরের এলাকা (city neighborhoods)
export const MYMENSINGH_CITY_AREAS: string[] = [
  "কেওয়াটখালি",
  "চরপাড়া",
  "মাসকান্দা",
  "গাঙ্গিনারপাড়",
  "নতুন বাজার",
  "ব্রাহ্মপল্লী",
  "সানকিপাড়া",
  "কাচিঝুলি",
  "বাঘমারা",
  "আকুয়া",
  "কাঠগোলা",
  "নওমহল",
  "বলাশপুর",
  "কলেজ রোড",
  "জুবিলি ঘাট",
  "টাউন হল",
  "ভাটিকাশর",
  "কৃষ্টপুর",
  "ছোট বাজার",
  "বড় বাজার",
  "গোহাইলকান্দি",
  "শম্ভুগঞ্জ",
  "BAU (বাংলাদেশ কৃষি বিশ্ববিদ্যালয়)",
];

// ময়মনসিংহ জেলার উপজেলা (thanas / upazilas)
export const MYMENSINGH_UPAZILAS: string[] = [
  "ত্রিশাল",
  "ভালুকা",
  "মুক্তাগাছা",
  "ফুলবাড়িয়া",
  "গফরগাঁও",
  "গৌরীপুর",
  "ঈশ্বরগঞ্জ",
  "নান্দাইল",
  "ফুলপুর",
  "হালুয়াঘাট",
  "ধোবাউড়া",
  "তারাকান্দা",
];

// Grouped structure for use with shadcn SelectGroup + SelectLabel
export const MYMENSINGH_AREA_GROUPS: { label: string; areas: string[] }[] = [
  { label: "ময়মনসিংহ শহর", areas: MYMENSINGH_CITY_AREAS },
  { label: "উপজেলা", areas: MYMENSINGH_UPAZILAS },
];

// Flat list (kept for backward compatibility / validation)
export const MYMENSINGH_AREAS: string[] = [
  ...MYMENSINGH_CITY_AREAS,
  ...MYMENSINGH_UPAZILAS,
  "অন্যান্য",
];

/** Derived, privacy-safe availability freshness state (from donors_public) */
export type AvailabilityState =
  | "fresh"
  | "stale"
  | "unconfirmed"
  | "inactive"
  | "unavailable";

export interface Donor {
  id: string;
  name: string;
  /** null when the donor has hidden their number (enforced server-side) */
  phone: string | null;
  blood_group: BloodGroup;
  address: string;
  area: string | null;
  last_donation_date: string | null;
  donation_count: number;
  is_available: boolean;
  phone_visible?: boolean;
  last_active: string;
  created_at: string;
  latitude?: number | null;
  longitude?: number | null;
  /** Present when results come from search_donors_nearby RPC */
  distance_km?: number | null;
  /** Derived freshness state — absent until the freshness migration is applied */
  availability_state?: AvailabilityState | null;
  /** Days since the donor explicitly confirmed availability (null = never confirmed) */
  confirmed_days_ago?: number | null;
  /** 'self_registered' | 'admin_directory' — present after the admin directory migration */
  donor_source?: "self_registered" | "admin_directory" | null;
  /** Days since the record's information was last updated (directory donors) */
  info_updated_days_ago?: number | null;
}


export interface UserCoords {
  lat: number;
  lng: number;
}

const GPS_CACHE_KEY = "rf_user_coords_v1";
const GPS_TTL_MS = 5 * 60 * 1000;

export function getCachedUserLocation(): UserCoords | null {
  try {
    const raw = localStorage.getItem(GPS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { lat: number; lng: number; ts: number };
    if (Date.now() - parsed.ts > GPS_TTL_MS) return null;
    return { lat: parsed.lat, lng: parsed.lng };
  } catch {
    return null;
  }
}

export function getUserLocation(opts?: { forceFresh?: boolean }): Promise<UserCoords> {
  if (!opts?.forceFresh) {
    const cached = getCachedUserLocation();
    if (cached) return Promise.resolve(cached);
  }
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("আপনার ব্রাউজার লোকেশন সাপোর্ট করে না"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Round to ~100m for privacy
        const lat = Math.round(pos.coords.latitude * 1000) / 1000;
        const lng = Math.round(pos.coords.longitude * 1000) / 1000;
        const coords = { lat, lng };
        try {
          localStorage.setItem(
            GPS_CACHE_KEY,
            JSON.stringify({ ...coords, ts: Date.now() }),
          );
        } catch {
          /* ignore */
        }
        resolve(coords);
      },
      (err) => reject(new Error(err.message || "লোকেশন পাওয়া যায়নি")),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: GPS_TTL_MS },
    );
  });
}

export function formatDistanceBn(km: number | null | undefined): string | null {
  if (km === null || km === undefined || Number.isNaN(km)) return null;
  if (km < 1) {
    const meters = Math.max(50, Math.round(km * 1000 / 50) * 50);
    return `${toBnNum(meters)} মিটার দূরে`;
  }
  const rounded = km < 10 ? km.toFixed(1) : Math.round(km).toString();
  return `${toBnNum(rounded)} কিমি দূরে`;
}

export interface EmergencyRequest {
  id: string;
  patient_name: string;
  blood_group: BloodGroup;
  location: string;
  contact_phone: string;
  message: string | null;
  hospital: string | null;
  units_needed: number | null;
  is_active: boolean;
  created_at: string;
}

// Bangla blood group label (same chars, but consistent)
export const bloodGroupLabel = (bg: BloodGroup) => bg;

// Mask phone for public display: 01XXX-XXX678
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 11) return "•••••••••••";
  return `${digits.slice(0, 2)}XXX-XXX${digits.slice(8)}`;
}

export function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export function isRecentlyDonated(dateStr: string | null): boolean {
  const d = daysSince(dateStr);
  return d !== null && d < 90;
}

// Bangla numerals
const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export function toBnNum(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

export function bnTimeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "এইমাত্র";
  if (diff < 3600) return `${toBnNum(Math.floor(diff / 60))} মিনিট আগে`;
  if (diff < 86400) return `${toBnNum(Math.floor(diff / 3600))} ঘণ্টা আগে`;
  if (diff < 86400 * 30) return `${toBnNum(Math.floor(diff / 86400))} দিন আগে`;
  return `${toBnNum(Math.floor(diff / (86400 * 30)))} মাস আগে`;
}

export const EMERGENCY_EXPIRY_DAYS = 2;
export function isRequestExpired(iso: string): boolean {
  const diffMs = Date.now() - new Date(iso).getTime();
  return diffMs > EMERGENCY_EXPIRY_DAYS * 86400 * 1000;
}
