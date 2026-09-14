"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, Sun, Moon, Sparkles, LogIn, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/global/brand-logo";
import { useTheme } from "@/components/global/theme-provider";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "কোর্স সমূহ", href: "/courses" },
  { label: "ক্যাটেগরি", href: "/categories" },
  { label: "ফ্রি রিসোর্স", href: "/free-resources" },
  { label: "ব্লগ", href: "/blog" },
  { label: "আমাদের সম্পর্কে", href: "/about" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-xs font-semibold rounded-lg transition-colors font-bengali",
                  "text-text-muted hover:text-text hover:bg-surface-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                "p-2 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-secondary"
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

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors text-text-muted hover:text-text hover:bg-surface-secondary"
              )}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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

        {/* Search bar — slides down */}
        {isSearchOpen && (
          <div className="pb-3 pt-1">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="search"
                placeholder="কোর্স খুঁজুন (উদাঃ ওয়েব ডেভেলপমেন্ট, এইচএসসি ফিজিক্স)..."
                autoFocus
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 text-sm rounded-xl",
                  "bg-surface-secondary border border-border",
                  "text-text placeholder:text-text-muted",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  "transition-all"
                )}
              />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/40 backdrop-blur-xs lg:hidden z-40"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-x-0 top-16 bottom-0 bg-surface border-t border-border lg:hidden overflow-y-auto z-50 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-semibold text-text-muted font-bengali">থিম পরিবর্তন করুন</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-secondary text-xs font-medium text-text border border-border"
              >
                {resolvedTheme === "dark" ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-accent" />
                    <span>লাইট মোড</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-primary" />
                    <span>ডার্ক মোড</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors font-bengali",
                    "text-text hover:bg-surface-secondary"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 space-y-2 border-t border-border">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl transition-all font-bengali",
                  "text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs"
                )}
              >
                <span>লগইন</span>
              </Link>

              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl transition-all font-bengali shadow-sm",
                  "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                )}
              >
                <span>রেজিস্ট্রেশন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
