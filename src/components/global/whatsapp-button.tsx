"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/global/social-icons";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_SOCIAL_LINKS } from "@/lib/data/social-links";

const DEFAULT_MESSAGE = "আসসালামু আলাইকুম! Ormission প্ল্যাটফর্ম ও কোর্স সম্পর্কে বিস্তারিত জানতে চাচ্ছি।";

function formatWhatsAppUrl(rawUrlOrNumber: string): string {
  if (!rawUrlOrNumber) return "https://wa.me/8801728477095";
  const trimmed = rawUrlOrNumber.trim();
  if (trimmed.startsWith("http")) return trimmed;

  let digits = trimmed.replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) {
    digits = "880" + digits.slice(1);
  } else if (digits.length === 10 && digits.startsWith("1")) {
    digits = "880" + digits;
  }
  return digits ? `https://wa.me/${digits}` : "https://wa.me/8801728477095";
}

export function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string>("https://wa.me/8801728477095");
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
    let isSubscribed = true;

    async function loadConfig() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["social_links", "contact_whatsapp"]);

        if (error || !isSubscribed || !data) return;

        let activeUrl = "";
        let enabled = true;

        // 1. Check social_links
        const socialRow = data.find((d) => d.key === "social_links");
        if (socialRow?.value) {
          const val = typeof socialRow.value === "string" ? JSON.parse(socialRow.value) : socialRow.value;
          if (val?.whatsapp) {
            if (val.whatsapp.url) activeUrl = val.whatsapp.url;
            if (val.whatsapp.enabled !== undefined) enabled = val.whatsapp.enabled;
          }
        }

        // 2. Check contact_whatsapp (from Settings tab)
        const contactRow = data.find((d) => d.key === "contact_whatsapp");
        if (contactRow?.value) {
          const raw = typeof contactRow.value === "string" ? contactRow.value.trim() : "";
          if (raw) {
            activeUrl = formatWhatsAppUrl(raw);
          }
        }

        if (activeUrl) {
          setWhatsappUrl(formatWhatsAppUrl(activeUrl));
        }
        setIsEnabled(enabled);
      } catch (err) {
        console.warn("Could not load WhatsApp settings:", err);
      }
    }

    loadConfig();

    // Check if dismissed previously in session
    const dismissed = sessionStorage.getItem("ormission_wa_dismissed");
    if (dismissed) {
      setTooltipDismissed(true);
    } else {
      // Auto pop tooltip gently after 3.5 seconds
      const timer = setTimeout(() => {
        if (isSubscribed) setShowTooltip(true);
      }, 3500);
      return () => {
        isSubscribed = false;
        clearTimeout(timer);
      };
    }

    return () => {
      isSubscribed = false;
    };
  }, []);

  if (!mounted || !isEnabled) {
    return null;
  }

  // Construct target WhatsApp URL with pre-filled message
  let targetUrl = whatsappUrl || "https://wa.me/8801728477095";
  if (!targetUrl.includes("text=")) {
    const separator = targetUrl.includes("?") ? "&" : "?";
    targetUrl = `${targetUrl}${separator}text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
  }

  const handleDismissTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(false);
    setTooltipDismissed(true);
    try {
      sessionStorage.setItem("ormission_wa_dismissed", "true");
    } catch {}
  };

  return (
    <div
      className="fixed bottom-[4.75rem] right-3 sm:bottom-24 sm:right-5 lg:bottom-6 lg:right-6 z-[55] flex items-end gap-2.5 select-none pointer-events-none"
      aria-label="WhatsApp চ্যাট উইজেট"
    >
      {/* Floating Chat Bubble / Tooltip */}
      <AnimatePresence>
        {showTooltip && !tooltipDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto relative max-w-[230px] sm:max-w-[260px] bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/25 rounded-2xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            {/* Close Button */}
            <button
              onClick={handleDismissTooltip}
              aria-label="বার্তা বন্ধ করুন"
              className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-colors shadow-xs"
            >
              <X className="w-2.5 h-2.5" />
            </button>

            {/* Bubble Header */}
            <div className="flex items-center gap-1.5 mb-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 font-bengali">
                Ormission সাপোর্ট টিম
              </span>
              <span className="ml-auto text-[9px] text-emerald-600 dark:text-emerald-400 font-medium font-bengali">
                অনলাইন
              </span>
            </div>

            {/* Bubble Body */}
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug font-bengali">
              যেকোনো কোর্স বা ভর্তি সহায়তায় মেসেজ দিন।
            </p>

            {/* Bubble Action Link */}
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-1.5 w-full py-1 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bengali font-semibold text-[10px] shadow-xs transition-all duration-200 active:scale-95"
            >
              <MessageCircle className="w-3 h-3" />
              <span>চ্যাট শুরু করুন</span>
            </a>

            {/* Tail pointer arrow pointing towards the button */}
            <div className="hidden sm:block absolute top-1/2 -right-1 -translate-y-1/2 w-2.5 h-2.5 bg-white dark:bg-slate-900 border-t border-r border-emerald-500/30 dark:border-emerald-500/25 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Floating Action Button (More compact & sleek) */}
      <motion.div
        className="pointer-events-auto relative group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        onMouseEnter={() => !tooltipDismissed && setShowTooltip(true)}
      >
        {/* Glowing Pulsing Aura */}
        <span className="absolute -inset-0.5 rounded-full bg-emerald-400/30 dark:bg-emerald-500/25 blur-xs animate-pulse pointer-events-none group-hover:bg-emerald-400/50 transition-colors" />

        {/* Ambient Ring Wave */}
        <span className="absolute inset-0 rounded-full border border-emerald-400/50 animate-ping pointer-events-none opacity-40 duration-1000" />

        {/* Unread Message Pill Badge */}
        <div className="absolute -top-0.5 -right-0.5 z-10 w-3.5 h-3.5 rounded-full bg-rose-500 border border-white dark:border-slate-950 flex items-center justify-center shadow-xs">
          <span className="text-[8px] font-bold text-white leading-none">1</span>
        </div>

        {/* Compact Circular Link Button: 42px on mobile, 48px on sm/desktop */}
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp-এ মেসেজ পাঠান"
          className="relative flex items-center justify-center w-[42px] h-[42px] sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#20ba59] to-[#25D366] text-white shadow-[0_6px_18px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_24px_rgba(37,211,102,0.6)] hover:scale-108 active:scale-95 transition-all duration-300 ring-1 ring-white/30 overflow-hidden"
        >
          {/* Subtle Glass Shimmer Reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10 rounded-full pointer-events-none" />

          {/* Official WhatsApp Icon */}
          <WhatsAppIcon size={22} className="sm:hidden drop-shadow-xs text-white relative z-10 transition-transform duration-300 group-hover:rotate-6" />
          <WhatsAppIcon size={25} className="hidden sm:block drop-shadow-xs text-white relative z-10 transition-transform duration-300 group-hover:rotate-6" />
        </a>
      </motion.div>
    </div>
  );
}
