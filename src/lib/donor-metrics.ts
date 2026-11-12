import type { AvailabilityState, Donor } from "@/lib/supabase";

export const COOLDOWN_DAYS = 90;
export const FRESH_DAYS = 30;
export const STALE_DAYS = 90;

export type AvailabilityStatus = "available" | "busy" | "unavailable";

export interface FreshnessInfo {
  state: AvailabilityState;
  /** null when the donor has never explicitly confirmed availability */
  confirmedDaysAgo: number | null;
  /** true only for an explicit confirmation newer than FRESH_DAYS */
  recentlyVerified: boolean;
  label: string;
  tone: "success" | "warning" | "muted" | "destructive";
}

/**
 * Availability freshness. Website activity (`last_active`) is NEVER treated as
 * an availability confirmation. Cooldown and an explicit `is_available = false`
 * always win over freshness.
 */
export function computeFreshness(donor: Donor): FreshnessInfo {
  const confirmedDaysAgo =
    typeof donor.confirmed_days_ago === "number" ? donor.confirmed_days_ago : null;

  const daysSinceDonation = donor.last_donation_date
    ? Math.floor(
        (Date.now() - new Date(donor.last_donation_date).getTime()) / 86400000,
      )
    : null;

  let state: AvailabilityState;
  if (donor.availability_state) {
    state = donor.availability_state;
  } else if (daysSinceDonation !== null && daysSinceDonation < COOLDOWN_DAYS) {
    state = "unavailable";
  } else if (!donor.is_available) {
    state = "unavailable";
  } else if (confirmedDaysAgo === null) {
    state = "unconfirmed";
  } else if (confirmedDaysAgo <= FRESH_DAYS) {
    state = "fresh";
  } else if (confirmedDaysAgo <= STALE_DAYS) {
    state = "stale";
  } else {
    state = "inactive";
  }

  const map: Record<AvailabilityState, { label: string; tone: FreshnessInfo["tone"] }> = {
    fresh: { label: "উপলব্ধ", tone: "success" },
    stale: { label: "উপলব্ধতা নিশ্চিত করা হয়নি", tone: "warning" },
    unconfirmed: { label: "উপলব্ধতা নিশ্চিত করা হয়নি", tone: "warning" },
    inactive: { label: "দীর্ঘদিন নিষ্ক্রিয়", tone: "muted" },
    unavailable: { label: "অনুপলব্ধ", tone: "destructive" },
  };

  return {
    state,
    confirmedDaysAgo,
    recentlyVerified:
      state === "fresh" && confirmedDaysAgo !== null && confirmedDaysAgo <= FRESH_DAYS,
    label: map[state].label,
    tone: map[state].tone,
  };
}

/** "৩ দিন আগে নিশ্চিত করেছেন" */
export function confirmedAgoLabel(days: number | null): string {
  if (days === null) return "এখনো নিশ্চিত করেননি";
  if (days <= 0) return "আজ নিশ্চিত করেছেন";
  if (days < 30) return `${bnNum(days)} দিন আগে নিশ্চিত করেছেন`;
  const months = Math.floor(days / 30);
  return `${bnNum(months)} মাস আগে নিশ্চিত করেছেন`;
}


export interface BadgeDef {
  id: string;
  emoji: string;
  label: string;
  description: string;
  earned: boolean;
}

export interface DonorMetrics {
  donationCount: number;
  daysSinceLast: number | null;
  daysUntilEligible: number;
  isEligible: boolean;
  nextEligibleDate: Date | null;
  profileCompletion: number;
  status: AvailabilityStatus;
  badges: BadgeDef[];
}

export function computeDonorMetrics(donor: Donor): DonorMetrics {
  // Donation count comes from donors.donation_count (incremented via record_donation RPC).
  // Fallback for legacy rows: if column missing/0 but a date exists, assume at least 1.
  const donationCount =
    typeof donor.donation_count === "number" && donor.donation_count > 0
      ? donor.donation_count
      : donor.last_donation_date
        ? 1
        : 0;

  let daysSinceLast: number | null = null;
  let daysUntilEligible = 0;
  let nextEligibleDate: Date | null = null;
  if (donor.last_donation_date) {
    const last = new Date(donor.last_donation_date);
    daysSinceLast = Math.floor(
      (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24),
    );
    daysUntilEligible = Math.max(0, COOLDOWN_DAYS - daysSinceLast);
    nextEligibleDate = new Date(last.getTime() + COOLDOWN_DAYS * 86400000);
  }
  const isEligible = daysUntilEligible === 0;

  // Profile completion (8 fields tracked)
  const fields = [
    !!donor.name,
    !!donor.phone,
    !!donor.blood_group,
    !!donor.address,
    !!donor.area,
    !!donor.last_donation_date,
    !!donor.latitude && !!donor.longitude,
    donor.is_available !== null && donor.is_available !== undefined,
  ];
  const filled = fields.filter(Boolean).length;
  const profileCompletion = Math.round((filled / fields.length) * 100);

  // Status
  let status: AvailabilityStatus = "available";
  if (!donor.is_available) status = "unavailable";
  else if (!isEligible) status = "busy";

  // Badges
  const badges: BadgeDef[] = [
    {
      id: "first",
      emoji: "🥇",
      label: "প্রথম রক্তদান",
      description: "প্রথমবার রক্তদান সম্পন্ন",
      earned: donationCount >= 1,
    },
    {
      id: "five",
      emoji: "🏆",
      label: "৫ বার রক্তদান",
      description: "৫ বার বা তার বেশি রক্তদান",
      earned: donationCount >= 5,
    },
    {
      id: "active",
      emoji: "🔥",
      label: "সক্রিয় ডোনার",
      description: "নিয়মিত উপলব্ধ থাকেন",
      earned: donor.is_available && profileCompletion >= 75,
    },
    {
      id: "lifesaver",
      emoji: "❤️",
      label: "জীবন রক্ষাকারী",
      description: "১০+ বার রক্তদান",
      earned: donationCount >= 10,
    },
  ];

  return {
    donationCount,
    daysSinceLast,
    daysUntilEligible,
    isEligible,
    nextEligibleDate,
    profileCompletion,
    status,
    badges,
  };
}

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export function bnNum(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

export function formatBnDate(d: Date | string | null): string {
  if (!d) return "নেই";
  const date = typeof d === "string" ? new Date(d) : d;
  const months = [
    "জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্ট", "অক্টো", "নভে", "ডিসে",
  ];
  return `${bnNum(date.getDate())} ${months[date.getMonth()]} ${bnNum(date.getFullYear())}`;
}
