import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fmjmbamksnnduzwyqfbu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtam1iYW1rc25uZHV6d3lxZmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDc5NTcsImV4cCI6MjA5MjE4Mzk1N30.CkoAyH-YWVUfFdVlqvOZy3OlwCqpIf0Ks4aboAaPo3o";

/**
 * Separate Supabase client for the admin panel only.
 * The public site client (src/lib/supabase.ts) keeps persistSession: false so
 * nothing about donor browsing changes; this one keeps an admin auth session
 * under its own storage key.
 */
export const supabaseAdminAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: "rf_admin_auth_v1",
  },
});

export type AdminRole = "super_admin" | "admin" | "moderator" | "volunteer";

export interface AdminUser {
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
}

export interface AdminDonorStats {
  self_registered: number;
  directory: number;
  total: number;
  available_now: number;
  recently_added: number;
  recently_updated: number;
  archived: number;
}

export interface DirectoryDonorRow {
  id: string;
  name: string;
  phone: string;
  blood_group: string;
  address: string | null;
  area: string | null;
  division: string | null;
  district: string | null;
  upazila: string | null;
  donor_source: "self_registered" | "admin_directory";
  admin_notes: string | null;
  source_label: string | null;
  last_donation_date: string | null;
  donation_count: number | null;
  is_available: boolean;
  phone_visible: boolean | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface AdminActivityRow {
  id: string;
  admin_id: string | null;
  action: string;
  donor_id: string | null;
  details: string | null;
  created_at: string;
}

export const ADMIN_ROLE_LABEL: Record<AdminRole, string> = {
  super_admin: "সুপার অ্যাডমিন",
  admin: "অ্যাডমিন",
  moderator: "মডারেটর",
  volunteer: "ভলান্টিয়ার",
};

export const ADMIN_ACTION_LABEL: Record<string, string> = {
  donor_added: "ডোনার যোগ",
  donor_updated: "ডোনার আপডেট",
  donor_archived: "আর্কাইভ",
  donor_restored: "পুনরুদ্ধার",
  donor_deleted: "স্থায়ী ডিলিট",
  availability_changed: "উপলব্ধতা পরিবর্তন",
  donation_date_updated: "রক্তদানের তারিখ আপডেট",
  admin_granted: "নতুন অ্যাডমিন",
  admin_deactivated: "অ্যাডমিন নিষ্ক্রিয়",
  admin_reactivated: "অ্যাডমিন সক্রিয়",
};

/** Human-readable Bangla message for the RPC error codes raised by the migration */
export function adminErrorBn(message: string): string {
  if (message.includes("not_authorized")) return "আপনার এই কাজের অনুমতি নেই।";
  if (message.includes("duplicate_phone"))
    return "এই মোবাইল নম্বর দিয়ে একজন ডোনার আগেই আছেন।";
  if (message.includes("directory_donor_not_found"))
    return "ডিরেক্টরি ডোনার পাওয়া যায়নি (self-registered ডোনার এডিট করা যায় না)।";
  if (message.includes("auth_user_not_found"))
    return "এই ইমেইলে কোনো Auth ইউজার নেই। আগে Supabase Auth-এ ইউজার তৈরি করুন।";
  if (message.includes("cannot_modify_self")) return "নিজের অ্যাকাউন্ট পরিবর্তন করা যাবে না।";
  if (message.includes("invalid_role")) return "রোল সঠিক নয়।";
  return message;
}
