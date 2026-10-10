import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export interface NoticeItem {
  id: string;
  title: string;
  titleBn?: string;
  content: string;
  contentBn?: string;
  type: "emergency" | "offer" | "exam" | "general";
  showTopBanner: boolean;
  showNoticeBoard: boolean;
  actionText?: string;
  actionUrl?: string;
  isActive: boolean;
  pinned: boolean;
  createdAt: string;
}

export const FALLBACK_NOTICES: NoticeItem[] = [
  {
    id: "notice-default-1",
    title: "এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি স্পেশাল লাইভ ব্যাচ শুরু!",
    titleBn: "এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি স্পেশাল লাইভ ব্যাচ শুরু!",
    content: "সকল একাডেমিক ও ভর্তি কোর্সে সীমিত সময়ের জন্য বিশেষ ছাড় চলছে। সেরা মেন্টরদের সাথে এখনই যুক্ত হোন।",
    contentBn: "সকল একাডেমিক ও ভর্তি কোর্সে সীমিত সময়ের জন্য বিশেষ ছাড় চলছে। সেরা মেন্টরদের সাথে এখনই যুক্ত হোন।",
    type: "offer",
    showTopBanner: true,
    showNoticeBoard: true,
    actionText: "কোর্সগুলো দেখুন",
    actionUrl: "/courses",
    isActive: true,
    pinned: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "notice-default-2",
    title: "এসএসসি ২০২৬ পূর্ণাঙ্গ ফাইনাল মডেল টেস্ট রুটিন প্রকাশিত",
    titleBn: "এসএসসি ২০২৬ পূর্ণাঙ্গ ফাইনাল মডেল টেস্ট রুটিন প্রকাশিত",
    content: "বোর্ড স্ট্যান্ডার্ড প্রশ্নপত্রে অধ্যায়ভিত্তিক ও ফাইনাল মডেল টেস্টের বিস্তারিত সময়সূচী ডাউনলোড করুন।",
    contentBn: "বোর্ড স্ট্যান্ডার্ড প্রশ্নপত্রে অধ্যায়ভিত্তিক ও ফাইনাল মডেল টেস্টের বিস্তারিত সময়সূচী ডাউনলোড করুন।",
    type: "exam",
    showTopBanner: false,
    showNoticeBoard: true,
    actionText: "এসএসসি কোর্স দেখুন",
    actionUrl: "/category/ssc",
    isActive: true,
    pinned: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

/**
 * Fetch published notices from Supabase site_settings with fallback.
 * Uses public client with React cache() for fast ISR rendering.
 */
export const getLiveNotices = cache(async (): Promise<NoticeItem[]> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "ormission_notices")
      .maybeSingle();

    if (!error && data?.value && Array.isArray(data.value)) {
      return data.value as NoticeItem[];
    }
  } catch (err) {
    console.warn("Could not fetch notices from Supabase:", err);
  }

  return FALLBACK_NOTICES;
});
