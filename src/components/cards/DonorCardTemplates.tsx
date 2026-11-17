import React from "react";
import logo from "@/assets/logo-real.png";
import { toBnNum } from "@/lib/supabase";
import { getTierInfo } from "@/lib/donor-card-utils";

export type { CardData } from "./types";

/** Blood Drop SVG matching exact specification */
export function BloodDropIcon({
  bloodGroup,
  width = 330,
  height = 396,
  showGroupLabel = true,
}: {
  bloodGroup: string;
  width?: number;
  height?: number;
  showGroupLabel?: boolean;
}) {
  return (
    <div
      style={{
        width,
        height,
        filter: "drop-shadow(0 24px 60px rgba(228, 0, 43, 0.55))",
        position: "relative",
      }}
      className="flex flex-col items-center justify-center select-none"
    >
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full absolute inset-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blood drop path */}
        <path d="M50 4 C50 4 12 52 12 80 A38 38 0 0 0 88 80 C88 52 50 4 50 4Z" fill="#E4002B" />
        {/* White highlight stroke on the left for 3D glossy droplet look */}
        <path
          d="M46 18 C36 34 24 56 22 74"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>

      {/* Centered blood group text inside drop */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        style={{ marginTop: height * 0.16 }}
      >
        <span
          style={{
            fontSize: width > 200 ? "96px" : "32px",
            lineHeight: 1,
            color: "#FFFFFF",
            fontFamily: "'Hind Siliguri', sans-serif",
            fontWeight: 900,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {bloodGroup}
        </span>
        {showGroupLabel && (
          <span
            style={{
              fontSize: width > 200 ? "22px" : "11px",
              color: "rgba(255, 255, 255, 0.92)",
              fontFamily: "'Hind Siliguri', sans-serif",
              fontWeight: 700,
              marginTop: width > 200 ? "8px" : "2px",
              letterSpacing: "0.05em",
            }}
          >
            রক্তের গ্রুপ
          </span>
        )}
      </div>
    </div>
  );
}

/** Verified Donor Pill */
export function VerifiedPill({ theme }: { theme: "light" | "dark" }) {
  const isDark = theme === "dark";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 22px",
        borderRadius: "9999px",
        backgroundColor: isDark ? "rgba(91, 214, 143, 0.12)" : "rgba(11, 107, 58, 0.08)",
        border: `1.5px solid ${isDark ? "#5BD68F" : "#0B6B3A"}`,
        color: isDark ? "#5BD68F" : "#0B6B3A",
        fontFamily: "'Hind Siliguri', sans-serif",
        fontSize: "20px",
        fontWeight: 700,
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      <span>ভেরিফাইড ডোনার</span>
    </div>
  );
}

/* =========================================================================
   1. Social Share Card (Feed 1080×1350 & Story 1080×1920)
   ========================================================================= */
export const SocialCardView = React.forwardRef<HTMLDivElement, CardData>(function SocialCardView(
  {
    name,
    bloodGroup,
    area,
    donorId: _donorId,
    donationCount,
    qrDataUrl,
    theme,
    showName = true,
    showArea = true,
    variant = "feed",
  },
  ref,
) {
  const isDark = theme === "dark";
  const isStory = variant === "story";
  const width = 1080;
  const height = isStory ? 1920 : 1350;
  const tier = getTierInfo(donationCount);

  const displayName = showName ? name : "সম্মানিত রক্তদাতা";
  const displayArea = showArea ? area : "ময়মনসিংহ";

  // Auto-fit name font size
  const nameFontSize = displayName.length > 22 ? "68px" : displayName.length > 15 ? "80px" : "92px";

  return (
    <div
      ref={ref}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: isDark ? "#12070A" : "#FFF8F6",
        backgroundImage: isDark
          ? "radial-gradient(circle at 50% 42%, rgba(228,0,43,0.45) 0%, transparent 55%), radial-gradient(circle at 100% 0%, rgba(228,0,43,0.20) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(228,0,43,0.20) 0%, transparent 40%)"
          : "radial-gradient(circle at 50% 42%, rgba(228,0,43,0.26) 0%, transparent 52%), radial-gradient(circle at 100% 0%, rgba(228,0,43,0.13) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(228,0,43,0.13) 0%, transparent 40%)",
        color: isDark ? "#FFFFFF" : "#231418",
        fontFamily: "'Hind Siliguri', sans-serif",
        padding: isStory ? "120px 80px 100px" : "70px 80px 60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src={logo}
            alt="RoktoFinder"
            style={{ width: "68px", height: "68px", objectFit: "contain" }}
          />
          <div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: isDark ? "#FFFFFF" : "#C8102E",
                lineHeight: 1.1,
              }}
            >
              RoktoFinder
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: isDark ? "#F2C4CC" : "#6B565B",
                marginTop: "4px",
              }}
            >
              ময়মনসিংহ ব্লাড নেটওয়ার্ক
            </div>
          </div>
        </div>

        {/* Verified Pill */}
        <VerifiedPill theme={theme} />
      </div>

      {/* Main Body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          margin: isStory ? "auto 0" : "20px 0",
        }}
      >
        <span
          style={{
            fontSize: "36px",
            fontWeight: 600,
            color: isDark ? "#F2C4CC" : "#6B565B",
            marginBottom: "4px",
          }}
        >
          আমি একজন
        </span>
        <h1
          style={{
            fontSize: "132px",
            fontWeight: 900,
            lineHeight: 1.05,
            color: isDark ? "#FFFFFF" : "#231418",
            margin: "0 0 24px 0",
            letterSpacing: "-0.02em",
          }}
        >
          রক্তদাতা
        </h1>

        {/* Blood Drop */}
        <BloodDropIcon bloodGroup={bloodGroup} width={330} height={396} />

        {/* Donor Name */}
        <h2
          style={{
            fontSize: nameFontSize,
            fontWeight: 800,
            lineHeight: 1.15,
            color: isDark ? "#FFFFFF" : "#231418",
            margin: "32px 0 10px 0",
            maxWidth: "960px",
            wordBreak: "break-word",
          }}
        >
          {displayName}
        </h2>

        {/* Area */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: 600,
            color: isDark ? "#F2C4CC" : "#6B565B",
            marginBottom: "24px",
          }}
        >
          {displayArea}
        </div>

        {/* Tier badge */}
        <div
          style={{
            display: "inline-block",
            backgroundColor: tier.bg,
            color: tier.text,
            border: `1.5px solid ${tier.border}`,
            fontSize: "28px",
            fontWeight: 800,
            padding: "10px 36px",
            borderRadius: "9999px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          }}
        >
          {tier.title} · {toBnNum(donationCount)} বার রক্তদান
        </div>
      </div>

      {/* CTA Bottom Band */}
      <div
        style={{
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(228, 0, 43, 0.05)",
          border: `1.5px solid ${isDark ? "rgba(228, 0, 43, 0.35)" : "rgba(228, 0, 43, 0.18)"}`,
          borderRadius: "28px",
          padding: "24px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 30px rgba(228, 0, 43, 0.06)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 900,
              color: isDark ? "#FFFFFF" : "#231418",
              lineHeight: 1.15,
            }}
          >
            আপনিও রক্তদাতা হোন
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: 800,
              color: isDark ? "#FF5A6E" : "#C8102E",
              marginTop: "6px",
            }}
          >
            roktofinder.com
          </div>
        </div>

        {/* Real QR */}
        <div
          style={{
            width: "150px",
            height: "150px",
            backgroundColor: "#FFFFFF",
            borderRadius: "18px",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
          }}
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code"
              style={{ width: "134px", height: "134px", objectFit: "contain" }}
            />
          ) : (
            <div style={{ color: "#000", fontSize: "14px", fontWeight: "bold" }}>QR Code</div>
          )}
        </div>
      </div>
    </div>
  );
});

/* =========================================================================
   2. Print ID Card (CR80 Standard, 856×540 px) - FRONT
   ========================================================================= */
export const IdCardFrontView = React.forwardRef<HTMLDivElement, CardData>(function IdCardFrontView(
  {
    name,
    bloodGroup,
    area,
    donorId,
    donationCount,
    qrDataUrl: _qrDataUrl,
    theme,
    showName = true,
    showArea = true,
  },
  ref,
) {
  const isDark = theme === "dark";
  const width = 856;
  const height = 540;
  const tier = getTierInfo(donationCount);

  const displayName = showName ? name : "সম্মানিত রক্তদাতা";
  const displayArea = showArea ? area : "ময়মনসিংহ";
  const displayId = donorId.startsWith("RF-") ? donorId : `RF-${donorId.slice(0, 8).toUpperCase()}`;

  const nameFontSize = displayName.length > 20 ? "46px" : displayName.length > 14 ? "54px" : "62px";

  return (
    <div
      ref={ref}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: isDark ? "#170A0E" : "#FFF9F7",
        backgroundImage: isDark
          ? "radial-gradient(circle at 50% 42%, rgba(228,0,43,0.45) 0%, transparent 55%), radial-gradient(circle at 100% 0%, rgba(228,0,43,0.20) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(228,0,43,0.20) 0%, transparent 40%)"
          : "radial-gradient(circle at 50% 42%, rgba(228,0,43,0.26) 0%, transparent 52%), radial-gradient(circle at 100% 0%, rgba(228,0,43,0.13) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(228,0,43,0.13) 0%, transparent 40%)",
        color: isDark ? "#FFFFFF" : "#231418",
        fontFamily: "'Hind Siliguri', sans-serif",
        borderRadius: "28px",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `1.5px solid ${isDark ? "rgba(228,0,43,0.3)" : "rgba(228,0,43,0.15)"}`,
      }}
    >
      {/* 20px Top Red Stripe */}
      <div style={{ height: "20px", backgroundColor: "#E4002B", width: "100%" }} />

      {/* Header */}
      <div
        style={{
          padding: "24px 44px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img
            src={logo}
            alt="RoktoFinder"
            style={{ width: "52px", height: "52px", objectFit: "contain" }}
          />
          <div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 900,
                color: isDark ? "#FFFFFF" : "#C8102E",
                lineHeight: 1.1,
              }}
            >
              RoktoFinder
            </div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: isDark ? "#F2C4CC" : "#6B565B",
                marginTop: "2px",
              }}
            >
              ময়মনসিংহ ব্লাড নেটওয়ার্ক
            </div>
          </div>
        </div>

        {/* Small Verified Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 18px",
            borderRadius: "9999px",
            backgroundColor: isDark ? "rgba(91, 214, 143, 0.12)" : "rgba(11, 107, 58, 0.08)",
            border: `1.5px solid ${isDark ? "#5BD68F" : "#0B6B3A"}`,
            color: isDark ? "#5BD68F" : "#0B6B3A",
            fontSize: "15px",
            fontWeight: 700,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>ভেরিফাইড ডোনার</span>
        </div>
      </div>

      {/* Body: Donor Info + Blood Group Box */}
      <div
        style={{
          padding: "16px 44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ maxWidth: "540px" }}>
          <div
            style={{
              fontSize: "17px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: isDark ? "#F2C4CC" : "#6B565B",
              marginBottom: "4px",
            }}
          >
            রক্তদাতার নাম
          </div>
          <h2
            style={{
              fontSize: nameFontSize,
              fontWeight: 900,
              lineHeight: 1.15,
              color: isDark ? "#FFFFFF" : "#231418",
              margin: "0 0 10px 0",
            }}
          >
            {displayName}
          </h2>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: isDark ? "#F2C4CC" : "#6B565B",
            }}
          >
            {displayArea} · ID: {displayId}
          </div>
        </div>

        {/* 160×160 Blood Group Box */}
        <div
          style={{
            width: "160px",
            height: "160px",
            backgroundColor: "#E4002B",
            borderRadius: "28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 18px 45px rgba(228, 0, 43, 0.5)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1,
            }}
          >
            {bloodGroup}
          </span>
          <span
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.95)",
              marginTop: "4px",
              letterSpacing: "0.04em",
            }}
          >
            রক্তের গ্রুপ
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "0 44px 34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Tier badge */}
        <div
          style={{
            backgroundColor: tier.bg,
            color: tier.text,
            border: `1.5px solid ${tier.border}`,
            fontSize: "18px",
            fontWeight: 800,
            padding: "8px 26px",
            borderRadius: "9999px",
          }}
        >
          {tier.title} · {toBnNum(donationCount)} বার
        </div>

        <div
          style={{
            fontSize: "17px",
            fontWeight: 600,
            color: isDark ? "#F2C4CC" : "#6B565B",
          }}
        >
          স্বেচ্ছাসেবী রক্তদান উদ্যোগ
        </div>
      </div>
    </div>
  );
});

/* =========================================================================
   2. Print ID Card (CR80 Standard, 856×540 px) - BACK
   ========================================================================= */
export const IdCardBackView = React.forwardRef<HTMLDivElement, CardData>(function IdCardBackView(
  { qrDataUrl, theme },
  ref,
) {
  const isDark = theme === "dark";
  const width = 856;
  const height = 540;

  return (
    <div
      ref={ref}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: isDark ? "#170A0E" : "#FFF9F7",
        backgroundImage: isDark
          ? "radial-gradient(circle at 50% 42%, rgba(228,0,43,0.45) 0%, transparent 55%), radial-gradient(circle at 100% 0%, rgba(228,0,43,0.20) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(228,0,43,0.20) 0%, transparent 40%)"
          : "radial-gradient(circle at 50% 42%, rgba(228,0,43,0.26) 0%, transparent 52%), radial-gradient(circle at 100% 0%, rgba(228,0,43,0.13) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(228,0,43,0.13) 0%, transparent 40%)",
        color: isDark ? "#FFFFFF" : "#231418",
        fontFamily: "'Hind Siliguri', sans-serif",
        borderRadius: "28px",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `1.5px solid ${isDark ? "rgba(228,0,43,0.3)" : "rgba(228,0,43,0.15)"}`,
      }}
    >
      {/* 20px Top Red Stripe */}
      <div style={{ height: "20px", backgroundColor: "#E4002B", width: "100%" }} />

      {/* Content */}
      <div
        style={{
          padding: "36px 50px 44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "40px",
          height: "100%",
        }}
      >
        {/* Left Information */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 900,
              color: isDark ? "#FF5A6E" : "#C8102E",
              marginBottom: "16px",
              lineHeight: 1.1,
            }}
          >
            জরুরি রক্তের প্রয়োজনে
          </h2>

          <p
            style={{
              fontSize: "20px",
              fontWeight: 500,
              color: isDark ? "#F2C4CC" : "#231418",
              lineHeight: 1.6,
              marginBottom: "12px",
            }}
          >
            ডোনারের তথ্য যাচাই করতে QR কোড স্ক্যান করুন, অথবা ভিজিট করুন:
          </p>

          <div
            style={{
              fontSize: "30px",
              fontWeight: 900,
              color: isDark ? "#FFFFFF" : "#231418",
              marginBottom: "20px",
            }}
          >
            roktofinder.com
          </div>

          <div
            style={{
              fontSize: "15px",
              fontWeight: 500,
              color: isDark ? "#F2C4CC" : "#6B565B",
              lineHeight: 1.5,
            }}
          >
            কার্ডটি ডোনারের নিজস্ব পরিচয়পত্র। এতে ফোন নম্বর ছাপা নেই।
          </div>
        </div>

        {/* Right QR Container (240px) */}
        <div
          style={{
            width: "240px",
            height: "240px",
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            border: `2px dashed ${isDark ? "rgba(228,0,43,0.4)" : "#E4002B"}`,
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            flexShrink: 0,
          }}
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code"
              style={{ width: "212px", height: "212px", objectFit: "contain" }}
            />
          ) : (
            <div style={{ color: "#000", fontSize: "16px", fontWeight: "bold" }}>QR Verify</div>
          )}
        </div>
      </div>
    </div>
  );
});

/* =========================================================================
   3. A4 Certificate (Landscape, 1123×794 px)
   ========================================================================= */
export const CertificateView = React.forwardRef<HTMLDivElement, CardData>(function CertificateView(
  {
    name,
    bloodGroup,
    area,
    donorId,
    donationCount,
    qrDataUrl,
    theme,
    showName = true,
    showArea = true,
  },
  ref,
) {
  const isDark = theme === "dark";
  const width = 1123;
  const height = 794;
  const tier = getTierInfo(donationCount);

  const displayName = showName ? name : "সম্মানিত রক্তদাতা";
  const displayArea = showArea ? area : "ময়মনসিংহ";
  const displayId = donorId.startsWith("RF-") ? donorId : `RF-${donorId.slice(0, 8).toUpperCase()}`;

  const nameFontSize = displayName.length > 20 ? "56px" : displayName.length > 14 ? "64px" : "72px";

  return (
    <div
      ref={ref}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: isDark ? "#12070A" : "#FFF8F6",
        backgroundImage: isDark
          ? "radial-gradient(circle at 50% 42%, rgba(228,0,43,0.45) 0%, transparent 55%), radial-gradient(circle at 100% 0%, rgba(228,0,43,0.20) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(228,0,43,0.20) 0%, transparent 40%)"
          : "radial-gradient(circle at 50% 42%, rgba(228,0,43,0.26) 0%, transparent 52%), radial-gradient(circle at 100% 0%, rgba(228,0,43,0.13) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(228,0,43,0.13) 0%, transparent 40%)",
        color: isDark ? "#FFFFFF" : "#231418",
        fontFamily: "'Hind Siliguri', sans-serif",
        position: "relative",
        boxSizing: "border-box",
        padding: "24px",
      }}
    >
      {/* Outer Red Border (4px) */}
      <div
        style={{
          width: "100%",
          height: "100%",
          border: "4px solid #E4002B",
          borderRadius: "24px",
          padding: "12px",
          boxSizing: "border-box",
        }}
      >
        {/* Inner Red Border (1px) */}
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid #E4002B",
            borderRadius: "16px",
            padding: "44px 60px 36px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img
              src={logo}
              alt="RoktoFinder"
              style={{ width: "64px", height: "64px", objectFit: "contain", marginBottom: "8px" }}
            />
            <div
              style={{
                fontSize: "26px",
                fontWeight: 900,
                color: isDark ? "#FFFFFF" : "#C8102E",
                lineHeight: 1.1,
              }}
            >
              RoktoFinder
            </div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: isDark ? "#F2C4CC" : "#6B565B",
                marginTop: "2px",
              }}
            >
              ময়মনসিংহ ব্লাড নেটওয়ার্ক
            </div>

            <h1
              style={{
                fontSize: "52px",
                fontWeight: 900,
                color: "#E4002B",
                marginTop: "14px",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              রক্তদান সনদ
            </h1>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: isDark ? "#F2C4CC" : "#6B565B",
                marginTop: "4px",
              }}
            >
              CERTIFICATE OF VOLUNTARY BLOOD DONOR
            </div>
          </div>

          {/* Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "16px 0",
            }}
          >
            <span
              style={{
                fontSize: "22px",
                fontWeight: 500,
                color: isDark ? "#F2C4CC" : "#6B565B",
              }}
            >
              এই মর্মে প্রত্যয়ন করা হচ্ছে যে
            </span>

            <h2
              style={{
                fontSize: nameFontSize,
                fontWeight: 900,
                color: isDark ? "#FFFFFF" : "#231418",
                margin: "8px 0 16px 0",
                lineHeight: 1.15,
              }}
            >
              {displayName}
            </h2>

            <p
              style={{
                fontSize: "20px",
                fontWeight: 500,
                lineHeight: 1.6,
                maxWidth: "840px",
                color: isDark ? "#F2C4CC" : "#231418",
                margin: 0,
              }}
            >
              (ব্লাড গ্রুপ {bloodGroup}, {displayArea}) স্বেচ্ছায় {toBnNum(donationCount)} বার
              রক্তদান করে মানবসেবায় অবদান রেখেছেন। এই মহৎ উদ্যোগের স্বীকৃতিস্বরূপ তাঁকে{" "}
              {tier.title} সম্মাননা প্রদান করা হলো।
            </p>
          </div>

          {/* Footer (3 Columns) */}
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              alignItems: "end",
              paddingTop: "10px",
            }}
          >
            {/* Left Column: QR Code + ID */}
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#FFFFFF",
                  border: `1.5px dashed ${isDark ? "rgba(228,0,43,0.4)" : "#E4002B"}`,
                  borderRadius: "14px",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR"
                    style={{ width: "88px", height: "88px", objectFit: "contain" }}
                  />
                ) : (
                  <span style={{ fontSize: "12px", color: "#000", fontWeight: "bold" }}>QR</span>
                )}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: isDark ? "#F2C4CC" : "#6B565B",
                  marginTop: "6px",
                  fontFamily: "monospace",
                }}
              >
                ID: {displayId}
              </div>
            </div>

            {/* Center Column: Blood Drop Emblem + Tier Badge */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ marginBottom: "8px" }}>
                <BloodDropIcon
                  bloodGroup={bloodGroup}
                  width={60}
                  height={72}
                  showGroupLabel={false}
                />
              </div>
              <div
                style={{
                  backgroundColor: tier.bg,
                  color: tier.text,
                  border: `1.5px solid ${tier.border}`,
                  fontSize: "16px",
                  fontWeight: 800,
                  padding: "6px 22px",
                  borderRadius: "9999px",
                }}
              >
                {tier.title} · {toBnNum(donationCount)} বার
              </div>
            </div>

            {/* Right Column: Date + Signature Line + Authority */}
            <div
              style={{
                textAlign: "right",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: isDark ? "#F2C4CC" : "#6B565B",
                  marginBottom: "40px",
                }}
              >
                [তারিখ]
              </div>
              <div
                style={{
                  width: "200px",
                  borderBottom: `1.5px solid ${isDark ? "#F2C4CC" : "#6B565B"}`,
                  marginBottom: "6px",
                }}
              />
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: isDark ? "#FFFFFF" : "#231418",
                }}
              >
                [স্বাক্ষর]
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: isDark ? "#F2C4CC" : "#6B565B",
                  marginTop: "2px",
                }}
              >
                [কর্তৃপক্ষের নাম ও পদবি]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
