import { useState, useRef } from "react";
import {
  Download,
  Share2,
  FileText,
  Sparkles,
  QrCode,
  ShieldCheck,
  Droplet,
  Heart,
  Award,
  CheckCircle2,
  Phone,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toBnNum, type Donor } from "@/lib/supabase";
import logo from "@/assets/logo.png";

interface DigitalDonorCardProps {
  donor: Donor;
}

export function DigitalDonorCard({ donor }: DigitalDonorCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const donorId = `#RF-${(donor.id || "12345678").slice(0, 8).toUpperCase()}`;
  const donationCount = donor.donation_count || 0;

  // Determine honor badge based on donation count
  const getMilestoneBadge = (count: number) => {
    if (count >= 10)
      return { title: "লাইফ সেভার হিরো", color: "from-amber-400 to-yellow-500", tier: "Gold" };
    if (count >= 5)
      return { title: "সিলভার ডোনার", color: "from-slate-300 to-zinc-400", tier: "Silver" };
    if (count >= 2)
      return { title: "ব্রোঞ্জ ডোনার", color: "from-amber-600 to-orange-700", tier: "Bronze" };
    return { title: "নিয়মিত রক্তদাতা", color: "from-primary to-destructive", tier: "Active" };
  };

  const milestone = getMilestoneBadge(donationCount);

  // Download high-resolution PNG image (social-media ready)
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExportingImage(true);
      const [{ default: html2canvas }] = await Promise.all([import("html2canvas-pro")]);

      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High-DPI crystal clear capture
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `RoktoFinder-DonorCard-${donor.name.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("ডিজিটাল ডোনার কার্ড সফলভাবে ডাউনলোড হয়েছে!");
    } catch (err) {
      console.error("Export image error:", err);
      toast.error("কার্ড ডাউনলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsExportingImage(false);
    }
  };

  // Download Official PDF Certificate / Donor ID
  const handleDownloadPdf = async () => {
    if (!cardRef.current) return;
    try {
      setIsExportingPdf(true);
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#09090b",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      // Generate A4 Landscape / Portrait Certificate
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Certificate Background header
      pdf.setFillColor(15, 23, 42); // slate-900
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // Top Decorative Banner
      pdf.setFillColor(220, 38, 38); // Red
      pdf.rect(0, 0, pageWidth, 8, "F");

      // Title & Header Text
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.text("RoktoFinder — Mymensingh Blood Donor Network", pageWidth / 2, 25, {
        align: "center",
      });

      pdf.setFontSize(14);
      pdf.setTextColor(156, 163, 175);
      pdf.text("Official Digital Donor Identification & Verification Record", pageWidth / 2, 34, {
        align: "center",
      });

      // Place the Captured Card Image in the Center
      const cardWidth = 160;
      const cardHeight = (canvas.height * cardWidth) / canvas.width;
      const xPos = (pageWidth - cardWidth) / 2;
      const yPos = 48;

      pdf.addImage(imgData, "PNG", xPos, yPos, cardWidth, cardHeight);

      // Certificate Verification & Signature Footer
      const footerY = yPos + cardHeight + 20;
      pdf.setFontSize(11);
      pdf.setTextColor(229, 231, 235);
      pdf.text(`Donor Name: ${donor.name}`, pageWidth / 2, footerY, { align: "center" });
      pdf.text(
        `Donor ID: ${donorId}  |  Blood Group: ${donor.blood_group}  |  Area: ${donor.area || "Mymensingh"}`,
        pageWidth / 2,
        footerY + 7,
        { align: "center" },
      );

      pdf.setFontSize(9);
      pdf.setTextColor(156, 163, 175);
      pdf.text(
        "This digital card certifies that the holder is a registered voluntary blood donor at RoktoFinder.com",
        pageWidth / 2,
        footerY + 16,
        { align: "center" },
      );
      pdf.text(
        "Initiated by Al-Fatih Islamic Pathagar  |  Founder: Muhammad Nafiz",
        pageWidth / 2,
        footerY + 22,
        { align: "center" },
      );

      pdf.save(`RoktoFinder-Certificate-${donor.name.replace(/\s+/g, "_")}.pdf`);
      toast.success("অফিসিয়াল ডোনার সার্টিফিকেট PDF ডাউনলোড হয়েছে!");
    } catch (err) {
      console.error("Export PDF error:", err);
      toast.error("PDF তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // WhatsApp Share
  const handleShareWhatsApp = () => {
    const text = `আমি RoktoFinder-এর একজন গর্বিত রক্তদাতা (${donor.blood_group})।\nরক্তদানের মাধ্যমে মানুষের পাশে দাঁড়ান: https://roktofinder.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <Card className="overflow-hidden border-border/80 bg-card p-5 md:p-6 shadow-elegant">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left side: Information & Action buttons */}
        <div className="space-y-4 lg:max-w-md">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Award className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              অফিসিয়াল ডোনার ব্যাজ
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold text-foreground">
            আপনার ডিজিটাল ডোনার কার্ড
          </h3>

          <p className="text-sm leading-relaxed text-muted-foreground">
            RoktoFinder-এর একজন সম্মানিত স্বেচ্ছাসেবী রক্তদাতা হিসেবে এটি আপনার অফিসিয়াল পরিচয়পত্র।
            কার্ডটি ডাউনলোড করে আপনার সোশ্যাল মিডিয়ায় শেয়ার করে অন্যদের রক্তদানে উৎসাহিত করুন।
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button
              type="button"
              variant="premium"
              size="sm"
              onClick={handleDownloadImage}
              disabled={isExportingImage}
              className="gap-2 cursor-pointer shadow-soft"
            >
              {isExportingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>ইমেজ ডাউনলোড (PNG)</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="gap-2 cursor-pointer"
            >
              {isExportingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span>সার্টিফিকেট (PDF)</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleShareWhatsApp}
              className="gap-2 cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-600"
            >
              <Share2 className="h-4 w-4" />
              <span>WhatsApp এ শেয়ার</span>
            </Button>
          </div>
        </div>

        {/* Right side: The Actual Printable / Renderable Physical ID Card */}
        <div className="flex justify-center">
          <div
            ref={cardRef}
            className="relative aspect-[1.586/1] w-full max-w-[420px] select-none overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-zinc-950 via-neutral-900 to-rose-950/95 p-5 text-white shadow-2xl ring-1 ring-primary/40"
          >
            {/* Ambient Background Wave & Drops */}
            <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-primary/25 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-destructive/20 blur-2xl" />

            {/* Geometric watermark line */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "16px 16px",
              }}
            />

            {/* Card Content Layout */}
            <div className="relative flex h-full flex-col justify-between">
              {/* Header: Logo, Title & Verified Badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <img src={logo} alt="RoktoFinder" className="h-8 w-8 object-contain" />
                  <div>
                    <div className="font-display text-sm font-extrabold tracking-tight text-white leading-none">
                      RoktoFinder
                    </div>
                    <div className="text-[10px] text-white/60">ময়মনসিংহ ব্লাড নেটওয়ার্ক</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 backdrop-blur-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>ভেরিফাইড ডোনার</span>
                </div>
              </div>

              {/* Middle: Donor Name, Area & Huge Blood Group Pill */}
              <div className="my-auto flex items-center justify-between gap-4 py-2">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-white/50">
                    রক্তদাতার নাম
                  </span>
                  <h4 className="font-display text-lg font-bold text-white tracking-wide truncate max-w-[210px] sm:max-w-[240px]">
                    {donor.name}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/70">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" />
                      {donor.area || "ময়মনসিংহ সদর"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-white/50">
                      • {donorId}
                    </span>
                  </div>
                </div>

                {/* Big Ruby Blood Group Emblem */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/50 bg-gradient-to-br from-primary to-destructive px-4 py-2.5 shadow-lg shadow-primary/25">
                  <span className="font-display text-2xl font-black text-white leading-none">
                    {donor.blood_group}
                  </span>
                  <span className="mt-0.5 text-[9px] font-medium text-white/80">গ্রুপ</span>
                </div>
              </div>

              {/* Bottom Footer: Milestone Badge, QR Code, Verification */}
              <div className="flex items-end justify-between border-t border-white/10 pt-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/90">
                    <Sparkles className="h-3 w-3 text-amber-400" />
                    <span>
                      {milestone.title} ({toBnNum(donationCount)} বার)
                    </span>
                  </div>
                  <div className="text-[9px] text-white/50">roktofinder.com • আল ফাতিহ পাঠাগার</div>
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1 text-black shadow-md">
                    <QrCode className="h-full w-full" />
                  </div>
                  <span className="mt-0.5 text-[8px] text-white/50">স্ক্যান ভেরিফাই</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
