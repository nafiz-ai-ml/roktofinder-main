import { Phone, MessageCircle, MapPin, Clock, AlertTriangle, Trophy, Navigation, EyeOff, ShieldCheck, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Donor, daysSince, isRecentlyDonated, toBnNum, formatDistanceBn } from "@/lib/supabase";
import { computeFreshness, confirmedAgoLabel } from "@/lib/donor-metrics";

const COOLDOWN_DAYS = 90;

function waLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? "88" + digits : digits;
  return `https://wa.me/${intl}`;
}

export function DonorCard({
  donor,
  isTop,
  distanceKm,
  onContact,
}: {
  donor: Donor;
  isTop?: boolean;
  distanceKm?: number | null;
  onContact?: (donor: Donor) => void;
}) {
  const distance = distanceKm ?? donor.distance_km;
  const distanceLabel = formatDistanceBn(distance);
  const recent = isRecentlyDonated(donor.last_donation_date);
  const days = daysSince(donor.last_donation_date);
  const cooldownRemaining = days !== null && days < COOLDOWN_DAYS ? COOLDOWN_DAYS - days : 0;
  const showTop = isTop ?? (donor.donation_count ?? 0) >= 5;
  const freshness = computeFreshness(donor);
  const toneClass =
    freshness.tone === "success"
      ? "bg-success/10 text-success"
      : freshness.tone === "warning"
        ? "bg-warning/20 text-warning-foreground"
        : freshness.tone === "muted"
          ? "bg-muted text-muted-foreground"
          : "bg-destructive/10 text-destructive";

  return (
    <Card className="group overflow-hidden p-5 hover-lift animate-fade-in-up">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-base font-semibold text-foreground">{donor.name}</h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${toneClass}`}
            >
              {freshness.state === "fresh" ? (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              ) : freshness.state === "unavailable" ? (
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
              ) : (
                <HelpCircle className="h-2.5 w-2.5" />
              )}
              {freshness.label}
            </span>
            {freshness.recentlyVerified && (
              <span
                title={confirmedAgoLabel(freshness.confirmedDaysAgo)}
                className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success"
              >
                <ShieldCheck className="h-2.5 w-2.5" />
                সম্প্রতি নিশ্চিত
              </span>
            )}
            {donor.donor_source === "admin_directory" && (
              <span
                title="RoktoFinder টিমের সংগ্রহ করা তথ্য"
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                RoktoFinder Directory
              </span>
            )}
            {showTop && (
              <span title="৫+ বার রক্তদান সম্পন্ন" className="inline-flex items-center gap-1 rounded-full bg-warning/20 px-2 py-0.5 text-[10px] font-medium text-warning-foreground">
                <Trophy className="h-2.5 w-2.5" />
                Top Donor
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{donor.area || donor.address}</span>
            </span>
            {distanceLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                <Navigation className="h-2.5 w-2.5" />
                {distanceLabel}
              </span>
            )}
          </div>
        </div>

        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.5_0.24_20)] text-primary-foreground shadow-[var(--shadow-elegant)]">
          <span className="text-lg font-bold leading-none">{donor.blood_group}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-muted/50 p-2.5">
          <div className="text-muted-foreground">সর্বশেষ রক্তদান</div>
          <div className="mt-0.5 font-medium text-foreground">
            {days === null
              ? "নেই"
              : `${toBnNum(days)} দিন আগে`}
          </div>
        </div>
        <div className="rounded-lg bg-muted/50 p-2.5">
          <div className="text-muted-foreground">উপলব্ধতা নিশ্চিত</div>
          <div className="mt-0.5 flex items-center gap-1 font-medium text-foreground">
            <Clock className="h-3 w-3" />
            {freshness.confirmedDaysAgo === null
              ? "নিশ্চিত করা হয়নি"
              : confirmedAgoLabel(freshness.confirmedDaysAgo)}
          </div>
        </div>
      </div>


      {recent && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-2.5 text-xs">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning-foreground" />
          <span className="text-warning-foreground">
            {toBnNum(cooldownRemaining)} দিন পর আবার রক্ত দিতে পারবেন।
          </span>
        </div>
      )}

      {donor.phone ? (
        <>
          <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground">
            <EyeOff className="h-3.5 w-3.5" />
            <span>গোপনীয়তার জন্য নম্বর লুকানো। নিচের বোতাম দিয়ে যোগাযোগ করুন।</span>
          </div>

          <div className="mt-2 flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <a
                href={`tel:${donor.phone}`}
                aria-label="Call donor"
                onClick={() => onContact?.(donor)}
              >
                <Phone className="h-4 w-4" />
                কল
              </a>
            </Button>
            <Button asChild size="sm" variant="outline" className="flex-1">
              <a
                href={waLink(donor.phone)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp donor"
                onClick={() => onContact?.(donor)}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          </div>
        </>

      ) : (
        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground">
          <EyeOff className="h-3.5 w-3.5" />
          <span>এই ডোনার তার মোবাইল নম্বর গোপন রেখেছেন।</span>
        </div>
      )}
    </Card>
  );
}

export function DonorCardSkeleton() {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-14 w-14 animate-pulse rounded-xl bg-muted" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="h-12 animate-pulse rounded-lg bg-muted" />
        <div className="h-12 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="mt-4 h-9 animate-pulse rounded-md bg-muted" />
    </Card>
  );
}
