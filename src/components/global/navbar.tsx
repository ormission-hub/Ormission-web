"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Sparkles,
  LogIn,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Layers,
  FileText,
  Users,
  PhoneCall,
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

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      setIsMobileMenuOpen(false);
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

  // Automatically close mobile menu & user dropdown on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
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
      setIsMobileMenuOpen(false);
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
          isMobileMenuOpen
            ? "bg-surface border-b border-border shadow-xs"
            : isScrolled
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
                <div className="relative hidden sm:block" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={cn(
                      "flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border transition-all duration-200 font-bengali text-xs font-semibold shadow-xs",
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
                    <span className="max-w-[120px] truncate text-xs font-bold text-text">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-text-muted transition-transform duration-200",
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
                </>
              )}

              {/* Mobile menu toggle (3-dot / hamburger toggle) */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "lg:hidden p-2 rounded-xl transition-all border",
                  isMobileMenuOpen
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "text-text-muted hover:text-text hover:bg-surface-secondary border-transparent"
                )}
                aria-label={isMobileMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
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

      {/* Mobile drawer — RENDERED OUTSIDE HEADER to escape backdrop-filter containing block trap */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              key="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Drawer Panel */}
            <motion.div
              key="mobile-nav-drawer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="fixed inset-x-0 top-16 bottom-0 z-45 bg-surface dark:bg-slate-900 border-t border-border lg:hidden overflow-y-auto flex flex-col justify-between shadow-2xl"
            >
              <div className="p-4 sm:p-5 space-y-5">
                {/* Search in mobile menu */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="কোর্স বা বিষয় খুঁজুন..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-surface-secondary dark:bg-slate-800/80 border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bengali"
                  />
                </form>

                {/* Navigation links */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider px-2 pb-1 font-bengali">
                    মেনু নেভিগেশন
                  </div>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all font-bengali",
                          isActive
                            ? "bg-primary/10 text-primary font-bold dark:bg-primary/20"
                            : "text-text hover:bg-surface-secondary dark:hover:bg-slate-800/60"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                              isActive
                                ? "bg-primary text-white"
                                : "bg-surface-secondary dark:bg-slate-800 text-text-muted"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span>{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-accent/20 text-accent dark:bg-accent/30">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-text-muted/60" />
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Popular categories shortcuts */}
                <div className="pt-3 border-t border-border/60">
                  <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider px-2 pb-2 font-bengali">
                    জনপ্রিয় ক্যাটেগরি
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/courses?category=hsc"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-xl bg-surface-secondary/70 dark:bg-slate-800/50 hover:bg-surface-secondary text-xs font-semibold text-text font-bengali text-center border border-border/40 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>🎓</span>
                      <span>এইচএসসি (HSC)</span>
                    </Link>
                    <Link
                      href="/courses?category=school"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-xl bg-surface-secondary/70 dark:bg-slate-800/50 hover:bg-surface-secondary text-xs font-semibold text-text font-bengali text-center border border-border/40 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>🏫</span>
                      <span>এসএসসি (SSC)</span>
                    </Link>
                    <Link
                      href="/courses?category=admission"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-xl bg-surface-secondary/70 dark:bg-slate-800/50 hover:bg-surface-secondary text-xs font-semibold text-text font-bengali text-center border border-border/40 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>🏛️</span>
                      <span>ভর্তি পরীক্ষা</span>
                    </Link>
                    <Link
                      href="/free-resources"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-xl bg-surface-secondary/70 dark:bg-slate-800/50 hover:bg-surface-secondary text-xs font-semibold text-text font-bengali text-center border border-border/40 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>🎁</span>
                      <span>ফ্রি রিসোর্স</span>
                    </Link>
                  </div>
                </div>

                {/* Theme Selection Toggle */}
                <div className="p-3.5 rounded-2xl bg-surface-secondary/60 dark:bg-slate-800/40 border border-border/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text font-bengali">ওয়েবসাইট থিম</span>
                    <span className="text-[11px] text-text-muted font-bengali">
                      {resolvedTheme === "dark" ? "ডার্ক মোড সক্রিয় আছে" : "লাইট মোড সক্রিয় আছে"}
                    </span>
                  </div>
                  <div className="flex items-center p-1 bg-surface dark:bg-slate-900 rounded-xl border border-border shadow-2xs">
                    <button
                      type="button"
                      onClick={() => resolvedTheme !== "light" && toggleTheme()}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all font-bengali",
                        resolvedTheme === "light"
                          ? "bg-amber-100 text-amber-900 shadow-xs font-bold"
                          : "text-text-muted hover:text-text"
                      )}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>লাইট</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => resolvedTheme !== "dark" && toggleTheme()}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all font-bengali",
                        resolvedTheme === "dark"
                          ? "bg-slate-800 text-cyan-300 shadow-xs font-bold"
                          : "text-text-muted hover:text-text"
                      )}
                    >
                      <Moon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ডার্ক</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom CTAs & Support */}
              <div className="p-4 sm:p-5 bg-surface/80 dark:bg-slate-950/60 border-t border-border space-y-3 mt-auto">
                {user ? (
                  <div className="space-y-3">
                    {/* Student Profile Card */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-secondary/70 border border-border">
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
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-sm uppercase shrink-0 shadow-xs">
                          {userInitial}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-text truncate font-bengali">{displayName}</p>
                        <p className="text-[11px] text-text-muted truncate font-sans">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary/90 transition-all font-bengali shadow-xs"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>ড্যাশবোর্ড</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-xl text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all font-bengali"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{isLoggingOut ? "লগআউট..." : "লগআউট"}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl transition-all font-bengali",
                        "text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs active:scale-[0.98]"
                      )}
                    >
                      <LogIn className="w-4 h-4" />
                      <span>লগইন</span>
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl transition-all font-bengali shadow-sm",
                        "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 active:scale-[0.98]"
                      )}
                    >
                      <span>রেজিস্ট্রেশন</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-text-muted font-bengali">
                  <PhoneCall className="w-3.5 h-3.5 text-primary" />
                  <span>যেকোনো সমস্যায় হেল্পলাইন: <strong className="text-text">০১৭০০-০০০০০০</strong></span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
