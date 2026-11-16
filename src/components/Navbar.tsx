import { Link, useLocation } from "@tanstack/react-router";
import {
  Menu,
  AlertCircle,
  ChevronDown,
  Building2,
  Ambulance,
  HeartHandshake,
  Compass,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccountMenu } from "@/components/AccountMenu";
import logo from "@/assets/logo.png";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const primaryLinks = [
  { to: "/", label: "হোম" },
  { to: "/directory", label: "ডিরেক্টরি" },
  { to: "/radar", label: "লাইভ ম্যাপ" },
] as const;

const serviceLinks = [
  {
    to: "/hospitals",
    label: "হাসপাতাল ও ব্লাড ব্যাংক",
    desc: "ময়মনসিংহের প্রধান প্রধান স্বাস্থ্যকেন্দ্র ও রক্তের ব্যাংক",
    icon: Building2,
    badge: "১০+ প্রতিষ্ঠান",
  },
  {
    to: "/ambulance",
    label: "জরুরি অ্যাম্বুলেন্স",
    desc: "২৪/৭ স্ট্যান্ডবাই আইসিইউ, এসি ও ফ্রিজার অ্যাম্বুলেন্স",
    icon: Ambulance,
    badge: "২৪/৭",
  },
  {
    to: "/compatibility",
    label: "রক্তের সামঞ্জস্যতা",
    desc: "কোন গ্রুপের রোগী কার রক্ত নিতে পারবেন",
    icon: HeartHandshake,
    badge: "ক্যালকুলেটর",
  },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  const isServiceActive = serviceLinks.some((s) => location.pathname === s.to);

  return (
    <header className="sticky top-7 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md sm:top-8">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden">
            <img src={logo} alt="RoktoFinder লোগো" className="h-11 w-11 object-contain" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold text-foreground">RoktoFinder</div>
            <div className="text-[10px] font-medium text-muted-foreground">ময়মনসিংহ</div>
          </div>
        </Link>

        {/* Clean, De-cluttered Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:gap-1.5 md:flex">
          {primaryLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:px-3 lg:text-sm"
              activeProps={{ className: "text-primary bg-accent font-semibold" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}

          {/* Grouped Services Dropdown */}
          <div
            className="relative inline-block"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <DropdownMenu open={servicesOpen} onOpenChange={setServicesOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground lg:px-3 lg:text-sm cursor-pointer ${
                    isServiceActive
                      ? "text-primary bg-accent font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  <Compass className="h-3.5 w-3.5 text-primary" />
                  <span>জরুরি সেবাসমূহ</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      servicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-72 rounded-2xl border-border/80 bg-popover/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95"
              >
                {serviceLinks.map((s) => (
                  <DropdownMenuItem key={s.to} asChild className="cursor-pointer rounded-xl p-2.5">
                    <Link
                      to={s.to}
                      onClick={() => setServicesOpen(false)}
                      className="flex items-start gap-3 text-left transition-colors hover:bg-accent/50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-foreground">{s.label}</span>
                          <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold text-primary">
                            {s.badge}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                          {s.desc}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link
            to="/about"
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:px-3 lg:text-sm"
            activeProps={{ className: "text-primary bg-accent font-semibold" }}
          >
            আমাদের সম্পর্কে
          </Link>
        </nav>

        {/* Desktop Action Buttons: Account Icon + Theme + Emergency */}
        <div className="hidden items-center gap-2 md:flex">
          <AccountMenu />
          <ThemeToggle />
          <Button asChild variant="destructive" size="sm" className="shadow-xs font-semibold">
            <Link to="/emergency">
              <AlertCircle className="h-4 w-4" />
              জরুরি রক্ত
            </Link>
          </Button>
        </div>

        {/* Mobile Header Actions: Account Icon is OUTSIDE drawer (with ThemeToggle) */}
        <div className="flex items-center gap-1.5 md:hidden">
          <AccountMenu />
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="মেনু খুলুন"
              className="group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-foreground shadow-xs transition-all duration-200 hover:border-primary/40 hover:bg-accent active:scale-95"
            >
              <Menu className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] max-w-sm border-l border-border/60 bg-background p-0 flex flex-col"
            >
              {/* Header with logo */}
              <SheetHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-5 text-left">
                <SheetTitle asChild>
                  <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
                      <img src={logo} alt="RoktoFinder লোগো" className="h-12 w-12 object-contain" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-lg font-bold text-foreground">RoktoFinder</div>
                      <div className="text-xs font-medium text-muted-foreground">
                        ময়মনসিংহ • রক্তদান প্ল্যাটফর্ম
                      </div>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Nav links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {[
                  { to: "/", label: "হোম" },
                  { to: "/directory", label: "ডোনার ডিরেক্টরি" },
                  { to: "/radar", label: "লাইভ ম্যাপ ও রেডার" },
                  { to: "/hospitals", label: "হাসপাতাল ও ব্লাড ব্যাংক" },
                  { to: "/ambulance", label: "জরুরি অ্যাম্বুলেন্স" },
                  { to: "/compatibility", label: "রক্তের সামঞ্জস্যতা গাইড" },
                  { to: "/about", label: "আমাদের সম্পর্কে" },
                ].map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent hover:pl-5"
                    activeProps={{
                      className:
                        "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20 font-semibold",
                    }}
                    activeOptions={{ exact: l.to === "/" }}
                  >
                    <span>{l.label}</span>
                    <span className="text-xs text-muted-foreground transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Emergency CTA at bottom of mobile drawer */}
              <div className="border-t border-border/60 p-4 bg-muted/20">
                <Button
                  asChild
                  variant="destructive"
                  size="lg"
                  className="w-full shadow-[var(--shadow-elegant)] font-semibold"
                  onClick={() => setOpen(false)}
                >
                  <Link to="/emergency">
                    <AlertCircle className="h-5 w-5" />
                    জরুরি রক্ত প্রয়োজন
                  </Link>
                </Button>
                <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
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
