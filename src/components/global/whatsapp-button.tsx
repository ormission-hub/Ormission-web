"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneCall, X, MessageCircle } from "lucide-react";
import { WhatsAppIcon, MessengerIcon } from "@/components/global/social-icons";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_MESSAGE = "আসসালামু আলাইকুম! Ormission প্ল্যাটফর্ম ও কোর্স সম্পর্কে বিস্তারিত জানতে চাচ্ছি।";
const DEFAULT_PHONE = "01741347039";

function formatWhatsAppUrl(rawUrlOrNumber: string): string {
  if (!rawUrlOrNumber) return "https://wa.me/8801741347039";
  const trimmed = rawUrlOrNumber.trim();
  if (trimmed.startsWith("http")) return trimmed;

  let digits = trimmed.replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) {
    digits = "880" + digits.slice(1);
  } else if (digits.length === 10 && digits.startsWith("1")) {
    digits = "880" + digits;
  }
  return digits ? `https://wa.me/${digits}` : "https://wa.me/8801741347039";
}

function formatMessengerUrl(facebookUrlOrHandle: string): string {
  if (!facebookUrlOrHandle) return "https://m.me/ormission";
  const trimmed = facebookUrlOrHandle.trim();
  if (trimmed.startsWith("https://m.me/")) return trimmed;

  try {
    const clean = trimmed.replace(/\/+$/, "");
    const parts = clean.split("/");
    const lastPart = parts[parts.length - 1];
    if (lastPart && !lastPart.includes("facebook.com")) {
      return `https://m.me/${lastPart}`;
    }
  } catch {}
  return "https://m.me/ormission";
}

function formatPhoneDisplay(rawPhone: string): string {
  if (!rawPhone) return "01741-347039";
  const digits = rawPhone.replace(/[^0-9]/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return rawPhone;
}

export function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string>("https://wa.me/8801741347039");
  const [messengerUrl, setMessengerUrl] = useState<string>("https://m.me/ormission");
  const [phoneNumber, setPhoneNumber] = useState<string>(DEFAULT_PHONE);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    let isSubscribed = true;

    async function loadConfig() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["social_links", "contact_whatsapp", "contact_phone", "contact_messenger"]);

        if (error || !isSubscribed || !data) return;

        let activeWa = "";
        let activeFb = "";
        let activePhone = "";
        let enabled = true;

        // 1. Social links
        const socialRow = data.find((d) => d.key === "social_links");
        if (socialRow?.value) {
          const val = typeof socialRow.value === "string" ? JSON.parse(socialRow.value) : socialRow.value;
          if (val?.whatsapp?.url) activeWa = val.whatsapp.url;
          if (val?.facebook?.url) activeFb = val.facebook.url;
          if (val?.whatsapp?.enabled !== undefined) enabled = val.whatsapp.enabled;
        }

        // 2. Contact whatsapp
        const waRow = data.find((d) => d.key === "contact_whatsapp");
        if (waRow?.value) {
          const raw = typeof waRow.value === "string" ? waRow.value.trim() : "";
          if (raw) activeWa = formatWhatsAppUrl(raw);
        }

        // 3. Contact phone / hotline (Direct Call)
        const phoneRow = data.find((d) => d.key === "contact_phone");
        if (phoneRow?.value) {
          const raw = typeof phoneRow.value === "string" ? phoneRow.value.trim() : "";
          if (raw) activePhone = raw;
        }

        // 4. Contact messenger
        const messengerRow = data.find((d) => d.key === "contact_messenger");
        if (messengerRow?.value) {
          const raw = typeof messengerRow.value === "string" ? messengerRow.value.trim() : "";
          if (raw) activeFb = raw;
        }

        if (activeWa) setWhatsappUrl(formatWhatsAppUrl(activeWa));
        if (activeFb) setMessengerUrl(formatMessengerUrl(activeFb));
        if (activePhone) {
          setPhoneNumber(activePhone);
        } else if (activeWa) {
          const digits = activeWa.replace(/[^0-9]/g, "");
          const localNum = digits.startsWith("880") ? "0" + digits.slice(3) : digits;
          if (localNum) setPhoneNumber(localNum);
        }

        setIsEnabled(enabled);
      } catch (err) {
        console.warn("Could not load contact settings:", err);
      }
    }

    loadConfig();

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!mounted || !isEnabled) {
    return null;
  }

  // Construct target WhatsApp URL with prefilled greeting
  let targetWhatsAppUrl = whatsappUrl || "https://wa.me/8801741347039";
  if (!targetWhatsAppUrl.includes("text=")) {
    const separator = targetWhatsAppUrl.includes("?") ? "&" : "?";
    targetWhatsAppUrl = `${targetWhatsAppUrl}${separator}text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
  }

  const phoneDigits = phoneNumber.replace(/[^0-9+]/g, "") || DEFAULT_PHONE;
  const displayPhone = formatPhoneDisplay(phoneNumber);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-[4.75rem] right-3 sm:bottom-24 sm:right-5 lg:bottom-6 lg:right-6 z-[55] select-none"
      aria-label="যোগাযোগ বাটন"
    >
      {/* Stacked Options (WhatsApp, Messenger, Direct Call) - উপর-নিচে */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full right-0 mb-3 w-[250px] sm:w-[270px] flex flex-col gap-1.5 p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_36px_rgba(0,0,0,0.2)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
          >
            {/* Header info */}
            <div className="px-2.5 pt-1.5 pb-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 font-bengali">
                  সরাসরি যোগাযোগ করুন
                </span>
              </div>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold font-bengali">
                অনলাইন
              </span>
            </div>

            {/* 1. WhatsApp Option */}
            <a
              href={targetWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/90 hover:bg-emerald-50/90 dark:bg-slate-800/50 dark:hover:bg-emerald-950/40 border border-slate-200/60 hover:border-emerald-300 dark:border-slate-700/60 dark:hover:border-emerald-700/60 transition-all duration-200 active:scale-[0.98]"
            >
              <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-[0_3px_10px_rgba(37,211,102,0.35)] group-hover:scale-108 transition-transform">
                <WhatsAppIcon size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    WhatsApp
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold font-bengali">
                    চ্যাট
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-bengali truncate">
                  হোয়াটসঅ্যাপে মেসেজ পাঠান
                </p>
              </div>
            </a>

            {/* 2. Messenger Option */}
            <a
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/90 hover:bg-blue-50/90 dark:bg-slate-800/50 dark:hover:bg-blue-950/40 border border-slate-200/60 hover:border-blue-300 dark:border-slate-700/60 dark:hover:border-blue-700/60 transition-all duration-200 active:scale-[0.98]"
            >
              <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-gradient-to-tr from-[#0084FF] via-[#0099FF] to-[#00C6FF] text-white flex items-center justify-center shrink-0 shadow-[0_3px_10px_rgba(0,132,255,0.35)] group-hover:scale-108 transition-transform">
                <MessengerIcon size={17} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Messenger
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-semibold font-bengali">
                    ফেসবুক
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-bengali truncate">
                  মেসেঞ্জারে ইনবক্স করুন
                </p>
              </div>
            </a>

            {/* 3. Direct Call Option */}
            <a
              href={`tel:${phoneDigits}`}
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/90 hover:bg-teal-50/90 dark:bg-slate-800/50 dark:hover:bg-teal-950/40 border border-slate-200/60 hover:border-teal-300 dark:border-slate-700/60 dark:hover:border-teal-700/60 transition-all duration-200 active:scale-[0.98]"
            >
              <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-[0_3px_10px_rgba(20,184,166,0.35)] group-hover:scale-108 transition-transform">
                <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    Direct Call
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 font-semibold font-bengali">
                    কল করুন
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-600 dark:text-slate-300 font-mono font-medium truncate">
                  {displayPhone}
                </p>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Call Trigger Button (More compact: 40px mobile / 44px desktop) */}
      <div className="relative group">
        {/* Subtle hover tooltip (when menu is closed) */}
        {!isOpen && showTooltip && (
          <div className="hidden sm:block absolute bottom-1/2 right-full -translate-y-1/2 mr-2.5 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-[11px] font-bengali whitespace-nowrap shadow-md pointer-events-none backdrop-blur-xs border border-white/10">
            কল বা মেসেজ করুন
          </div>
        )}

        {/* Ambient Ring Wave (only when closed) */}
        {!isOpen && (
          <>
            <span className="absolute -inset-0.5 rounded-full bg-emerald-500/25 blur-xs animate-pulse pointer-events-none" />
            <span className="absolute inset-0 rounded-full border border-emerald-400/40 animate-ping pointer-events-none opacity-40 duration-1000" />
          </>
        )}

        {/* Compact Circular Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setShowTooltip(false);
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "যোগাযোগ মেনু বন্ধ করুন" : "যোগাযোগ করুন (Call / WhatsApp / Messenger)"}
          className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white shadow-[0_6px_20px_rgba(16,185,129,0.38)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.55)] active:scale-95 transition-all duration-300 ring-2 ring-white/40 dark:ring-white/20 cursor-pointer overflow-hidden ${
            isOpen
              ? "bg-slate-800 hover:bg-slate-700 shadow-slate-900/30"
              : "bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 hover:scale-106"
          }`}
        >
          {/* Subtle Glass Shimmer Reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 rounded-full pointer-events-none" />

          {/* Animated Icon: Call / Phone icon rotates to X when open */}
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="relative z-10 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="call"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="relative z-10 flex items-center justify-center"
              >
                <Phone className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white drop-shadow-xs" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

// Re-export as QuickContactWidget for clean semantics
export { WhatsAppButton as QuickContactWidget };
