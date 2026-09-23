import { createClient } from "@/lib/supabase/client";

export interface SocialLinkItem {
  enabled: boolean;
  url: string;
  label: string;
  handle?: string;
}

export interface SocialLinksSettings {
  facebook: SocialLinkItem;
  youtube: SocialLinkItem;
  telegram: SocialLinkItem;
  whatsapp: SocialLinkItem;
  instagram: SocialLinkItem;
  linkedin: SocialLinkItem;
  twitter: SocialLinkItem;
  tiktok: SocialLinkItem;
  communityTitle?: string;
  communitySubtitle?: string;
}

export const DEFAULT_SOCIAL_LINKS: SocialLinksSettings = {
  facebook: {
    enabled: true,
    url: "https://facebook.com/ormission",
    label: "ফেসবুক পেজ",
    handle: "@ormission",
  },
  youtube: {
    enabled: true,
    url: "https://youtube.com/@ormission",
    label: "ইউটিউব চ্যানেল",
    handle: "@ormission",
  },
  telegram: {
    enabled: true,
    url: "https://t.me/ormission_community",
    label: "টেলিগ্রাম গ্রুপ",
    handle: "@ormission_community",
  },
  whatsapp: {
    enabled: true,
    url: "https://wa.me/8801728477095",
    label: "হোয়াটসঅ্যাপ সাপোর্ট",
    handle: "+880 1728-477095",
  },
  instagram: {
    enabled: true,
    url: "https://instagram.com/ormission",
    label: "ইনস্টাগ্রাম",
    handle: "@ormission",
  },
  linkedin: {
    enabled: false,
    url: "https://linkedin.com/company/ormission",
    label: "লিংকডইন",
    handle: "Ormission",
  },
  twitter: {
    enabled: false,
    url: "https://twitter.com/ormission",
    label: "টুইটার / X",
    handle: "@ormission",
  },
  tiktok: {
    enabled: false,
    url: "https://tiktok.com/@ormission",
    label: "টিকটক",
    handle: "@ormission",
  },
  communityTitle: "আমাদের অফিশিয়াল কমিউনিটিতে যুক্ত হোন",
  communitySubtitle: "যেকোনো আপডেট, লাইভ ক্লাস অ্যালার্ট এবং সরাসরি মেন্টর সাপোর্টের জন্য ফেসবুক ও টেলিগ্রামে আমাদের সাথে থাকুন।",
};

/**
 * Fetch social links from Supabase site_settings table.
 * Falls back to DEFAULT_SOCIAL_LINKS if not found or on error.
 */
export async function getSocialLinks(): Promise<SocialLinksSettings> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "social_links")
      .maybeSingle();

    if (error || !data?.value) {
      return DEFAULT_SOCIAL_LINKS;
    }

    const val = typeof data.value === "string" ? JSON.parse(data.value) : data.value;

    return {
      ...DEFAULT_SOCIAL_LINKS,
      ...val,
      facebook: { ...DEFAULT_SOCIAL_LINKS.facebook, ...(val.facebook || {}) },
      youtube: { ...DEFAULT_SOCIAL_LINKS.youtube, ...(val.youtube || {}) },
      telegram: { ...DEFAULT_SOCIAL_LINKS.telegram, ...(val.telegram || {}) },
      whatsapp: { ...DEFAULT_SOCIAL_LINKS.whatsapp, ...(val.whatsapp || {}) },
      instagram: { ...DEFAULT_SOCIAL_LINKS.instagram, ...(val.instagram || {}) },
      linkedin: { ...DEFAULT_SOCIAL_LINKS.linkedin, ...(val.linkedin || {}) },
      twitter: { ...DEFAULT_SOCIAL_LINKS.twitter, ...(val.twitter || {}) },
      tiktok: { ...DEFAULT_SOCIAL_LINKS.tiktok, ...(val.tiktok || {}) },
    };
  } catch (e) {
    console.warn("Failed to load social links from site_settings:", e);
    return DEFAULT_SOCIAL_LINKS;
  }
}
