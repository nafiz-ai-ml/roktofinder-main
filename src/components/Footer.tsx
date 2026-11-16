import {
  Linkedin,
  Github,
  Mail,
  Lightbulb,
  HeartHandshake,
  Heart,
  ArrowUp,
  Droplet,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function XIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const FEATURE_REQUEST_URL = "https://forms.gle/tTHRuHy7SoAGAdRV7";
const HELP_EMAIL = "roktofinder@gmail.com";
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-border bg-muted/30">
      {/* Gradient top accent */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* Subtle radial glow background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(600px circle at 15% 0%, oklch(0.58 0.22 27 / 0.08), transparent 60%), radial-gradient(500px circle at 85% 100%, oklch(0.58 0.22 27 / 0.06), transparent 55%)",
        }}
      />

      <div className="container relative mx-auto px-4 py-12">
        {/* Help via email strip */}
        <div className="animate-on-scroll mb-10 flex flex-col items-start justify-between gap-3 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                সাহায্য প্রয়োজন? ইমেইল করুন
              </div>
              <div className="text-xs text-muted-foreground">Email Support · ময়মনসিংহ এলাকা</div>
            </div>
          </div>
          <a
            href={`mailto:${HELP_EMAIL}`}
            className="group/mail inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]"
          >
            <Mail className="h-4 w-4" />
            {HELP_EMAIL}
          </a>
        </div>

        {/* Main grid */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="animate-on-scroll">
            <Link to="/" className="group/logo flex items-start gap-2">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden transition-all duration-300 group-hover/logo:drop-shadow-[0_0_20px_oklch(0.58_0.22_27/0.5)]">
                <img
                  src={logo}
                  alt="RoktoFinder লোগো"
                  className="h-14 w-14 object-contain transition-transform duration-300 group-hover/logo:scale-110"
                />
              </div>
              <div>
                <div className="bg-gradient-to-r from-primary to-[oklch(0.5_0.24_20)] bg-clip-text text-lg font-bold text-transparent">
                  RoktoFinder
                </div>
                <div className="text-xs text-muted-foreground">
                  ময়মনসিংহের প্রথম রক্তদাতা প্ল্যাটফর্ম
                </div>
              </div>
            </Link>

            {/* Stats strip */}
            <div className="mt-5 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="bg-gradient-to-r from-primary to-[oklch(0.5_0.24_20)] bg-clip-text font-bold text-transparent">
                  ময়মনসিংহ
                </span>
                ভিত্তিক রক্তদাতা প্ল্যাটফর্ম
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-on-scroll">
            <div className="mb-4 text-sm font-semibold text-foreground">দ্রুত লিংক</div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                { to: "/directory", label: "দাতা খুঁজুন" },
                { to: "/register", label: "নিবন্ধন করুন" },
                { to: "/emergency", label: "জরুরি অনুরোধ" },
                { to: "/dashboard", label: "ড্যাশবোর্ড" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group/link relative inline-block transition-colors hover:text-primary"
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-[oklch(0.5_0.24_20)] transition-all duration-300 group-hover/link:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div className="animate-on-scroll">
            <div className="mb-4 text-sm font-semibold text-foreground">কমিউনিটি</div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href={FEATURE_REQUEST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link relative inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                >
                  <Lightbulb className="h-3.5 w-3.5 transition-transform group-hover/link:rotate-12" />
                  Feature Request
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-[oklch(0.5_0.24_20)] transition-all duration-300 group-hover/link:w-full" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${HELP_EMAIL}`}
                  className="group/link relative inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                >
                  <HeartHandshake className="h-3.5 w-3.5 transition-transform group-hover/link:scale-110" />
                  সাহায্য করুন (Email)
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-[oklch(0.5_0.24_20)] transition-all duration-300 group-hover/link:w-full" />
                </a>
              </li>
              <li>
                <Link
                  to="/help"
                  className="group/link relative inline-block transition-colors hover:text-primary"
                >
                  সাহায্য কেন্দ্র
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-[oklch(0.5_0.24_20)] transition-all duration-300 group-hover/link:w-full" />
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="group/link relative inline-block transition-colors hover:text-primary"
                >
                  গোপনীয়তা নীতি
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-[oklch(0.5_0.24_20)] transition-all duration-300 group-hover/link:w-full" />
                </Link>
              </li>
              <li>
                <Link
                  to="/stats"
                  className="group/link relative inline-block transition-colors hover:text-primary"
                >
                  সাইট পরিসংখ্যান
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-[oklch(0.5_0.24_20)] transition-all duration-300 group-hover/link:w-full" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Blood type quick filter */}
        <div className="animate-on-scroll mt-10 rounded-xl border border-border bg-background/50 p-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Droplet className="h-4 w-4 text-primary" />
            রক্তের গ্রুপ অনুযায়ী খুঁজুন
          </div>
          <div className="flex flex-wrap gap-2">
            {BLOOD_GROUPS.map((bg) => (
              <Link
                key={bg}
                to="/directory"
                search={{ bg } as never}
                className="group/bg inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-[0_4px_12px_-4px_oklch(0.58_0.22_27/0.4)]"
              >
                <Droplet className="h-3 w-3 transition-transform group-hover/bg:scale-125" />
                {bg}
              </Link>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 max-w-2xl text-xs text-muted-foreground">
          ⚠️ যোগাযোগের আগে দাতাকে যাচাই করুন। শুধুমাত্র শারীরিকভাবে সক্ষম হলে রক্ত দিন। RoktoFinder
          কোনো চিকিৎসা পরামর্শ প্রদান করে না।
        </p>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            {/* WhatsApp */}
            <a
              href="https://wa.me/8801540380805"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp: +8801540380805"
              className="group/social flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-primary hover:to-[oklch(0.5_0.24_20)] hover:text-primary-foreground hover:shadow-[0_8px_20px_-6px_oklch(0.58_0.22_27/0.5)]"
            >
              <WhatsAppIcon className="h-4 w-4 transition-transform group-hover/social:scale-110" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/nafiz-ai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="group/social flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-primary hover:to-[oklch(0.5_0.24_20)] hover:text-primary-foreground hover:shadow-[0_8px_20px_-6px_oklch(0.58_0.22_27/0.5)]"
            >
              <Linkedin className="h-4 w-4 transition-transform group-hover/social:scale-110" />
            </a>

            {/* X (formerly Twitter) */}
            <a
              href="https://x.com/MUHAMMADNA70418"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              title="X (Twitter)"
              className="group/social flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-primary hover:to-[oklch(0.5_0.24_20)] hover:text-primary-foreground hover:shadow-[0_8px_20px_-6px_oklch(0.58_0.22_27/0.5)]"
            >
              <XIcon className="h-3.5 w-3.5 transition-transform group-hover/social:scale-110" />
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/nafiz-ai-ml/roktofinder-main"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="group/social flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-primary hover:to-[oklch(0.5_0.24_20)] hover:text-primary-foreground hover:shadow-[0_8px_20px_-6px_oklch(0.58_0.22_27/0.5)]"
            >
              <Github className="h-4 w-4 transition-transform group-hover/social:scale-110" />
            </a>

            {/* Email */}
            <a
              href={`mailto:${HELP_EMAIL}`}
              aria-label="Email"
              title="ইমেইল করুন"
              className="group/social flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-primary hover:to-[oklch(0.5_0.24_20)] hover:text-primary-foreground hover:shadow-[0_8px_20px_-6px_oklch(0.58_0.22_27/0.5)]"
            >
              <Mail className="h-4 w-4 transition-transform group-hover/social:scale-110" />
            </a>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            © {new Date().getFullYear()} RoktoFinder · Made by{" "}
            <a
              href="https://muhammad-nafiz.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              Muhammad Nafiz
            </a>
          </p>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        aria-label="উপরে যান"
        className="group/top absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.5_0.24_20)] text-primary-foreground shadow-[var(--shadow-elegant)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_30px_-6px_oklch(0.58_0.22_27/0.6)]"
      >
        <ArrowUp className="h-4 w-4 transition-transform group-hover/top:-translate-y-0.5" />
      </button>
    </footer>
  );
}
