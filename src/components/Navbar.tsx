import { Link } from "@tanstack/react-router";
import { Menu, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { to: "/", label: "হোম" },
  { to: "/about", label: "আমাদের সম্পর্কে" },
  { to: "/directory", label: "ডিরেক্টরি" },
  { to: "/register", label: "ডোনার হন" },
  { to: "/emergency", label: "জরুরি" },
  { to: "/dashboard", label: "ড্যাশবোর্ড" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-7 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md sm:top-8">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
            <img src={logo} alt="RoktoFinder লোগো" className="h-12 w-12 object-contain" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold text-foreground">RoktoFinder</div>
            <div className="text-[10px] font-medium text-muted-foreground">ময়মনসিংহ</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "text-primary bg-accent" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button asChild variant="destructive" size="sm">
            <Link to="/emergency">
              <AlertCircle className="h-4 w-4" />
              জরুরি রক্ত
            </Link>
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="মেনু খুলুন"
              className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border/60 bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-sm transition-all duration-200 hover:scale-105 hover:border-primary/40 hover:bg-gradient-to-br hover:from-primary/20 hover:to-primary/10 hover:shadow-[var(--shadow-elegant)] active:scale-95"
            >
              <Menu className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] max-w-sm border-l border-border/60 bg-background p-0"
            >
              {/* Header with logo */}
              <SheetHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-5 text-left">
                <SheetTitle asChild>
                  <Link
                    to="/"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden">
                      <img src={logo} alt="RoktoFinder লোগো" className="h-14 w-14 object-contain" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-lg font-bold text-foreground">
                        RoktoFinder
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">
                        ময়মনসিংহ • রক্তদান প্ল্যাটফর্ম
                      </div>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              {/* Nav links */}
              <nav className="flex flex-col gap-1 p-4">
                {links.map((l, idx) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-foreground transition-all duration-200 hover:bg-accent hover:pl-5"
                    activeProps={{
                      className:
                        "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20",
                    }}
                    activeOptions={{ exact: l.to === "/" }}
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <span>{l.label}</span>
                    <span className="text-xs text-muted-foreground transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Emergency CTA */}
              <div className="mt-auto border-t border-border/60 p-4">
                <Button
                  asChild
                  variant="destructive"
                  size="lg"
                  className="w-full shadow-[var(--shadow-elegant)]"
                  onClick={() => setOpen(false)}
                >
                  <Link to="/emergency">
                    <AlertCircle className="h-5 w-5" />
                    জরুরি রক্ত প্রয়োজন
                  </Link>
                </Button>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  ❤️ একটি রক্তদান, একটি জীবন রক্ষা
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
