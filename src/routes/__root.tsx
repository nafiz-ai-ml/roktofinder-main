import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/sonner";
import { PageTransition } from "@/components/PageTransition";
import { AnnouncementTicker } from "@/components/AnnouncementTicker";
import { SiteNoticeDialog } from "@/components/SiteNoticeDialog";
import { trackPageView } from "@/lib/analytics";
import appCss from "../styles.css?url";

/** Sends one pageview per client-side navigation (admin pages excluded). */
function AnalyticsTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const prev = useRef<string | null>(null);

  useEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">৪০৪</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">পেজ খুঁজে পাওয়া যায়নি</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          আপনি যে পেজটি খুঁজছেন তা বিদ্যমান নেই বা সরিয়ে নেওয়া হয়েছে।
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            হোমে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "RoktoFinder" },
      { name: "google-site-verification", content: "gSmwVK0AVrsXXSbUdqcmXr2AcH_B3SHuqfoKTUAq4_Q" },
      { property: "og:site_name", content: "RoktoFinder" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/93585cbb-7e8d-49e6-99f4-6a7a3a05ba47/id-preview-d29b7e30--5726f852-061a-4e29-93bc-0c4f21926e50.lovable.app-1776750705666.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/93585cbb-7e8d-49e6-99f4-6a7a3a05ba47/id-preview-d29b7e30--5726f852-061a-4e29-93bc-0c4f21926e50.lovable.app-1776750705666.png" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Noto+Sans+Bengali:wght@400;700&family=Baloo+Da+2:wght@600;700;800&family=Tiro+Bangla:ital@0;1&family=Anek+Bangla:wght@500;700&family=Mina:wght@400;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <AnalyticsTracker />
      <AnnouncementTicker />
      <PageTransition>
        <Outlet />
      </PageTransition>
      <SiteNoticeDialog />
      <Toaster richColors position="top-center" />
    </>
  );
}
