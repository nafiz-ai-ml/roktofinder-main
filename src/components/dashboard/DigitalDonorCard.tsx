import { useState, useRef, useEffect } from "react";
import {
  Download,
  Share2,
  FileText,
  Award,
  ShieldCheck,
  Check,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Smartphone,
  CreditCard,
  Scroll,
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type Donor } from "@/lib/supabase";
import {
  SocialCardView,
  IdCardFrontView,
  IdCardBackView,
  CertificateView,
} from "@/components/cards/DonorCardTemplates";
import { ScaledCardWrapper } from "@/components/cards/ScaledCardWrapper";
import type { CardData } from "@/components/cards/types";

interface DigitalDonorCardProps {
  donor?: Donor | null;
}

export function DigitalDonorCard({ donor }: DigitalDonorCardProps) {
  // Active Format: 'social' | 'id-card' | 'certificate'
  const [activeFormat, setActiveFormat] = useState<"social" | "id-card" | "certificate">("social");
  // Active Theme: 'light' | 'dark' (Default = Light)
  const [theme, setTheme] = useState<"light" | "dark">("light");
  // Social variant: 'feed' (1080×1350) | 'story' (1080×1920)
  const [socialVariant, setSocialVariant] = useState<"feed" | "story">("feed");
  // ID Card view side: 'front' | 'back'
  const [idCardSide, setIdCardSide] = useState<"front" | "back">("front");

  // Privacy toggles (default: both true)
  const [showName, setShowName] = useState(true);
  const [showArea, setShowArea] = useState(true);

  // QR Code base64 Data URL
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);

  // Hidden exact-dimension render targets for crystal clear 300 DPI exports
  const socialFeedRef = useRef<HTMLDivElement>(null);
  const socialStoryRef = useRef<HTMLDivElement>(null);
  const idFrontRef = useRef<HTMLDivElement>(null);
  const idBackRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Donor Data Normalization
  const donorName = donor?.name || "মুহাম্মদ নাফিজ";
  const donorArea = donor?.area || "কেওয়াটখালি, ময়মনসিংহ";
  const bloodGroup = donor?.blood_group || "B+";
  const rawId = donor?.id || "f5430d5e-0000-0000-0000-000000000000";
  const displayId = `RF-${rawId.replace(/^RF-/i, "").slice(0, 8).toUpperCase()}`;
  const donationCount = donor?.donation_count ?? 3;

  // Generate Real Verification QR code
  useEffect(() => {
    let isMounted = true;
    async function makeQR() {
      try {
        const verifyUrl = `https://roktofinder.com/verify/${displayId}`;
        const url = await QRCode.toDataURL(verifyUrl, {
          margin: 1,
          errorCorrectionLevel: "M",
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
          width: 320,
        });
        if (isMounted) setQrDataUrl(url);
      } catch (err) {
        console.error("QR generation failed:", err);
      }
    }
    makeQR();
    return () => {
      isMounted = false;
    };
  }, [displayId]);

  const cardData: CardData = {
    name: donorName,
    bloodGroup,
    area: donorArea,
    donorId: displayId,
    donationCount,
    qrDataUrl,
    theme,
    showName,
    showArea,
    variant: socialVariant,
  };

  /** Wait for fonts to be ready before capturing with html-to-image */
  const prepareFonts = async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  };

  /** Generic PNG exporter with 3x pixelRatio (300 DPI) */
  const exportNodeToPng = async (node: HTMLDivElement | null, fileName: string) => {
    if (!node) {
      toast.error("রেন্ডার টার্গেট পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      return;
    }

    try {
      setIsExporting(true);
      await prepareFonts();

      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        cacheBust: true,
        quality: 1,
      });

      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      toast.success(`${fileName} সফলভাবে ডাউনলোড হয়েছে!`);
    } catch (err) {
      console.error("Export PNG error:", err);
      toast.error("ইমেজ ডাউনলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsExporting(false);
    }
  };

  // Download Social Feed
  const handleDownloadSocialFeed = () => {
    exportNodeToPng(
      socialFeedRef.current,
      `RoktoFinder-DonorCard-Feed-${donorName.replace(/\s+/g, "_")}-${theme}.png`,
    );
  };

  // Download Social Story
  const handleDownloadSocialStory = () => {
    exportNodeToPng(
      socialStoryRef.current,
      `RoktoFinder-DonorCard-Story-${donorName.replace(/\s+/g, "_")}-${theme}.png`,
    );
  };

  // Download ID Front
  const handleDownloadIdFront = () => {
    exportNodeToPng(
      idFrontRef.current,
      `RoktoFinder-IDCard-Front-${donorName.replace(/\s+/g, "_")}-${theme}.png`,
    );
  };

  // Download ID Back
  const handleDownloadIdBack = () => {
    exportNodeToPng(
      idBackRef.current,
      `RoktoFinder-IDCard-Back-${donorName.replace(/\s+/g, "_")}-${theme}.png`,
    );
  };

  // Download ID Card Both Sides as Print-Ready PDF
  const handleDownloadIdPdf = async () => {
    if (!idFrontRef.current || !idBackRef.current) return;
    try {
      setIsExporting(true);
      await prepareFonts();

      const [frontPng, backPng] = await Promise.all([
        toPng(idFrontRef.current, { pixelRatio: 3, cacheBust: true }),
        toPng(idBackRef.current, { pixelRatio: 3, cacheBust: true }),
      ]);

      // CR80 is 85.6 mm × 53.98 mm
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 54],
      });

      // Page 1: Front
      pdf.addImage(frontPng, "PNG", 0, 0, 85.6, 54);

      // Page 2: Back
      pdf.addPage([85.6, 54], "landscape");
      pdf.addImage(backPng, "PNG", 0, 0, 85.6, 54);

      pdf.save(`RoktoFinder-IDCard-${donorName.replace(/\s+/g, "_")}-${theme}.pdf`);
      toast.success("প্রিন্ট-রেডি ২-সাইডেড আইডি কার্ড PDF ডাউনলোড হয়েছে!");
    } catch (err) {
      console.error("ID PDF export error:", err);
      toast.error("PDF তৈরি করতে সমস্যা হয়েছে।");
    } finally {
      setIsExporting(false);
    }
  };

  // Download Certificate PNG
  const handleDownloadCertificatePng = () => {
    exportNodeToPng(
      certificateRef.current,
      `RoktoFinder-Certificate-${donorName.replace(/\s+/g, "_")}-${theme}.png`,
    );
  };

  // Download Certificate A4 PDF
  const handleDownloadCertificatePdf = async () => {
    if (!certificateRef.current) return;
    try {
      setIsExporting(true);
      await prepareFonts();

      const certPng = await toPng(certificateRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });

      // A4 landscape standard is 297mm × 210mm
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(certPng, "PNG", 0, 0, 297, 210);
      pdf.save(`RoktoFinder-Certificate-${donorName.replace(/\s+/g, "_")}-${theme}.pdf`);
      toast.success("অফিসিয়াল A4 ডোনার সনদপত্র PDF ডাউনলোড হয়েছে!");
    } catch (err) {
      console.error("Certificate PDF export error:", err);
      toast.error("PDF তৈরি করতে সমস্যা হয়েছে।");
    } finally {
      setIsExporting(false);
    }
  };

  // Web Share API with Image Fallback
  const handleWebShare = async () => {
    const shareText = `আমি RoktoFinder-এর একজন গর্বিত রক্তদাতা (${bloodGroup})। রক্তদানের মাধ্যমে জীবন বাঁচাতে এগিয়ে আসুন: https://roktofinder.com/verify/${displayId}`;

    if (navigator.share) {
      try {
        setIsExporting(true);
        await prepareFonts();
        const targetNode =
          activeFormat === "social"
            ? socialVariant === "story"
              ? socialStoryRef.current
              : socialFeedRef.current
            : activeFormat === "certificate"
              ? certificateRef.current
              : idFrontRef.current;

        if (targetNode) {
          const dataUrl = await toPng(targetNode, { pixelRatio: 2 });
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], `RoktoFinder-Card.png`, { type: "image/png" });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "RoktoFinder রক্তদাতা কার্ড",
              text: shareText,
              files: [file],
            });
            toast.success("কার্ডটি সফলভাবে শেয়ার হয়েছে!");
            return;
          }
        }

        // Fallback text share
        await navigator.share({
          title: "RoktoFinder রক্তদাতা কার্ড",
          text: shareText,
          url: `https://roktofinder.com/verify/${displayId}`,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Web share failed:", err);
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
        }
      } finally {
        setIsExporting(false);
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
    }
  };

  return (
    <Card className="overflow-hidden border border-border/80 bg-card p-4 sm:p-6 lg:p-8 shadow-elegant">
      <div className="space-y-6">
        {/* Top Header & Intro */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1">
              <Award className="h-3.5 w-3.5" />
              <span>ডিজিটাল ডোনার পরিচয়পত্র ও সনদপত্র</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-foreground">
              আপনার ডিজিটাল ডোনার কার্ড ও স্বীকৃতি
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              ৩টি আলাদা ফরম্যাটে ও ডার্ক/লাইট থিমে ডাউনলোড বা সোশ্যাল মিডিয়ায় শেয়ার করুন
            </p>
          </div>

          {/* Theme Selector (Light Default) */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-bold text-foreground">থিম:</span>
            <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  theme === "light"
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sun className="h-3.5 w-3.5 text-amber-500" />
                <span>লাইট</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Moon className="h-3.5 w-3.5 text-rose-400" />
                <span>ডার্ক</span>
              </button>
            </div>
          </div>
        </div>

        {/* Studio Controls: Format Tabs & Privacy Toggles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Format Tabs */}
          <div className="lg:col-span-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveFormat("social")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                activeFormat === "social"
                  ? "bg-[#E4002B] text-white border-[#E4002B] shadow-sm"
                  : "bg-muted/40 text-foreground border-border hover:bg-muted"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>সোশ্যাল কার্ড (Feed/Story)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFormat("id-card")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                activeFormat === "id-card"
                  ? "bg-[#E4002B] text-white border-[#E4002B] shadow-sm"
                  : "bg-muted/40 text-foreground border-border hover:bg-muted"
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>প্রিন্ট আইডি কার্ড (CR80)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFormat("certificate")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                activeFormat === "certificate"
                  ? "bg-[#E4002B] text-white border-[#E4002B] shadow-sm"
                  : "bg-muted/40 text-foreground border-border hover:bg-muted"
              }`}
            >
              <Scroll className="h-3.5 w-3.5" />
              <span>সম্মাননা সনদপত্র (A4)</span>
            </button>
          </div>

          {/* Privacy Toggles */}
          <div className="lg:col-span-4 flex items-center justify-start lg:justify-end gap-3 text-xs">
            <button
              type="button"
              onClick={() => setShowName(!showName)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border font-semibold transition-colors cursor-pointer ${
                showName
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : "border-border bg-muted/50 text-muted-foreground"
              }`}
            >
              {showName ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span>নাম {showName ? "অন" : "অফ"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowArea(!showArea)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border font-semibold transition-colors cursor-pointer ${
                showArea
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : "border-border bg-muted/50 text-muted-foreground"
              }`}
            >
              {showArea ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span>এলাকা {showArea ? "অন" : "অফ"}</span>
            </button>
          </div>
        </div>

        {/* Sub-format toggles (for Social and ID Card) */}
        {activeFormat === "social" && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground font-semibold">আকার নির্বাচন:</span>
            <button
              type="button"
              onClick={() => setSocialVariant("feed")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                socialVariant === "feed"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ফিড পোস্ট (৪:৫ • ১০৮০×১৩৫০)
            </button>
            <button
              type="button"
              onClick={() => setSocialVariant("story")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                socialVariant === "story"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              স্টোরি / রিলস (৯:১৬ • ১০৮০×১৯২০)
            </button>
          </div>
        )}

        {activeFormat === "id-card" && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground font-semibold">পাশ নির্বাচন:</span>
            <button
              type="button"
              onClick={() => setIdCardSide("front")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                idCardSide === "front"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              সামনের পাশ (Front)
            </button>
            <button
              type="button"
              onClick={() => setIdCardSide("back")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                idCardSide === "back"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              পেছনের পাশ (Back / QR)
            </button>
          </div>
        )}

        {/* Live Interactive Scaled Preview */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-neutral-900/5 dark:bg-black/40 p-4 sm:p-6 flex items-center justify-center">
          <div className="w-full flex justify-center items-center">
            {activeFormat === "social" && (
              <ScaledCardWrapper
                targetWidth={1080}
                targetHeight={socialVariant === "story" ? 1920 : 1350}
                maxWidth={socialVariant === "story" ? 360 : 420}
                className="rounded-2xl shadow-xl shadow-rose-950/20"
              >
                <SocialCardView {...cardData} variant={socialVariant} />
              </ScaledCardWrapper>
            )}

            {activeFormat === "id-card" && (
              <ScaledCardWrapper
                targetWidth={856}
                targetHeight={540}
                maxWidth={520}
                className="rounded-2xl shadow-xl shadow-rose-950/20"
              >
                {idCardSide === "front" ? (
                  <IdCardFrontView {...cardData} />
                ) : (
                  <IdCardBackView {...cardData} />
                )}
              </ScaledCardWrapper>
            )}

            {activeFormat === "certificate" && (
              <ScaledCardWrapper
                targetWidth={1123}
                targetHeight={794}
                maxWidth={540}
                className="rounded-2xl shadow-xl shadow-rose-950/20"
              >
                <CertificateView {...cardData} />
              </ScaledCardWrapper>
            )}
          </div>
        </div>

        {/* Action Download Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {activeFormat === "social" && (
              <>
                <Button
                  type="button"
                  onClick={handleDownloadSocialFeed}
                  disabled={isExporting}
                  className="bg-[#E4002B] hover:bg-[#C8102E] text-white font-bold text-xs h-10 px-4 cursor-pointer shadow-soft"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  ) : (
                    <Download className="h-4 w-4 mr-1.5" />
                  )}
                  <span>ফিড কার্ড (১০৮০×১৩৫০ PNG)</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadSocialStory}
                  disabled={isExporting}
                  className="border-border text-foreground font-bold text-xs h-10 px-4 cursor-pointer"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  <span>স্টোরি কার্ড (১০৮০×১৯২০ PNG)</span>
                </Button>
              </>
            )}

            {activeFormat === "id-card" && (
              <>
                <Button
                  type="button"
                  onClick={handleDownloadIdFront}
                  disabled={isExporting}
                  className="bg-[#E4002B] hover:bg-[#C8102E] text-white font-bold text-xs h-10 px-4 cursor-pointer shadow-soft"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  ) : (
                    <Download className="h-4 w-4 mr-1.5" />
                  )}
                  <span>সামনের পাশ (PNG)</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadIdBack}
                  disabled={isExporting}
                  className="border-border text-foreground font-bold text-xs h-10 px-4 cursor-pointer"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  <span>পেছনের পাশ (PNG)</span>
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDownloadIdPdf}
                  disabled={isExporting}
                  className="font-bold text-xs h-10 px-4 cursor-pointer"
                >
                  <FileText className="h-4 w-4 mr-1.5" />
                  <span>প্রিন্ট PDF (উভয় পাশ)</span>
                </Button>
              </>
            )}

            {activeFormat === "certificate" && (
              <>
                <Button
                  type="button"
                  onClick={handleDownloadCertificatePng}
                  disabled={isExporting}
                  className="bg-[#E4002B] hover:bg-[#C8102E] text-white font-bold text-xs h-10 px-4 cursor-pointer shadow-soft"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  ) : (
                    <Download className="h-4 w-4 mr-1.5" />
                  )}
                  <span>সনদপত্র (HD PNG)</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadCertificatePdf}
                  disabled={isExporting}
                  className="border-border text-foreground font-bold text-xs h-10 px-4 cursor-pointer"
                >
                  <FileText className="h-4 w-4 mr-1.5" />
                  <span>সনদপত্র (A4 PDF)</span>
                </Button>
              </>
            )}

            <Button
              type="button"
              variant="secondary"
              onClick={handleWebShare}
              disabled={isExporting}
              className="font-bold text-xs h-10 px-4 cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-600"
            >
              <Share2 className="h-4 w-4 mr-1.5" />
              <span>শেয়ার করুন</span>
            </Button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>কার্ডে ফোন নম্বর বা ইমেইল কখনো ছাপা হয় না</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          Hidden Exact 1:1 Pixel Render Targets for 300 DPI Export via html-to-image
          ========================================================================= */}
      <div
        style={{
          position: "fixed",
          left: "-9999px",
          top: "-9999px",
          pointerEvents: "none",
          opacity: 1,
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        {/* 1. Social Feed Target (1080×1350) */}
        <SocialCardView ref={socialFeedRef} {...cardData} variant="feed" />

        {/* 2. Social Story Target (1080×1920) */}
        <SocialCardView ref={socialStoryRef} {...cardData} variant="story" />

        {/* 3. ID Card Front Target (856×540) */}
        <IdCardFrontView ref={idFrontRef} {...cardData} />

        {/* 4. ID Card Back Target (856×540) */}
        <IdCardBackView ref={idBackRef} {...cardData} />

        {/* 5. Certificate Target (1123×794) */}
        <CertificateView ref={certificateRef} {...cardData} />
      </div>
    </Card>
  );
}
