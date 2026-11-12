import { useState } from "react";
import { Bell, Send } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOOD_GROUPS, MYMENSINGH_AREA_GROUPS, supabase } from "@/lib/supabase";

interface NotifyMeDialogProps {
  defaultBloodGroup?: string;
  defaultArea?: string;
  trigger?: React.ReactNode;
}

export function NotifyMeDialog({
  defaultBloodGroup = "",
  defaultArea = "",
  trigger,
}: NotifyMeDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState(defaultBloodGroup);
  const [area, setArea] = useState(defaultArea);

  const submit = async () => {
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      toast.error("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন");
      return;
    }
    if (!bloodGroup) {
      toast.error("রক্তের গ্রুপ নির্বাচন করুন");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("notify_requests").insert({
      blood_group: bloodGroup,
      area: area || null,
      phone,
      name: name || null,
    });
    setLoading(false);
    if (error) {
      toast.error("সাবমিট ব্যর্থ: " + error.message);
      return;
    }
    toast.success("ধন্যবাদ! ডোনার পাওয়া গেলে আমরা আপনাকে জানাবো।");
    setOpen(false);
    setName("");
    setPhone("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="lg">
            <Bell className="h-4 w-4" />
            ডোনার পাওয়া গেলে আমাকে জানাও
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ডোনার অ্যালার্ট</DialogTitle>
          <DialogDescription>
            আপনার চাহিদামত ডোনার পাওয়া গেলে আমরা আপনাকে কল বা WhatsApp এ জানিয়ে দেবো।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="notify-name">নাম (ঐচ্ছিক)</Label>
            <Input
              id="notify-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notify-phone">মোবাইল নম্বর *</Label>
            <Input
              id="notify-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              maxLength={11}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>রক্তের গ্রুপ *</Label>
              <Select value={bloodGroup} onValueChange={setBloodGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="গ্রুপ" />
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
              <Label>এলাকা</Label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger>
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
          </div>
        </div>

        <DialogFooter>
          <Button onClick={submit} disabled={loading} className="w-full">
            <Send className="h-4 w-4" />
            {loading ? "সাবমিট হচ্ছে..." : "অ্যালার্ট সেট করুন"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
