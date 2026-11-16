import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  User,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Award,
  LogOut,
  ShieldCheck,
  Search,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useDonorSession } from "@/lib/auth-session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function AccountMenu() {
  const { donor, isLoggedIn, logout } = useDonorSession();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("সফলভাবে লগআউট হয়েছে");
    setOpen(false);
    navigate({ to: "/" });
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="অ্যাকাউন্ট মেনু"
            className={`group relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer ${
              isLoggedIn
                ? "border-primary/50 bg-primary/10 text-primary shadow-xs hover:border-primary hover:bg-primary/20"
                : "border-border/60 bg-muted/30 text-foreground hover:border-primary/40 hover:bg-accent hover:text-primary"
            }`}
          >
            {isLoggedIn && donor ? (
              <div className="flex items-center justify-center font-bold text-xs">
                <span>{donor.blood_group}</span>
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
              </div>
            ) : (
              <User className="h-4 w-4 transition-transform group-hover:scale-110" />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-64 rounded-2xl border-border/80 bg-popover/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95"
        >
          {isLoggedIn && donor ? (
            <>
              {/* Logged in donor header */}
              <DropdownMenuLabel className="p-3">
                <div className="flex items-center justify-between">
                  <div className="truncate font-bold text-sm text-foreground">{donor.name}</div>
                  <Badge variant="destructive" className="text-[11px] font-black">
                    {donor.blood_group}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="truncate">📍 {donor.area || "ময়মনসিংহ"}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium dark:text-emerald-400">
                    ডোনার আইডি
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="my-1 border-border/60" />

              <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2 px-3">
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 text-xs font-semibold"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <span>ডোনার ড্যাশবোর্ড</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2 px-3">
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 text-xs font-semibold"
                >
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>ডিজিটাল ডোনার কার্ড</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2 px-3">
                <Link
                  to="/directory"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 text-xs font-semibold"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span>ডোনার খুঁজুন</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 border-border/60" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-xl py-2 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span>লগআউট করুন</span>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              {/* Not logged in */}
              <DropdownMenuLabel className="p-3">
                <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>RoktoFinder অ্যাকাউন্ট</span>
                </div>
                <p className="mt-1 text-[11px] font-normal text-muted-foreground leading-tight">
                  রক্তদাতা হিসেবে যুক্ত হতে বা ড্যাশবোর্ড অ্যাক্সেস করতে লগইন করুন।
                </p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="my-1 border-border/60" />

              <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2.5 px-3">
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 text-xs font-semibold"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <LogIn className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">লগইন করুন</div>
                    <div className="text-[10px] text-muted-foreground">
                      ডোনার ড্যাশবোর্ডে প্রবেশ
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2.5 px-3">
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 text-xs font-semibold"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
                    <UserPlus className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">ডোনার হিসেবে যুক্ত হন</div>
                    <div className="text-[10px] text-muted-foreground">বিনামূল্যে রেজিস্ট্রেশন</div>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 border-border/60" />

              <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2 px-3">
                <Link
                  to="/admin/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>অ্যাডমিন পোর্টাল</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
