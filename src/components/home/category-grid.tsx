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
  ArrowUpRight,
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

// Curated 8 Themes matching original brand aesthetics
const COLOR_THEMES = [
  {
    iconColor: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/40",
    glowClass: "group-hover:shadow-blue-500/10",
  },
  {
    iconColor: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40",
    glowClass: "group-hover:shadow-emerald-500/10",
  },
  {
    iconColor: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-accent/10 border-accent/20 group-hover:bg-accent/20 group-hover:border-accent/40",
    glowClass: "group-hover:shadow-amber-500/10",
  },
  {
    iconColor: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40",
    glowClass: "group-hover:shadow-indigo-500/10",
  },
  {
    iconColor: "text-sky-600 dark:text-sky-400",
    bgClass: "bg-sky-500/10 border-sky-500/20 group-hover:bg-sky-500/20 group-hover:border-sky-500/40",
    glowClass: "group-hover:shadow-sky-500/10",
  },
  {
    iconColor: "text-rose-600 dark:text-rose-400",
    bgClass: "bg-rose-500/10 border-rose-500/20 group-hover:bg-rose-500/20 group-hover:border-rose-500/40",
    glowClass: "group-hover:shadow-rose-500/10",
  },
  {
    iconColor: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20 group-hover:border-purple-500/40",
    glowClass: "group-hover:shadow-purple-500/10",
  },
  {
    iconColor: "text-teal-600 dark:text-teal-400",
    bgClass: "bg-secondary/10 border-secondary/20 group-hover:bg-secondary/20 group-hover:border-secondary/40",
    glowClass: "group-hover:shadow-teal-500/10",
  },
];

interface CategoryItem {
  id?: number | string;
  name: string;
  slug: string;
  icon: LucideIcon;
  count?: number;
  iconColor: string;
  bgClass: string;
  glowClass: string;
}

// Fallback presets matching official screenshot exactly
const defaultCategories: CategoryItem[] = [
  {
    id: 1,
    name: "এইচএসসি সায়েন্স (Physics, Chem, Math, Bio)",
    icon: FlaskConical,
    slug: "hsc-science",
    count: 25,
    ...COLOR_THEMES[0],
  },
  {
    id: 2,
    name: "মেডিকেল ভর্তি স্পেশাল (Bio, GK & English)",
    icon: Stethoscope,
    slug: "medical-admission",
    count: 12,
    ...COLOR_THEMES[1],
  },
  {
    id: 3,
    name: "ইঞ্জিনিয়ারিং ভর্তি (BUET, RUET, KUET, CKET)",
    icon: Calculator,
    slug: "engineering-admission",
    count: 15,
    ...COLOR_THEMES[2],
  },
  {
    id: 4,
    name: "বিশ্ববিদ্যালয় 'ক' ও 'খ' ইউনিট ভর্তি",
    icon: Building2,
    slug: "university-admission",
    count: 20,
    ...COLOR_THEMES[3],
  },
  {
    id: 5,
    name: "এসএসসি বোর্ড পূর্ণাঙ্গ প্রস্তুতি",
    icon: GraduationCap,
    slug: "ssc-prep",
    count: 22,
    ...COLOR_THEMES[4],
  },
  {
    id: 6,
    name: "এইচএসসি মানবিক ও ব্যবসায় শিক্ষা",
    icon: BookOpen,
    slug: "hsc-arts",
    count: 18,
    ...COLOR_THEMES[5],
  },
  {
    id: 7,
    name: "স্কিল ও টেক ক্যারিয়ার (Web, AI, Python)",
    icon: Briefcase,
    slug: "job-preparation",
    count: 10,
    ...COLOR_THEMES[6],
  },
  {
    id: 8,
    name: "ইংলিশ ভার্সন ও প্রফেশনাল কোর্স",
    icon: Globe,
    slug: "english-version",
    count: 8,
    ...COLOR_THEMES[7],
  },
];

// Resolves responsive width so cards always fit beautifully regardless of count
function getResponsiveCardWidth(total: number): string {
  if (total <= 1) return "w-full max-w-md";
  if (total === 2) return "w-full sm:w-[calc(50%-10px)] max-w-lg";
  if (total === 3) return "w-[calc(50%-8px)] sm:w-[calc(33.333%-12px)] lg:w-[calc(33.333%-14px)]";
  if (total === 4) return "w-[calc(50%-8px)] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]";
  // 5 or 6 items: 3-column rows (e.g. 3 in row 1, 3 in row 2 OR 3 in row 1, 2 centered in row 2)
  if (total === 5 || total === 6) return "w-[calc(50%-8px)] sm:w-[calc(33.333%-12px)] lg:w-[calc(33.333%-14px)]";
  // 7, 8 or more items: 4-column balanced rows with centered overflow
  return "w-[calc(50%-8px)] sm:w-[calc(33.333%-12px)] lg:w-[calc(25%-15px)]";
}

function resolveIcon(iconName?: string | null, slug?: string): LucideIcon {
  if (iconName && ICON_MAP[iconName.toLowerCase().trim()]) {
    return ICON_MAP[iconName.toLowerCase().trim()];
  }
  // Fallback by slug
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
    const theme = COLOR_THEMES[idx % COLOR_THEMES.length];
    const defaultMatch = defaultCategories.find((d) => d.slug === item.slug);
    const count = defaultMatch ? defaultMatch.count : 10 + ((idx * 3) % 15);

    return {
      id: item.id,
      name: item.name_bn || item.name || "",
      slug: item.slug,
      icon: resolveIcon(item.icon_name, item.slug),
      count,
      ...theme,
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

  const totalCards = categories.length;
  const cardWidthClass = getResponsiveCardWidth(totalCards);

  return (
    <SectionWrapper>
      <SectionHeading
        title="আপনার লক্ষ্য অনুযায়ী কোর্স ক্যাটাগরি"
        subtitle="এসএসসি, এইচএসসি কিংবা স্বপ্নের বিশ্ববিদ্যালয় ও ক্যারিয়ার প্রস্তুতি — বেছে নিন আপনার প্রয়োজনীয় কোর্স"
      />

      {/* Dynamic Adaptive Centered Flex Grid (Cards gracefully rebalance if any are deleted) */}
      <div className="flex flex-wrap justify-center gap-3.5 sm:gap-4 lg:gap-5 w-full">
        <AnimatePresence>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className={cardWidthClass}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className={cn(
                    "group relative flex flex-col items-center text-center p-5 rounded-2xl transition-all duration-300 h-full",
                    "bg-surface border border-border/80 hover:border-primary/40",
                    "hover:-translate-y-1 hover:shadow-lg",
                    cat.glowClass
                  )}
                >
                  {/* Top right arrow indicator */}
                  <div className="absolute top-3 right-3 text-text-muted/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>

                  {/* Premium Dual-tone SVG Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl border flex items-center justify-center mb-3.5 transition-all duration-300 shadow-xs",
                      "group-hover:scale-110",
                      cat.bgClass
                    )}
                  >
                    <Icon className={cn("w-6 h-6 transition-transform duration-300", cat.iconColor)} />
                  </div>

                  <span className="text-sm font-bold text-text font-bengali group-hover:text-primary transition-colors leading-snug">
                    {cat.name}
                  </span>
                  <span className="text-xs text-text-muted mt-1 font-bengali">
                    {cat.count}টি সক্রিয় কোর্স
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
