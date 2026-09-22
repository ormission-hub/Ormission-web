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
          <div className="flex items-center">
            <a
              href="https://t.me/cryptography55"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-text-muted/70 hover:text-[#229ED9] hover:bg-[#229ED9]/8 border border-transparent hover:border-[#229ED9]/20 transition-all duration-200 font-sans"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span>Developed by @cryptography55</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
