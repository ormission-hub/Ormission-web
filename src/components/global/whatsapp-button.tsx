"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/global/social-icons";
import { getSocialLinks, DEFAULT_SOCIAL_LINKS } from "@/lib/data/social-links";

const DEFAULT_MESSAGE = "আসসালামু আলাইকুম! Ormission প্ল্যাটফর্ম ও কোর্স সম্পর্কে বিস্তারিত জানতে চাচ্ছি।";

export function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [whatsappConfig, setWhatsappConfig] = useState(DEFAULT_SOCIAL_LINKS.whatsapp);

  useEffect(() => {
    setMounted(true);
    let isSubscribed = true;

    // Fetch dynamic WhatsApp settings
    getSocialLinks()
      .then((settings) => {
        if (isSubscribed && settings?.whatsapp) {
          setWhatsappConfig(settings.whatsapp);
        }
      })
      .catch((err) => {
        console.warn("Could not load dynamic WhatsApp settings:", err);
      });

    // Check if dismissed previously in session
    const dismissed = sessionStorage.getItem("ormission_wa_dismissed");
    if (dismissed) {
      setTooltipDismissed(true);
    } else {
      // Auto pop tooltip after 3.5 seconds
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

  if (!mounted || !whatsappConfig.enabled) {
    return null;
  }

  // Construct target WhatsApp URL with pre-filled message
  let targetUrl = whatsappConfig.url || "https://wa.me/8801728477095";
  if (!targetUrl.startsWith("http")) {
    const cleaned = targetUrl.replace(/[^0-9]/g, "");
    targetUrl = `https://wa.me/${cleaned}`;
  }

  // Append text query if not already present
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
      className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 lg:bottom-6 lg:right-6 z-[55] flex items-end gap-3 select-none pointer-events-none"
      aria-label="WhatsApp চ্যাট উইজেট"
    >
      {/* Floating Chat Bubble / Tooltip */}
      <AnimatePresence>
        {showTooltip && !tooltipDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-auto relative max-w-[260px] sm:max-w-[280px] bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/25 rounded-2xl p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            {/* Close Button */}
            <button
              onClick={handleDismissTooltip}
              aria-label="বার্তা বন্ধ করুন"
              className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-colors shadow-sm"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Bubble Header */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[12px] font-bold text-slate-800 dark:text-slate-100 font-bengali">
                Ormission সাপোর্ট টিম
              </span>
              <span className="ml-auto text-[10px] text-emerald-600 dark:text-emerald-400 font-medium font-bengali">
                অনলাইন
              </span>
            </div>

            {/* Bubble Body */}
            <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-snug font-bengali">
              যেকোনো কোর্স, ভর্তি বা পরামর্শের জন্য সরাসরি আমাদের মেসেজ দিন।
            </p>

            {/* Bubble Action Link */}
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bengali font-semibold text-[11px] shadow-sm transition-all duration-200 active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>চ্যাট শুরু করুন</span>
            </a>

            {/* Tail pointer arrow pointing towards the button */}
            <div className="hidden sm:block absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white dark:bg-slate-900 border-t border-r border-emerald-500/30 dark:border-emerald-500/25 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Floating Action Button */}
      <motion.div
        className="pointer-events-auto relative group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        onMouseEnter={() => !tooltipDismissed && setShowTooltip(true)}
      >
        {/* Glowing Pulsing Aura */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/35 dark:bg-emerald-500/25 blur-sm animate-pulse pointer-events-none group-hover:bg-emerald-400/50 transition-colors" />

        {/* Ambient Ring Wave */}
        <span className="absolute inset-0 rounded-full border-2 border-emerald-400/60 animate-ping pointer-events-none opacity-40 duration-1000" />

        {/* Unread Message Pill Badge */}
        <div className="absolute -top-1 -right-1 z-10 w-4 h-4 rounded-full bg-rose-500 border-2 border-white dark:border-slate-950 flex items-center justify-center shadow-md">
          <span className="text-[9px] font-bold text-white leading-none">1</span>
        </div>

        {/* Circular Link Button */}
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp-এ মেসেজ পাঠান"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#20ba59] to-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.65)] hover:scale-108 active:scale-95 transition-all duration-300 ring-1 ring-white/30 overflow-hidden"
        >
          {/* Subtle Glass Shimmer Reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10 rounded-full pointer-events-none" />

          {/* Official WhatsApp Icon */}
          <WhatsAppIcon size={30} className="drop-shadow-sm text-white relative z-10 transition-transform duration-300 group-hover:rotate-6" />
        </a>
      </motion.div>
    </div>
  );
}
