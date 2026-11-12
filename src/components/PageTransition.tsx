import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * PageTransition: fades+slides children on every route change.
 * Also wires up an IntersectionObserver so any element with the
 * `animate-on-scroll` utility class fades in when scrolled into view.
 * Shows a top progress bar while the next route is loading so users
 * get immediate feedback after clicking a nav link.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoading = useRouterState({ select: (s) => s.isLoading || s.status === "pending" });
  const [key, setKey] = useState(pathname);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setKey(pathname);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    const observe = () => {
      const targets = root.querySelectorAll<HTMLElement>(".animate-on-scroll:not(.is-visible)");
      targets.forEach((el) => observer.observe(el));
    };

    observe();
    const mo = new MutationObserver(observe);
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, [key]);

  return (
    <>
      {/* Top progress bar — instant feedback on navigation */}
      <div
        aria-hidden
        className={`fixed left-0 top-0 z-[100] h-[3px] bg-primary transition-all ease-out ${
          isLoading
            ? "w-[85%] opacity-100 duration-700"
            : "w-full opacity-0 duration-200"
        }`}
        style={{ boxShadow: "0 0 10px var(--primary), 0 0 5px var(--primary)" }}
      />
      <div ref={containerRef} key={key} className="page-enter">
        {children}
      </div>
    </>
  );
}
