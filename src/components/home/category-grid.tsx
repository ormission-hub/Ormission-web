"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FlaskConical,
  Stethoscope,
  Building2,
  Calculator,
  Globe,
  Briefcase,
  GraduationCap,
  Check,
  Code,
  Atom,
  Microscope,
  Award,
  Sparkles,
  Brain,
  Laptop,
  Compass,
  Palette,
  Layers,
  LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "@/components/global/section-wrapper";
import { SectionHeading } from "@/components/global/section-heading";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// Icon lookup dictionary
const ICON_MAP: Record<string, LucideIcon> = {
  flask: FlaskConical,
  stethoscope: Stethoscope,
  calculator: Calculator,
  building: Building2,
  graduation: GraduationCap,
  book: BookOpen,
  briefcase: Briefcase,
  globe: Globe,
  code: Code,
  atom: Atom,
  microscope: Microscope,
  award: Award,
  sparkles: Sparkles,
  brain: Brain,
  laptop: Laptop,
  compass: Compass,
  palette: Palette,
  layers: Layers,
};

// Gradient CTA button themes — each card gets a unique pill color
const BUTTON_THEMES = [
  {
    gradient: "from-blue-500 to-blue-600",
    hoverGradient: "hover:from-blue-600 hover:to-blue-700",
    shadow: "shadow-blue-500/25",
  },
  {
    gradient: "from-teal-500 to-cyan-500",
    hoverGradient: "hover:from-teal-600 hover:to-cyan-600",
    shadow: "shadow-teal-500/25",
  },
  {
    gradient: "from-rose-400 to-pink-500",
    hoverGradient: "hover:from-rose-500 hover:to-pink-600",
    shadow: "shadow-rose-500/25",
  },
  {
    gradient: "from-violet-500 to-purple-600",
    hoverGradient: "hover:from-violet-600 hover:to-purple-700",
    shadow: "shadow-violet-500/25",
  },
  {
    gradient: "from-amber-400 to-orange-500",
    hoverGradient: "hover:from-amber-500 hover:to-orange-600",
    shadow: "shadow-amber-500/25",
  },
  {
    gradient: "from-emerald-500 to-green-600",
    hoverGradient: "hover:from-emerald-600 hover:to-green-700",
    shadow: "shadow-emerald-500/25",
  },
  {
    gradient: "from-sky-400 to-blue-500",
    hoverGradient: "hover:from-sky-500 hover:to-blue-600",
    shadow: "shadow-sky-500/25",
  },
  {
    gradient: "from-fuchsia-500 to-pink-500",
    hoverGradient: "hover:from-fuchsia-600 hover:to-pink-600",
    shadow: "shadow-fuchsia-500/25",
  },
];

interface CategoryItem {
  id?: number | string;
  name: string;
  slug: string;
  icon: LucideIcon;
  subtitle: string;
  buttonTheme: (typeof BUTTON_THEMES)[number];
}

// Fallback presets
const defaultCategories: CategoryItem[] = [
  {
    id: 1,
    name: "এইচএসসি সায়েন্স",
    subtitle: "Physics, Chemistry, Math, Biology",
    icon: FlaskConical,
    slug: "hsc-science",
    buttonTheme: BUTTON_THEMES[0],
  },
  {
    id: 2,
    name: "মেডিকেল ভর্তি",
    subtitle: "Bio, GK & English স্পেশাল",
    icon: Stethoscope,
    slug: "medical-admission",
    buttonTheme: BUTTON_THEMES[1],
  },
  {
    id: 3,
    name: "ইঞ্জিনিয়ারিং ভর্তি",
    subtitle: "BUET, RUET, KUET, CKET",
    icon: Calculator,
    slug: "engineering-admission",
    buttonTheme: BUTTON_THEMES[2],
  },
  {
    id: 4,
    name: "বিশ্ববিদ্যালয় ভর্তি",
    subtitle: "'ক' ও 'খ' ইউনিট",
    icon: Building2,
    slug: "university-admission",
    buttonTheme: BUTTON_THEMES[3],
  },
  {
    id: 5,
    name: "এসএসসি প্রস্তুতি",
    subtitle: "বোর্ড পূর্ণাঙ্গ প্রস্তুতি",
    icon: GraduationCap,
    slug: "ssc-prep",
    buttonTheme: BUTTON_THEMES[4],
  },
  {
    id: 6,
    name: "এইচএসসি মানবিক",
    subtitle: "মানবিক ও ব্যবসায় শিক্ষা",
    icon: BookOpen,
    slug: "hsc-arts",
    buttonTheme: BUTTON_THEMES[5],
  },
  {
    id: 7,
    name: "স্কিল ও টেক",
    subtitle: "Web, AI, Python ক্যারিয়ার",
    icon: Briefcase,
    slug: "job-preparation",
    buttonTheme: BUTTON_THEMES[6],
  },
  {
    id: 8,
    name: "ইংলিশ ভার্সন",
    subtitle: "প্রফেশনাল কোর্স",
    icon: Globe,
    slug: "english-version",
    buttonTheme: BUTTON_THEMES[7],
  },
];

function resolveIcon(iconName?: string | null, slug?: string): LucideIcon {
  if (iconName && ICON_MAP[iconName.toLowerCase().trim()]) {
    return ICON_MAP[iconName.toLowerCase().trim()];
  }
  if (slug?.includes("science")) return FlaskConical;
  if (slug?.includes("medical")) return Stethoscope;
  if (slug?.includes("engineering")) return Calculator;
  if (slug?.includes("university")) return Building2;
  if (slug?.includes("ssc")) return GraduationCap;
  if (slug?.includes("arts")) return BookOpen;
  if (slug?.includes("job") || slug?.includes("tech") || slug?.includes("career")) return Briefcase;
  if (slug?.includes("english")) return Globe;
  return BookOpen;
}

export interface DbCategoryRaw {
  id: number | string;
  name_bn?: string | null;
  name?: string | null;
  slug: string;
  icon_name?: string | null;
  description?: string | null;
  display_order?: number;
  is_published?: boolean;
}

export function mapDbToCategories(data: DbCategoryRaw[]): CategoryItem[] {
  return data.map((item, idx) => {
    const theme = BUTTON_THEMES[idx % BUTTON_THEMES.length];
    const defaultMatch = defaultCategories.find((d) => d.slug === item.slug);

    return {
      id: item.id,
      name: item.name_bn || item.name || "",
      slug: item.slug,
      icon: resolveIcon(item.icon_name, item.slug),
      subtitle: item.description || defaultMatch?.subtitle || "",
      buttonTheme: theme,
    };
  });
}

export function CategoryGrid({ initialCategories }: { initialCategories?: DbCategoryRaw[] }) {
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    if (initialCategories && initialCategories.length > 0) {
      return mapDbToCategories(initialCategories);
    }
    return [];
  });

  useEffect(() => {
    const supabase = createClient();

    async function loadDbCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name_bn, name, slug, icon_name, description, display_order, is_published")
          .eq("is_published", true)
          .order("display_order", { ascending: true });

        if (!error && data) {
          if (data.length > 0) {
            setCategories(mapDbToCategories(data));
          } else {
            setCategories([]);
          }
        }
      } catch (e) {
        console.error("Error loading categories:", e);
      }
    }

    loadDbCategories();

    // Listen for real-time category updates, creates and deletes
    const channel = supabase
      .channel("categories-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => {
          loadDbCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SectionWrapper className="!pt-6 lg:!pt-8 !pb-16 lg:!pb-24">
      <SectionHeading
        title="আপনার লক্ষ্য অনুযায়ী কোর্স ক্যাটাগরি"
        subtitle="এসএসসি, এইচএসসি কিংবা স্বপ্নের বিশ্ববিদ্যালয় ও ক্যারিয়ার প্রস্তুতি — বেছে নিন আপনার প্রয়োজনীয় কোর্স"
      />

      {/* Neumorphic Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        <AnimatePresence>
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
            >
              <Link
                href={`/category/${cat.slug}`}
                className={cn(
                  "group relative flex flex-col items-center text-center h-full",
                  "rounded-2xl p-7 pb-6",
                  // Neumorphic surface
                  "bg-surface",
                  // Light mode: soft outer shadow + subtle inset highlight
                  "shadow-[6px_6px_16px_rgba(0,0,0,0.06),-6px_-6px_16px_rgba(255,255,255,0.8)]",
                  "dark:shadow-[6px_6px_16px_rgba(0,0,0,0.35),-6px_-6px_16px_rgba(255,255,255,0.03)]",
                  // Border
                  "border border-border/50",
                  // Hover lift
                  "hover:-translate-y-1.5 hover:shadow-[8px_8px_24px_rgba(0,0,0,0.08),-8px_-8px_24px_rgba(255,255,255,0.9)]",
                  "dark:hover:shadow-[8px_8px_24px_rgba(0,0,0,0.45),-8px_-8px_24px_rgba(255,255,255,0.04)]",
                  "transition-all duration-300 ease-out"
                )}
              >
                {/* Category Title — Large & Bold */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-text font-bengali leading-tight mb-2 group-hover:text-primary transition-colors duration-200">
                  {cat.name}
                </h3>

                {/* Subtitle */}
                <p className="text-sm text-text-muted font-bengali leading-relaxed mb-5">
                  {cat.subtitle}
                </p>

                {/* Spacer pushes button to bottom */}
                <div className="mt-auto" />

                {/* Gradient CTA Button */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white",
                    "bg-gradient-to-r",
                    cat.buttonTheme.gradient,
                    cat.buttonTheme.hoverGradient,
                    "shadow-md",
                    cat.buttonTheme.shadow,
                    "group-hover:shadow-lg group-hover:scale-[1.03]",
                    "transition-all duration-300 ease-out"
                  )}
                >
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  <span className="font-bengali">প্রস্তুত হও এখন</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
