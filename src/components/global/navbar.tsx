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
  Laptop,
  Check,
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

/* ──────────────── Premium Dual-Tone SVG Icons for Bottom Nav ──────────────── */
const HomeIcon = ({ className, active }: { className?: string; active?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
    {active ? (
      <path d="M12 2.1 2.5 9.7a1 1 0 0 0-.35.76V20a2 2 0 0 0 2 2h4.5a1 1 0 0 0 1-1v-4.5a1 1 0 0 1 1-1h2.7a1 1 0 0 1 1 1V21a1 1 0 0 0 1 1H19.8a2 2 0 0 0 2-2V10.46a1 1 0 0 0-.35-.76L12 2.1Z" />
    ) : (
      <path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-4.5a1 1 0 0 1-1-1v-4.5a1.5 1.5 0 0 0-1.5-1.5h-1A1.5 1.5 0 0 0 10 14.5V19a1 1 0 0 1-1 1H4.5A1.5 1.5 0 0 1 3 20v-9.5Z" />
    )}
  </svg>
);

const CoursesIcon = ({ className, active }: { className?: string; active?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
    {active ? (
      <>
        <path d="M12 4.5c-2.4-1.2-5.4-1.5-8-1A2 2 0 0 0 2 5.5v12a1.5 1.5 0 0 0 1.9 1.45c2.2-.5 4.8-.2 6.1.8.5.3 1.1.3 1.6 0 1.3-1 3.9-1.3 6.1-.8A1.5 1.5 0 0 0 19.6 17.5v-12a2 2 0 0 0-2-2c-2.6-.5-5.6-.2-8 1Z" />
        <path d="M12 5v13.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    )}
  </svg>
);

const CategoryIcon = ({ className, active }: { className?: string; active?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
    {active ? (
      <>
        <rect x="3" y="3" width="8" height="8" rx="2.5" />
        <rect x="13" y="3" width="8" height="8" rx="2.5" opacity="0.6" />
        <rect x="3" y="13" width="8" height="8" rx="2.5" opacity="0.6" />
        <rect x="13" y="13" width="8" height="8" rx="2.5" />
      </>
    ) : (
      <>
        <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
      </>
    )}
  </svg>
);

const ResourceIcon = ({ className, active }: { className?: string; active?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
    {active ? (
      <path d="m12 2.5 2.2 5.5 5.8 1.8-4.5 3.9 1.4 5.8-4.9-3.2-4.9 3.2 1.4-5.8-4.5-3.9 5.8-1.8L12 2.5Z" />
    ) : (
      <path d="m12 2.5 2.2 5.5 5.8 1.8-4.5 3.9 1.4 5.8-4.9-3.2-4.9 3.2 1.4-5.8-4.5-3.9 5.8-1.8L12 2.5Z" />
    )}
  </svg>
);

const InfoIcon = ({ className, active }: { className?: string; active?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
    {active ? (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="8" r="1.3" fill="white" stroke="none" />
        <path d="M12 11.5v5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="12" cy="12" r="9.5" />
        <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
        <path d="M12 11.5v5" strokeWidth="1.8" strokeLinecap="round" />
      </>
    )}
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
  const [avatarError, setAvatarError] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
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

  // Close user & theme dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
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

              {/* Theme Mode Selector (Auto / Light / Dark) */}
              <div className="relative" ref={themeMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-secondary transition-all border border-transparent hover:border-border cursor-pointer flex items-center gap-1.5"
                  title={`থিম: ${
                    theme === "system"
                      ? "অটো (ডিভাইস অনুযায়ী)"
                      : theme === "dark"
                      ? "ডার্ক মোড"
                      : "লাইট মোড"
                  }`}
                  aria-label="Theme mode"
                >
                  {theme === "system" ? (
                    <Laptop className="w-4.5 h-4.5 text-primary" />
                  ) : resolvedTheme === "dark" ? (
                    <Moon className="w-4.5 h-4.5 text-sky-400" />
                  ) : (
                    <Sun className="w-4.5 h-4.5 text-amber-500" />
                  )}
                  {theme === "system" && (
                    <span className="hidden xl:inline text-[10px] font-bold font-bengali text-text-muted/80 bg-surface-secondary px-1.5 py-0.2 rounded-md border border-border/60">
                      অটো
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isThemeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-surface/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border shadow-xl p-1.5 z-50 font-bengali space-y-0.5"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setTheme("system");
                          setIsThemeMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left",
                          theme === "system"
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-text hover:bg-surface-secondary font-medium"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Laptop className="w-4 h-4 text-primary" />
                          <span>অটো (ডিভাইস অনুযায়ী)</span>
                        </div>
                        {theme === "system" && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTheme("light");
                          setIsThemeMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left",
                          theme === "light"
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-text hover:bg-surface-secondary font-medium"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4 text-amber-500" />
                          <span>লাইট মোড</span>
                        </div>
                        {theme === "light" && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTheme("dark");
                          setIsThemeMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left",
                          theme === "dark"
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-text hover:bg-surface-secondary font-medium"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4 text-sky-400" />
                          <span>ডার্ক মোড</span>
                        </div>
                        {theme === "dark" && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
                    {userAvatarUrl && !avatarError ? (
                      <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-primary/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={userAvatarUrl}
                          alt={displayName}
                          className="w-full h-full object-cover"
                          onError={() => setAvatarError(true)}
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
                            {userAvatarUrl && !avatarError ? (
                              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-primary/20">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={userAvatarUrl}
                                  alt={displayName}
                                  className="w-full h-full object-cover"
                                  onError={() => setAvatarError(true)}
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

                        {/* Theme Switcher inside User Menu */}
                        <div className="px-3 py-2 border-t border-border/70 mt-1">
                          <div className="text-[10.5px] font-bold text-text-muted mb-1.5 font-bengali flex items-center justify-between">
                            <span>থিম মোড</span>
                            <span className="text-[10px] text-primary font-bold">
                              {theme === "system" ? "অটো" : theme === "dark" ? "ডার্ক" : "লাইট"}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 bg-surface-secondary p-1 rounded-xl border border-border/60">
                            <button
                              type="button"
                              onClick={() => setTheme("system")}
                              className={cn(
                                "flex items-center justify-center gap-1 py-1 rounded-lg text-[10.5px] font-bold font-bengali transition-all cursor-pointer",
                                theme === "system"
                                  ? "bg-surface text-primary shadow-xs"
                                  : "text-text-muted hover:text-text"
                              )}
                              title="ডিভাইসের থিম অনুযায়ী"
                            >
                              <Laptop className="w-3 h-3" />
                              <span>অটো</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setTheme("light")}
                              className={cn(
                                "flex items-center justify-center gap-1 py-1 rounded-lg text-[10.5px] font-bold font-bengali transition-all cursor-pointer",
                                theme === "light"
                                  ? "bg-surface text-amber-500 shadow-xs"
                                  : "text-text-muted hover:text-text"
                              )}
                              title="লাইট মোড"
                            >
                              <Sun className="w-3 h-3" />
                              <span>লাইট</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setTheme("dark")}
                              className={cn(
                                "flex items-center justify-center gap-1 py-1 rounded-lg text-[10.5px] font-bold font-bengali transition-all cursor-pointer",
                                theme === "dark"
                                  ? "bg-surface text-sky-400 shadow-xs"
                                  : "text-text-muted hover:text-text"
                              )}
                              title="ডার্ক মোড"
                            >
                              <Moon className="w-3 h-3" />
                              <span>ডার্ক</span>
                            </button>
                          </div>
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

      {/* ═══════════════════ Mobile Floating Liquid Glass Navigation Dock ═══════════════════ */}
      {!pathname?.startsWith("/course/") && !pathname?.startsWith("/checkout") && (
        <nav
          className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.25rem)] max-w-[380px] z-[60] lg:hidden select-none pb-[env(safe-area-inset-bottom,0px)]"
          aria-label="Mobile navigation"
        >
        {/* Floating Liquid Glass Capsule */}
        <div className="relative rounded-full p-1 bg-surface/90 dark:bg-slate-950/90 backdrop-blur-2xl backdrop-saturate-200 border border-white/40 dark:border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.2),inset_0_1.5px_1px_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_45px_rgba(0,0,0,0.65),inset_0_1.5px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(0,0,0,0.3)] ring-1 ring-black/5 dark:ring-white/5 overflow-hidden">
          
          {/* Liquid Glass Top Gloss Specular Highlight */}
          <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/40 to-transparent rounded-full pointer-events-none" />

          {/* Liquid Inner Ambient Subtle Light */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 dark:from-white/5 to-transparent pointer-events-none" />

          <div className="relative grid grid-cols-5 items-center w-full">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : item.href === "/courses"
                  ? pathname === "/courses" || pathname?.startsWith("/course/")
                  : item.href === "/categories"
                  ? pathname === "/categories" || pathname?.startsWith("/category/")
                  : item.href === "/free-resources"
                  ? pathname === "/free-resources" || pathname?.startsWith("/resources/")
                  : pathname === item.href || pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }
                  }}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 rounded-full transition-all duration-200 group text-center select-none w-full",
                    isActive
                      ? "text-primary font-bold bg-primary/15 dark:bg-primary/20 border border-primary/35 shadow-[0_2px_8px_rgba(255,95,0,0.25)]"
                      : "text-text-muted hover:text-text border border-transparent active:scale-90"
                  )}
                >
                  <Icon
                    active={isActive}
                    className={cn(
                      "w-[18px] h-[18px] shrink-0 transition-transform duration-200",
                      isActive
                        ? "scale-105 drop-shadow-[0_2px_6px_rgba(255,95,0,0.35)] text-primary"
                        : "opacity-70 group-hover:opacity-100 group-hover:scale-105"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-bengali leading-none tracking-tight transition-colors duration-200 truncate max-w-full block",
                      isActive ? "font-bold text-primary" : "font-medium opacity-80"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      )}
    </>
  );
}
