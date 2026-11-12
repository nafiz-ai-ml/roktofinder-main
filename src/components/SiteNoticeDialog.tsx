import { useEffect, useState } from "react";

import { Info, Mail, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const HELP_EMAIL = "roktofinder@gmail.com";

const SEEN_KEY = "rf_notice_seen";

export function SiteNoticeDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY) === "1") return;
    const t = setTimeout(() => setOpen(true), 700);
    return () => clearTimeout(t);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) sessionStorage.setItem(SEEN_KEY, "1");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[92vw] gap-0 overflow-hidden rounded-2xl border-border/60 p-0 sm:max-w-md">
        <DialogHeader className="space-y-2 border-b border-border/60 bg-gradient-to-br from-primary/12 via-background to-background p-5 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <Info className="h-5 w-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            গুরুত্বপূর্ণ ঘোষণা
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            রক্ত খোঁজার আগে অনুগ্রহ করে এটি পড়ুন
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 p-5 text-sm leading-relaxed text-foreground">
          <p>
            <span className="font-semibold text-primary">
              দয়া করে আমাদের নম্বরে ডোনারের জন্য কল বা মেসেজ করবেন না।
            </span>{" "}
            ওয়েবসাইটে যে ডোনারগুলো তালিকাভুক্ত আছে, সেখান থেকেই নিজে খুঁজে সরাসরি
            যোগাযোগ করুন।
          </p>
          <p className="text-muted-foreground">
            না পেলে অনুগ্রহ করে বাইরে অন্য মাধ্যমেও খোঁজ করুন — কারণ আমরা এখনো
            নিজে থেকে ডোনার ব্যবস্থা করে দিতে পারছি না।
          </p>
          <p className="text-muted-foreground">
            আমরা আমাদের কাজ ধীরে ধীরে সম্প্রসারণ করছি ও ডোনারের সংখ্যা বাড়ানোর
            চেষ্টা করছি।
          </p>
          <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
            <Share2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs text-foreground">
              আপনিও একটিমাত্র <span className="font-semibold">শেয়ার</span>-এর
              মাধ্যমে আমাদের সাহায্য করতে পারেন। এতে আরও ডোনার যুক্ত হবেন।
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            অন্য কোনো সহায়তা প্রয়োজন হলে নিচের ইমেইলে যোগাযোগ করতে পারেন।
          </p>
        </div>

        <DialogFooter className="flex-row gap-2 border-t border-border/60 bg-muted/40 p-4">
          <Button asChild className="w-full">
            <a href={`mailto:${HELP_EMAIL}`}>
              <Mail className="h-4 w-4" />
              Email করুন
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
