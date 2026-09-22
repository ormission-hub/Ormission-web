"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sun,
  Moon,
  Sparkles,
  LogIn,
  ArrowRight,
  ChevronDown,
  BookOpen,
  Layers,
  Users,
  LayoutDashboard,
  Receipt,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { BrandLogo } from "@/components/global/brand-logo";
import { useTheme } from "@/components/global/theme-provider";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "কোর্স সমূহ", href: "/courses", icon: BookOpen },
  { label: "ক্যাটেগরি", href: "/categories", icon: Layers },
  { label: "ফ্রি রিসোর্স", href: "/free-resources", icon: Sparkles, badge: "ফ্রি" },
  { label: "আমাদের সম্পর্কে", href: "/about", icon: Users },
];

/* ──────────────── Premium SVG Icons for Bottom Nav ──────────────── */
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.182V22h7v-7h4v7h7V10.182L12 2 3 10.182Z" />
  </svg>
);

const CoursesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const CategoryIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const ResourceIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const bottomNavItems = [
  { label: "হোম", href: "/", icon: HomeIcon },
  { label: "কোর্স", href: "/courses", icon: CoursesIcon },
  { label: "ক্যাটেগরি", href: "/categories", icon: CategoryIcon },
  { label: "রিসোর্স", href: "/free-resources", icon: ResourceIcon },
  { label: "সম্পর্কে", href: "/about", icon: InfoIcon },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // Supabase Auth listener
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setIsUserMenuOpen(false);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userMeta = user?.user_metadata || {};
  const userAvatarUrl = userMeta.avatar_url || null;
  const displayName =
    userMeta.full_name ||
    userMeta.name ||
    user?.email?.split("@")[0] ||
    "শিক্ষার্থী";
  const userInitial = (
    displayName?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const isLearnPage = pathname?.includes("/learn/");
  if (isLearnPage) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
          isScrolled
            ? "bg-surface/95 backdrop-blur-md border-b border-border shadow-xs"
            : "bg-background/80 backdrop-blur-xs border-b border-border/50"
        )}
      >
        <nav className="container-main" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16">
            {/* Official Brand Logo */}
            <BrandLogo size="md" showTagline={false} />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 text-xs font-semibold rounded-lg transition-colors font-bengali",
                      isActive
                        ? "text-primary bg-primary/10 font-bold"
                        : "text-text-muted hover:text-text hover:bg-surface-secondary"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Search toggle */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  "p-2 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-secondary",
                  isSearchOpen && "text-primary bg-primary/10"
                )}
                aria-label="Search courses"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Dark/Light Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-secondary transition-colors border border-transparent hover:border-border"
                title={resolvedTheme === "dark" ? "লাইট মোডে স্যুইচ করুন" : "ডার্ক মোডে স্যুইচ করুন"}
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-4.5 h-4.5 text-accent animate-spin-once" />
                ) : (
                  <Moon className="w-4.5 h-4.5 text-primary" />
                )}
              </button>

              {/* Auth Buttons: Logged In User Pill vs Login/Register */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  {/* Profile button — visible on ALL screens (replaces hamburger on mobile) */}
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={cn(
                      "flex items-center gap-2 py-1 rounded-full border transition-all duration-200 font-bengali text-xs font-semibold shadow-xs",
                      /* On mobile: avatar only. On desktop: avatar + name */
                      "pl-1 pr-1 sm:pl-1.5 sm:pr-3",
                      isUserMenuOpen
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "bg-surface-secondary/70 hover:bg-surface-secondary border-border hover:border-primary/40 text-text"
                    )}
                    aria-expanded={isUserMenuOpen}
                  >
                    {userAvatarUrl ? (
                      <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-primary/20">
                        <Image
                          src={userAvatarUrl}
                          alt={displayName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0">
                        {userInitial}
                      </div>
                    )}
                    <span className="hidden sm:inline max-w-[120px] truncate text-xs font-bold text-text">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={cn(
                        "hidden sm:block w-3.5 h-3.5 text-text-muted transition-transform duration-200",
                        isUserMenuOpen && "rotate-180 text-primary"
                      )}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface/98 backdrop-blur-md border border-border shadow-xl py-2 z-50 overflow-hidden font-bengali"
                      >
                        {/* Profile Header */}
                        <div className="px-4 py-3 bg-surface-secondary/50 border-b border-border/70">
                          <div className="flex items-center gap-3">
                            {userAvatarUrl ? (
                              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-primary/20">
                                <Image
                                  src={userAvatarUrl}
                                  alt={displayName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-sm uppercase shadow-xs shrink-0">
                                {userInitial}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-text truncate">{displayName}</p>
                              <p className="text-[11px] text-text-muted truncate font-sans">{user.email}</p>
                            </div>
                          </div>
                          <div className="mt-2.5 flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              ভেরিফাইড শিক্ষার্থী
                            </span>
                          </div>
                        </div>

                        {/* Links */}
                        <div className="p-1.5 space-y-0.5">
                          <Link
                            href="/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-text hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                            <span>আমার ড্যাশবোর্ড</span>
                          </Link>

                          <Link
                            href="/dashboard/my-courses"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-text hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span>আমার কোর্সসমূহ</span>
                          </Link>

                          <Link
                            href="/dashboard/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-text hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Receipt className="w-4 h-4 text-primary" />
                            <span>পেমেন্ট ও অর্ডার হিস্ট্রি</span>
                          </Link>

                          <Link
                            href="/dashboard/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-text hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-primary" />
                            <span>প্রোফাইল সেটিংস</span>
                          </Link>
                        </div>

                        <div className="p-1.5 pt-1 border-t border-border/80 mt-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>{isLoggingOut ? "লগআউট হচ্ছে..." : "লগআউট"}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  {/* Login - desktop clean link */}
                  <Link
                    href="/login"
                    className={cn(
                      "hidden sm:inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 font-bengali",
                      "text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80"
                    )}
                  >
                    লগইন
                  </Link>

                  {/* Register CTA - desktop high-contrast button */}
                  <Link
                    href="/register"
                    className={cn(
                      "hidden sm:inline-flex items-center px-4 py-1.5 text-xs font-bold rounded-xl shadow-xs transition-all duration-200 font-bengali hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
                      "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                    )}
                  >
                    রেজিস্ট্রেশন
                  </Link>

                  {/* Mobile: Login icon when not logged in */}
                  <Link
                    href="/login"
                    className="sm:hidden p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-secondary transition-colors border border-transparent"
                    aria-label="লগইন"
                  >
                    <LogIn className="w-5 h-5" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop Search bar — slides down */}
          {isSearchOpen && (
            <div className="pb-3 pt-1">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="কোর্স খুঁজুন (উদাঃ ওয়েব ডেভেলপমেন্ট, এইচএসসি ফিজিক্স)..."
                  autoFocus
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 text-sm rounded-xl",
                    "bg-surface-secondary border border-border",
                    "text-text placeholder:text-text-muted",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                    "transition-all font-bengali"
                  )}
                />
              </form>
            </div>
          )}
        </nav>
      </header>

      {/* ═══════════════════ Mobile Bottom Navigation ═══════════════════ */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-surface/95 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
        aria-label="Mobile navigation"
      >
        {/* Safe area padding for devices with home indicators */}
        <div className="flex items-center justify-around px-1 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[56px] transition-all duration-200 relative",
                  isActive
                    ? "text-primary"
                    : "text-text-muted active:text-text"
                )}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-1.5 w-5 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-[22px] h-[22px] transition-all duration-200",
                    isActive && "scale-110"
                  )}
                />
                <span
                  className={cn(
                    "text-[9px] font-bengali leading-tight transition-all duration-200",
                    isActive ? "font-bold" : "font-medium"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom nav spacer — prevents content from being hidden behind bottom nav on mobile */}
      <div className="lg:hidden h-16" />
    </>
  );
}
