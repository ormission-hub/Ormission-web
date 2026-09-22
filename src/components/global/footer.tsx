"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/global/brand-logo";
import { cn } from "@/lib/utils";

const footerLinks = {
  study: {
    title: "শিক্ষা",
    links: [
      { label: "সকল কোর্স", href: "/courses" },
      { label: "ক্যাটেগরি", href: "/categories" },
      { label: "ফ্রি রিসোর্স", href: "/free-resources" },
    ],
  },
  company: {
    title: "কোম্পানি",
    links: [
      { label: "আমাদের সম্পর্কে", href: "/about" },
      { label: "সাপোর্ট", href: "/dashboard/support" },
    ],
  },
  policies: {
    title: "পলিসি",
    links: [
      { label: "প্রাইভেসি পলিসি", href: "/privacy-policy" },
      { label: "শর্তাবলী", href: "/terms-and-conditions" },
      { label: "রিফান্ড পলিসি", href: "/refund-policy" },
    ],
  },
};

export function Footer() {
  const pathname = usePathname();
  if (pathname?.includes("/learn/")) {
    return null;
  }

  return (
    <footer className="bg-surface border-t border-border">
      <div className="container-main">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <BrandLogo size="md" showTagline={true} />
            </div>
            <p className="text-text-muted text-xs leading-relaxed font-bengali">
              মানসম্মত ও কর্মমুখী শিক্ষার মাধ্যমে আপনার ভবিষ্যৎ সফলভাবে গড়ে তুলুন।
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-sm text-text mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-text transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Ormission. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
            <span className="text-xs text-text-muted">
              পেমেন্ট মেথড: bKash · Nagad · Rocket · Card
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <a
              href="https://t.me/cryptography55"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-text-muted/60 hover:text-primary transition-colors font-sans"
            >
              Developed by @cryptography55
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
