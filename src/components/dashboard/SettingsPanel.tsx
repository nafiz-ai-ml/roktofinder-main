import { Settings, Bell, BellOff, Shield, HeartHandshake, Loader2, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Donor } from "@/lib/supabase";

export interface DonorSettings {
  notificationsOn: boolean;
}

export function SettingsPanel({
  donor,
  settings,
  onSettingsChange,
  onAvailabilityToggle,
  saving,
}: {
  donor: Donor;
  settings: DonorSettings;
  onSettingsChange: (v: DonorSettings) => void;
  onAvailabilityToggle: (v: boolean) => void;
  saving: boolean;
}) {
  return (
    <Card className="overflow-hidden p-0 hover-lift animate-fade-in-up">
      <div className="flex items-center gap-3 border-b border-border bg-muted/40 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Settings className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">সেটিংস ও গোপনীয়তা</h3>
          <p className="text-xs text-muted-foreground">
            উপলব্ধতা, গোপনীয়তা ও নোটিফিকেশন এক জায়গায় নিয়ন্ত্রণ করুন
          </p>
        </div>
        {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        {/* Availability */}
        <Section
          icon={<HeartHandshake className="h-4 w-4" />}
          title="উপলব্ধতা"
          accent="success"
        >
          <Row
            icon={<HeartHandshake className="h-4 w-4" />}
            title="আমি এখন রক্ত দিতে রাজি"
            description={
              donor.is_available
                ? "Search-এ আপনি 'উপলব্ধ' হিসেবে দেখাবেন।"
                : "Off — আপনি Search-এ অনুপলব্ধ দেখাবেন।"
            }
            checked={donor.is_available}
            onChange={onAvailabilityToggle}
            disabled={saving}
          />
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            💡 সম্পূর্ণ profile temporarily hide করতে এটি Off করুন।
          </p>
        </Section>

        {/* Notifications */}
        <Section
          icon={<Bell className="h-4 w-4" />}
          title="নোটিফিকেশন"
          accent="warning"
        >
          <Row
            icon={settings.notificationsOn ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            title="ব্রাউজার নোটিফিকেশন"
            description="আপনার এলাকা / blood group-এর নতুন emergency request এলে জানিয়ে দেবে।"
            checked={settings.notificationsOn}
            onChange={(v) => onSettingsChange({ ...settings, notificationsOn: v })}
          />
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            🔔 এই সেটিংস শুধু এই ডিভাইসে প্রযোজ্য।
          </p>
        </Section>
      </div>

      <div className="mx-5 mb-5 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="text-xs leading-relaxed text-foreground">
          <span className="font-semibold">গোপনীয়তা:</span> স্ক্যাম প্রতিরোধে এখন সব ডোনারের ফোন নম্বর Search-এ সম্পূর্ণ লুকানো। যোগাযোগ হবে শুধু <span className="font-medium">কল</span> ও <span className="font-medium">WhatsApp</span> বোতাম দিয়ে।
        </div>
      </div>

      <div className="flex items-start gap-3 border-t border-border bg-muted/30 p-4">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">নোট:</span> Account delete বা পাসওয়ার্ড reset-এর জন্য{" "}
          <a href="mailto:roktofinder@gmail.com" className="font-semibold text-primary hover:underline">
            roktofinder@gmail.com
          </a>
          -এ যোগাযোগ করুন।
        </div>
      </div>
    </Card>
  );
}

function Section({
  icon,
  title,
  accent,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accent: "primary" | "success" | "warning";
  children: React.ReactNode;
}) {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
  } as const;
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="mb-3 flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-md ${accentMap[accent]}`}>
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function Row({
  icon,
  title,
  description,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/20 p-3">
      <div className="flex items-start gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-card text-foreground">
          {icon}
        </div>
        <div className="min-w-0">
          <Label className="cursor-pointer text-sm font-medium leading-tight">{title}</Label>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}

