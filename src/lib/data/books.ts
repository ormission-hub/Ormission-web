import { createClient } from "@/lib/supabase/client";

export interface BookItem {
  id: string;
  title: string;
  subtitle: string;
  author?: string;
  edition?: string;
  publisher?: string;
  category: string;
  category_id?: number | string;
  category_slug?: string;
  price: number;
  original_price: number;
  cover_image?: string;
  pages?: string;
  format?: string;
  stock_status?: "in_stock" | "low_stock" | "pre_order" | "out_of_stock";
  stock_quantity?: number;
  rating?: number;
  reviews_count?: number;
  features?: string[];
  is_popular?: boolean;
  is_pinned?: boolean;
  display_order?: number;
  order_url?: string;
  preview_pdf_url?: string;
  delivery_info?: string;
  isbn?: string;
  description?: string;
  target_audience?: string;
  table_of_contents?: string[];
}

export const DEFAULT_BOOKS: BookItem[] = [
  {
    id: "book-1",
    title: "এইচএসসি পদার্থবিজ্ঞান মাস্টার ফর্মুলা বুক",
    subtitle: "১ম ও ২য় পত্রের সকল সূত্রের প্রমাণ, শর্টকাট ট্রিকস ও বোর্ড প্রশ্ন সমাধান",
    author: "ড. মো. রফিকুল ইসলাম ও টিম",
    edition: "১ম সংস্করণ ২০২৬",
    publisher: "অরমিশন পাবলিকেশন্স",
    category: "এইচএসসি বিজ্ঞান",
    price: 380,
    original_price: 500,
    cover_image: "/images/books/physics-formula.jpg",
    pages: "৩২০ পৃষ্ঠা",
    format: "হার্ডকভার + ই-বুক",
    stock_status: "in_stock",
    rating: 5.0,
    reviews_count: 1420,
    features: [
      "অধ্যায়ভিত্তিক সকল সূত্র, একক ও মাত্রা",
      "বিগত ১০ বছরের বোর্ড প্রশ্ন ও নির্ভুল সমাধান",
      "টাইপভিত্তিক ক্যালকুলেটর শর্টকাট টেকনিক",
      "গাণিতিক সমস্যা সমাধানের কনসেপ্ট ম্যাপ",
    ],
    is_popular: true,
    is_pinned: true,
    display_order: 1,
    delivery_info: "সারাদেশে ক্যাশ অন ডেলিভারি ২-৩ কার্যদিবসে",
    order_url: "https://www.rokomari.com/book/search?term=" + encodeURIComponent("এইচএসসি পদার্থবিজ্ঞান মাস্টার ফর্মুলা বুক"),
    description:
      "এইচএসসি পরীক্ষার্থী ও ভর্তিচ্ছু শিক্ষার্থীদের জন্য পদার্থবিজ্ঞান প্রথম ও দ্বিতীয় পত্রের প্রতিটি অধ্যায়ের পূর্ণাঙ্গ বিশ্লেষণ। এখানে সকল মৌলিক সূত্রের উৎপত্তি, ব্যবহারবিধি এবং দ্রুত গণিতের সমাধান করার জাদুকরি ট্রিকস বিস্তারিতভাবে আলোচনা করা হয়েছে। বোর্ড পরীক্ষা এবং প্রকৌশল ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষায় সর্বোচ্চ নম্বর নিশ্চিতে বইটি শিক্ষার্থীদের সেরা সহায়ক।",
    target_audience: "এইচএসসি ২০২৫ ও ২০২৬ বিজ্ঞান বিভাগের শিক্ষার্থী এবং ইঞ্জিনিয়ারিং ভর্তি পরীক্ষার্থী।",
  },
  {
    id: "book-2",
    title: "বুয়েট ও ইঞ্জিনিয়ারিং বিগত ২০ বছরের প্রশ্নব্যাংক",
    subtitle: "বুয়েট, রুয়েট, কুয়েট ও চুয়েটের অধ্যায়ভিত্তিক নিখুঁত প্রশ্ন বিশ্লেষণ ও সমাধান",
    author: "বুয়েট ইঞ্জিনিয়ার্স প্যানেল",
    edition: "১ম সংস্করণ ২০২৬",
    publisher: "অরমিশন পাবলিকেশন্স",
    category: "ইঞ্জিনিয়ারিং ভর্তি",
    price: 550,
    original_price: 720,
    cover_image: "/images/books/engineering-question-bank.jpg",
    pages: "৫৪০ পৃষ্ঠা",
    format: "হার্ডকভার প্রিন্ট",
    stock_status: "in_stock",
    rating: 5.0,
    reviews_count: 980,
    features: [
      "বিগত ২০ বছরের বুয়েট ভর্তি পরীক্ষার পূর্ণাঙ্গ প্রশ্ন",
      "অধ্যায়ভিত্তিক ওয়েইটেজ ও ট্রেন্ড এনালাইসিস",
      "কঠিন গণিতের একাধিক বিকল্প ও সহজ পদ্ধতি",
      "পরীক্ষার হলে সময় বাঁচানোর বিশেষ ট্রিকস",
    ],
    is_popular: true,
    is_pinned: true,
    display_order: 2,
    delivery_info: "সারাদেশে ক্যাশ অন ডেলিভারি ২-৩ কার্যদিবসে",
    order_url: "https://www.rokomari.com/book/search?term=" + encodeURIComponent("বুয়েট ও ইঞ্জিনিয়ারিং বিগত ২০ বছরের প্রশ্নব্যাংক"),
    description:
      "বুয়েট, রুয়েট, কুয়েট, চুয়েট এবং আইইউটি ভর্তি পরীক্ষার বিগত দুই দশকের প্রতিটি প্রশ্নের সূক্ষ্ম ও নিখুঁত সমাধান নিয়ে তৈরি এই মেগা প্রশ্নব্যাংক। প্রতিটি প্রশ্নের সাথে প্রাসঙ্গিক থিওরি ও সাধারণ ভুলের সতর্কতা যুক্ত করা হয়েছে যাতে শিক্ষার্থীরা সর্বোচ্চ প্রস্তুতি গ্রহণ করতে পারে।",
    target_audience: "ইঞ্জিনিয়ারিং ও প্রযুক্তি বিশ্ববিদ্যালয়ে পড়ার স্বপ্নদ্রষ্টা শিক্ষার্থী।",
  },
  {
    id: "book-3",
    title: "মেডিকেল বায়োলজি নেমোনিক্স ও হাই-ইল্ড হ্যান্ডবুক",
    subtitle: "ডিএমসি ও শীর্ষ মেডিকেল শিক্ষার্থীদের তৈরিকৃত মনে রাখার স্পেশাল হ্যান্ডনোট",
    author: "ডা. সৈয়দা নুসরাত জাহান ও ডিএমসি টিম",
    edition: "১ম সংস্করণ ২০২৬",
    publisher: "অরমিশন পাবলিকেশন্স",
    category: "মেডিকেল ভর্তি",
    price: 320,
    original_price: 450,
    cover_image: "/images/books/medical-biology.jpg",
    pages: "২৮০ পৃষ্ঠা",
    format: "৪ কালার আর্ট প্রিন্ট",
    stock_status: "in_stock",
    rating: 4.9,
    reviews_count: 1650,
    features: [
      "১০০% রঙিন চিত্র ও স্পষ্ট এনাটোমিক্যাল ডায়াগ্রাম",
      "জাদুকরী নেমোনিক্স ও সহজে মনে রাখার কৌশল",
      "বোটানি ও জুয়োলজির শতভাগ সিলেবাস কাভারেজ",
      "ম্যাট (MAT) বিগত বছরগুলোর গুরুত্বপূর্ণ প্রশ্নাবলি",
    ],
    is_popular: true,
    is_pinned: true,
    display_order: 3,
    delivery_info: "সারাদেশে ক্যাশ অন ডেলিভারি ২-৩ কার্যদিবসে",
    order_url: "https://www.rokomari.com/book/search?term=" + encodeURIComponent("মেডিকেল বায়োলজি নেমোনিক্স ও হাই-ইল্ড হ্যান্ডবুক"),
    description:
      "মেডিকেল ভর্তি পরীক্ষায় জীববিজ্ঞানের বিশাল সিলেবাস অল্প সময়ে নিখুঁতভাবে মনে রাখার জন্য এই হ্যান্ডবুকটি অনন্য। ডিএমসি সহ সরকারি মেডিকেল কলেজের শীর্ষ মেধাবীদের অভিজ্ঞতা ও বাস্তব নেমোনিক্স দিয়ে প্রতিটি কঠিন বিষয় সহজবোধ্য করা হয়েছে।",
    target_audience: "মেডিকেল ও ডেন্টাল ভর্তি পরীক্ষার্থী এবং এইচএসসি জীববিজ্ঞান শিক্ষার্থী।",
  },
  {
    id: "book-4",
    title: "এইচএসসি রসায়ন অর্গানিক রিঅ্যাকশন রঙিন রোডম্যাপ",
    subtitle: "জৈব রসায়নের সকল বিক্রিয়া ও পারস্পরিক রূপান্তরের এক নজরে রঙিন ফ্লোচার্ট",
    author: "অরমিশন কেমিস্ট্রি ফ্যাকাল্টি",
    edition: "১ম সংস্করণ ২০২৬",
    publisher: "অরমিশন পাবলিকেশন্স",
    category: "এইচএসসি একাডেমি",
    price: 290,
    original_price: 390,
    cover_image: "/images/books/chemistry-roadmap.svg",
    pages: "১৯০ পৃষ্ঠা",
    format: "প্রিমিয়াম আর্ট পেপার",
    stock_status: "in_stock",
    rating: 5.0,
    reviews_count: 840,
    features: [
      "সম্পূর্ণ বিক্রিয়ার রঙিন মেগা ফ্লোচার্ট",
      "সকল গুরুত্বপূর্ণ নেম রিঅ্যাকশন ও মেকানিজম",
      "এডমিশন স্পেশাল কনভার্সন শর্টকাট ট্রিকস",
      "গুরুত্বপূর্ণ বিকারক ও টেস্ট আইডেন্টিফিকেশন চার্ট",
    ],
    is_popular: true,
    is_pinned: true,
    display_order: 4,
    delivery_info: "সারাদেশে ক্যাশ অন ডেলিভারি ২-৩ কার্যদিবসে",
    order_url: "https://www.rokomari.com/book/search?term=" + encodeURIComponent("এইচএসসি রসায়ন অর্গানিক রিঅ্যাকশন রঙিন রোডম্যাপ"),
    description:
      "জৈব রসায়নের জটিল বিক্রিয়া এবং পারস্পরিক রূপান্তরকে সহজ ও আকর্ষণীয় ফ্লোচার্টের মাধ্যমে উপস্থাপন করা হয়েছে এই বইটিতে। এক নজরে চোখ বুলিয়ে যে কোনো রিঅ্যাকশন মনে রাখার জন্য এটি একটি জাদুকরী সহায়ক বই।",
    target_audience: "এইচএসসি পরীক্ষার্থী এবং ভার্সিটি ও মেডিকেল ভর্তিচ্ছু শিক্ষার্থী।",
  },
];

// Helper to normalize book data and ensure a valid image & order URL
export function normalizeBookItem(raw: any, index = 0): BookItem {
  const rawId = String(raw?.id || "").toLowerCase();
  const rawTitle = (raw?.title || "").toLowerCase();

  // 1. Identify best matched default book by exact ID or keywords
  let matchedDefault = DEFAULT_BOOKS.find((d) => d.id.toLowerCase() === rawId);
  if (!matchedDefault) {
    if (rawTitle.includes("পদার্থ") || rawTitle.includes("physics")) {
      matchedDefault = DEFAULT_BOOKS[0];
    } else if (
      rawTitle.includes("বুয়েট") ||
      rawTitle.includes("বুয়েট") ||
      rawTitle.includes("ইঞ্জিনিয়ারিং") ||
      rawTitle.includes("engineering")
    ) {
      matchedDefault = DEFAULT_BOOKS[1];
    } else if (
      rawTitle.includes("বায়োলজি") ||
      rawTitle.includes("biology") ||
      rawTitle.includes("মেডিকেল")
    ) {
      matchedDefault = DEFAULT_BOOKS[2];
    } else if (rawTitle.includes("রসায়ন") || rawTitle.includes("chemistry")) {
      matchedDefault = DEFAULT_BOOKS[3];
    }
  }

  const fallback = matchedDefault || DEFAULT_BOOKS[index % DEFAULT_BOOKS.length];

  // 2. Intelligent Cover Image selection ensuring correct subject image
  let coverImage: string | undefined = raw?.cover_image ? String(raw.cover_image).trim() : undefined;
  if (
    !coverImage ||
    (coverImage.includes("chemistry-roadmap") &&
      (rawTitle.includes("পদার্থ") || rawTitle.includes("physics") || rawId === "book-1")) ||
    (coverImage.includes("physics-formula") &&
      (rawTitle.includes("রসায়ন") || rawTitle.includes("chemistry") || rawId === "book-4"))
  ) {
    coverImage = fallback.cover_image;
  }

  // 3. Guaranteed valid Rokomari / Shop Order URL
  const orderUrl =
    raw?.order_url && String(raw.order_url).trim().length > 0
      ? String(raw.order_url).trim()
      : fallback.order_url ||
        `https://www.rokomari.com/book/search?term=${encodeURIComponent(raw?.title || fallback.title)}`;

  return {
    id: String(raw?.id || fallback.id),
    title: raw?.title || fallback.title,
    subtitle: raw?.subtitle || fallback.subtitle,
    author: raw?.author || fallback.author,
    edition: raw?.edition || fallback.edition,
    publisher: raw?.publisher || fallback.publisher,
    category: raw?.category || fallback.category,
    category_id: raw?.category_id,
    category_slug: raw?.category_slug,
    price: typeof raw?.price === "number" ? raw.price : fallback.price,
    original_price:
      typeof raw?.original_price === "number" ? raw.original_price : fallback.original_price,
    cover_image: coverImage,
    pages: raw?.pages || fallback.pages,
    format: raw?.format || fallback.format,
    stock_status: raw?.stock_status || "in_stock",
    stock_quantity: raw?.stock_quantity,
    rating: raw?.rating || 5.0,
    reviews_count: raw?.reviews_count || 100,
    features:
      Array.isArray(raw?.features) && raw.features.length > 0 ? raw.features : fallback.features,
    is_popular: typeof raw?.is_popular === "boolean" ? raw.is_popular : false,
    is_pinned: typeof raw?.is_pinned === "boolean" ? raw.is_pinned : false,
    display_order: typeof raw?.display_order === "number" ? raw.display_order : index + 1,
    order_url: orderUrl,
    preview_pdf_url: raw?.preview_pdf_url,
    delivery_info: raw?.delivery_info || fallback.delivery_info,
    isbn: raw?.isbn,
    description: raw?.description || fallback.description,
    target_audience: raw?.target_audience || fallback.target_audience,
    table_of_contents: raw?.table_of_contents,
  };
}

export async function fetchAllBooks(): Promise<BookItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "ormission_books")
      .maybeSingle();

    if (!error && data?.value && Array.isArray(data.value) && data.value.length > 0) {
      return data.value.map((b: any, idx: number) => normalizeBookItem(b, idx));
    }
  } catch (e) {
    console.warn("Could not fetch books from DB, using defaults:", e);
  }
  return DEFAULT_BOOKS;
}

export async function fetchBookById(id: string): Promise<BookItem | null> {
  const books = await fetchAllBooks();
  const found = books.find(
    (b) => String(b.id).toLowerCase() === String(id).toLowerCase()
  );
  if (found) return found;

  // Fallback to DEFAULT_BOOKS match
  const fallback = DEFAULT_BOOKS.find(
    (b) => String(b.id).toLowerCase() === String(id).toLowerCase()
  );
  return fallback || null;
}
