import { Pencil, Check, X, MapPin, Phone, Droplet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BLOOD_GROUPS,
  MYMENSINGH_AREA_GROUPS,
  type Donor,
  type BloodGroup,
} from "@/lib/supabase";
import { bnNum, type AvailabilityStatus } from "@/lib/donor-metrics";

const STATUS_LABEL: Record<AvailabilityStatus, { text: string; cls: string; dot: string }> = {
  available: {
    text: "উপলব্ধ",
    cls: "bg-success/10 text-success border-success/30",
    dot: "bg-success",
  },
  busy: {
    text: "ব্যস্ত (cooldown)",
    cls: "bg-warning/15 text-warning-foreground border-warning/30",
    dot: "bg-warning",
  },
  unavailable: {
    text: "অনুপলব্ধ",
    cls: "bg-destructive/10 text-destructive border-destructive/30",
    dot: "bg-destructive",
  },
};

export function ProfileSummary({
  donor,
  draft,
  setDraft,
  onSave,
  saving,
  status,
  completion,
}: {
  donor: Donor;
  draft: Donor;
  setDraft: (d: Donor) => void;
  onSave: () => void;
  saving: boolean;
  status: AvailabilityStatus;
  completion: number;
}) {
  const [editing, setEditing] = useState(false);
  const [consent, setConsent] = useState(false);
  const statusInfo = STATUS_LABEL[status];

  const cancel = () => {
    setDraft(donor);
    setConsent(false);
    setEditing(false);
  };

  const save = async () => {
    if (!consent) {
      toast.error("আপডেট নিশ্চিত করতে নিচের সম্মতি বক্সে টিক দিন");
      return;
    }
    onSave();
    setConsent(false);
    setEditing(false);
  };

  return (
    <Card className="overflow-hidden p-0 hover-lift animate-fade-in-up">
      {/* Gradient header */}
      <div className="relative bg-gradient-to-br from-primary via-primary to-[oklch(0.5_0.24_20)] p-6 text-primary-foreground">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wider text-primary-foreground/70">
              স্বাগতম
            </p>
            <h2 className="mt-1 truncate text-2xl font-bold">{donor.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 backdrop-blur-sm">
                <Phone className="h-3 w-3" />
                {donor.phone}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 backdrop-blur-sm">
                <MapPin className="h-3 w-3" />
                {donor.area || "—"}
              </span>
            </div>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold shadow-lg backdrop-blur-sm">
            {donor.blood_group}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border bg-white/95 px-2.5 py-1 text-xs font-medium ${statusInfo.cls}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot} ${status === "available" ? "animate-pulse" : ""}`} />
            {statusInfo.text}
          </span>
        </div>
      </div>

      {/* Profile completion */}
      <div className="border-b border-border bg-muted/30 px-6 py-3">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">আপনার প্রোফাইল</span>
          <span className="font-semibold text-foreground">{bnNum(completion)}% সম্পূর্ণ</span>
        </div>
        <Progress value={completion} className="h-1.5" />
        {completion < 100 && (
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            অসম্পূর্ণ তথ্যগুলো পূরণ করলে আরও বেশি মানুষ আপনাকে খুঁজে পাবে।
          </p>
        )}
      </div>

      {/* Editable fields */}
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">প্রোফাইল তথ্য</h3>
          {!editing ? (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              <Pencil className="h-3.5 w-3.5" />
              এডিট
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={cancel} disabled={saving}>
                <X className="h-3.5 w-3.5" />
                বাতিল
              </Button>
              <Button size="sm" onClick={save} disabled={saving}>
                <Check className="h-3.5 w-3.5" />
                {saving ? "সংরক্ষণ..." : "সংরক্ষণ"}
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">নাম</Label>
            <Input
              value={draft.name}
              disabled={!editing}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">মোবাইল নম্বর</Label>
            <Input value={draft.phone ?? ""} disabled />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">রক্তের গ্রুপ</Label>
            <Select
              value={draft.blood_group}
              onValueChange={(v) => setDraft({ ...draft, blood_group: v as BloodGroup })}
              disabled={!editing}
            >
              <SelectTrigger className="gap-2 [&>svg:last-child]:ml-auto">
                <Droplet className="h-4 w-4 shrink-0 text-primary" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUPS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">এলাকা</Label>
            <Select
              value={draft.area ?? ""}
              onValueChange={(v) => setDraft({ ...draft, area: v })}
              disabled={!editing}
            >
              <SelectTrigger className="gap-2 [&>svg:last-child]:ml-auto">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="এলাকা" />
              </SelectTrigger>
              <SelectContent>
                {MYMENSINGH_AREA_GROUPS.map((g) => (
                  <SelectGroup key={g.label}>
                    <SelectLabel>{g.label}</SelectLabel>
                    {g.areas.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs">পূর্ণ ঠিকানা</Label>
            <Input
              value={draft.address}
              disabled={!editing}
              onChange={(e) => setDraft({ ...draft, address: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3">
          <div>
            <Label className="text-sm font-medium">বর্তমানে উপলব্ধ</Label>
            <p className="text-xs text-muted-foreground">
              {status === "busy"
                ? "Cooldown শেষ হলে স্বয়ংক্রিয়ভাবে উপলব্ধ হবেন।"
                : "এখনই রক্ত দিতে পারবেন কিনা।"}
            </p>
          </div>
          <Switch
            checked={draft.is_available}
            disabled={!editing}
            onCheckedChange={(v) => setDraft({ ...draft, is_available: v })}
          />
        </div>

        {editing && (
          <div className="rounded-xl border border-border bg-muted/30 p-3">
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="update-consent"
                checked={consent}
                onCheckedChange={(v) => setConsent(v === true)}
                className="mt-0.5"
              />
              <Label
                htmlFor="update-consent"
                className="cursor-pointer text-xs font-normal leading-relaxed text-muted-foreground"
              >
                আমি নিশ্চিত করছি যে দেওয়া তথ্য সঠিক এবং RoktoFinder-এ public donor list-এ
                আপডেট হয়ে দেখানো যেতে পারে। যেকোনো সময় আবার এডিট বা hide করতে পারব।
              </Label>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
