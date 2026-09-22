export interface Subcategory {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  courseCount: number;
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
  courseCount: number;
  subcategories: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: "9",
    name: "SSC",
    nameBn: "SSC",
    slug: "ssc",
    description: "৯ম, ১০ম ও এসএসসি পরীক্ষার পূর্ণাঙ্গ প্রস্তুতি",
    iconName: "GraduationCap",
    color: "#F59E0B",
    courseCount: 1,
    subcategories: [],
  },
  {
    id: "6",
    name: "HSC",
    nameBn: "এইচএসসি সকল বিভাগ",
    slug: "hsc",
    description: "এইচএসসি সায়েন্স, মানবিক ও বাণিজ্য বিভাগের প্রস্তুতি",
    iconName: "Atom",
    color: "#3B82F6",
    courseCount: 1,
    subcategories: [],
  },
  {
    id: "5",
    name: "Admission",
    nameBn: "বিশ্ববিদ্যালয় ও মেডিকেল ভর্তি",
    slug: "admission",
    description: "বিশ্ববিদ্যালয় ও মেডিকেল ভর্তি স্পেশাল প্রোগ্রাম",
    iconName: "Building2",
    color: "#A855F7",
    courseCount: 0,
    subcategories: [],
  },
  {
    id: "17",
    name: "Medical & Nursing",
    nameBn: "মেডিকেল ও নার্সিং",
    slug: "nursing-medical",
    description: "নার্সিং ও মেডিকেল প্রস্তুতি প্রোগ্রাম",
    iconName: "Stethoscope",
    color: "#10B981",
    courseCount: 0,
    subcategories: [],
  },
  {
    id: "10",
    name: "Arts & Commerce",
    nameBn: "মানবিক ও ব্যবসায় শিক্ষা",
    slug: "arts-commerce",
    description: "আর্টস ও কমার্স শিক্ষার্থীদের জন্য সেরা প্রস্তুতি",
    iconName: "BookOpen",
    color: "#F43F5E",
    courseCount: 0,
    subcategories: [],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  const s = slug.toLowerCase().trim();
  return CATEGORIES.find((c) => c.slug.toLowerCase() === s);
}
