"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/global/brand-logo";
import { cn } from "@/lib/utils";
import {
  getSocialLinks,
  DEFAULT_SOCIAL_LINKS,
  type SocialLinksSettings,
} from "@/lib/data/social-links";
import {
  FacebookIcon,
  YouTubeIcon,
  TelegramIcon,
  WhatsAppIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterXIcon,
  TikTokIcon,
} from "@/components/global/social-icons";

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
  const [social, setSocial] = useState<SocialLinksSettings>(DEFAULT_SOCIAL_LINKS);

  useEffect(() => {
    getSocialLinks().then((res) => {
      if (res) setSocial(res);
    });
  }, []);

  if (pathname?.includes("/learn/")) {
    return null;
  }

  const socialItems = [
    {
      key: "facebook",
      data: social.facebook,
      icon: FacebookIcon,
      hoverColor: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
    },
    {
      key: "youtube",
      data: social.youtube,
      icon: YouTubeIcon,
      hoverColor: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
    },
    {
      key: "telegram",
      data: social.telegram,
      icon: TelegramIcon,
      hoverColor: "hover:bg-[#229ED9] hover:text-white hover:border-[#229ED9]",
    },
    {
      key: "whatsapp",
      data: social.whatsapp,
      icon: WhatsAppIcon,
      hoverColor: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
    },
    {
      key: "instagram",
      data: social.instagram,
      icon: InstagramIcon,
      hoverColor: "hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white hover:border-[#DD2A7B]",
    },
    {
      key: "linkedin",
      data: social.linkedin,
      icon: LinkedInIcon,
      hoverColor: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
    },
    {
      key: "twitter",
      data: social.twitter,
      icon: TwitterXIcon,
      hoverColor: "hover:bg-slate-900 hover:text-white hover:border-slate-800 dark:hover:bg-white dark:hover:text-black",
    },
    {
      key: "tiktok",
      data: social.tiktok,
      icon: TikTokIcon,
      hoverColor: "hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black",
    },
  ].filter((item) => item.data?.enabled && item.data?.url?.trim());

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
            <p className="text-text-muted text-xs leading-relaxed font-bengali mb-4">
              মানসম্মত ও কর্মমুখী শিক্ষার মাধ্যমে আপনার ভবিষ্যৎ সফলভাবে গড়ে তুলুন।
            </p>

            {/* Brand Social Media Icons */}
            {socialItems.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-text font-bengali block">
                  যুক্ত থাকুন সোশ্যাল মিডিয়ায়:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {socialItems.map(({ key, data, icon: Icon, hoverColor }) => (
                    <a
                      key={key}
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={data.label || key}
                      aria-label={data.label || key}
                      className={cn(
                        "w-8 h-8 rounded-xl bg-surface-secondary border border-border text-text-muted flex items-center justify-center transition-all duration-200 shadow-2xs active:scale-90",
                        hoverColor
                      )}
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            )}
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
        <div className="border-t border-border pt-6 pb-24 lg:pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Ormission. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center">
            <a
              href="https://t.me/cryptography55"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#229ED9]/10 dark:bg-[#229ED9]/15 text-[#229ED9] dark:text-[#38b7f5] hover:bg-[#229ED9] hover:text-white border border-[#229ED9]/30 hover:border-[#229ED9] shadow-xs hover:shadow-[0_4px_16px_rgba(34,158,217,0.35)] transition-all duration-200 group font-sans active:scale-95"
              title="Contact Developer on Telegram: @cryptography55"
            >
              <span className="w-5 h-5 rounded-full bg-[#229ED9] text-white flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-[#229ED9] transition-colors shadow-xs">
                <svg className="w-3 h-3 translate-x-[-0.5px] translate-y-[0.5px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
                </svg>
              </span>
              <span className="text-text-muted text-[11px] group-hover:text-white/90 transition-colors">
                Developer:
              </span>
              <span className="font-semibold text-xs tracking-tight">
                @cryptography55
              </span>
              <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
