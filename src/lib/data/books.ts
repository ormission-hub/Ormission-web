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

// No mock books - strictly empty array so nothing fake is shown if DB has no books
export const DEFAULT_BOOKS: BookItem[] = [];

// Helper to normalize book data and ensure valid fields without inventing mock data
export function normalizeBookItem(raw: any, index = 0): BookItem {
  const title = String(raw?.title || "").trim();
  const id = String(raw?.id || `book-${index + 1}`);

  // Guaranteed valid Rokomari / Shop Order URL
  const orderUrl =
    raw?.order_url && String(raw.order_url).trim().length > 0
      ? String(raw.order_url).trim()
      : title
      ? `https://www.rokomari.com/book/search?term=${encodeURIComponent(title)}`
      : "";

  return {
    id,
    title: title || "বই",
    subtitle: raw?.subtitle || "",
    author: raw?.author || "অরমিশন একাডেমি টিম",
    edition: raw?.edition || "১ম সংস্করণ ২০২৬",
    publisher: raw?.publisher || "অরমিশন পাবলিকেশন্স",
    category: raw?.category || "সাধারণ",
    category_id: raw?.category_id,
    category_slug: raw?.category_slug,
    price: typeof raw?.price === "number" ? raw.price : 0,
    original_price:
      typeof raw?.original_price === "number"
        ? raw.original_price
        : typeof raw?.price === "number"
        ? raw.price
        : 0,
    cover_image: raw?.cover_image ? String(raw.cover_image).trim() : undefined,
    pages: raw?.pages || "",
    format: raw?.format || "প্রিন্টেড বুক",
    stock_status: raw?.stock_status || "in_stock",
    stock_quantity: raw?.stock_quantity,
    rating: typeof raw?.rating === "number" ? raw.rating : 5.0,
    reviews_count: typeof raw?.reviews_count === "number" ? raw.reviews_count : 0,
    features: Array.isArray(raw?.features) ? raw.features : [],
    is_popular: typeof raw?.is_popular === "boolean" ? raw.is_popular : false,
    is_pinned: typeof raw?.is_pinned === "boolean" ? raw.is_pinned : false,
    display_order: typeof raw?.display_order === "number" ? raw.display_order : index + 1,
    order_url: orderUrl,
    preview_pdf_url: raw?.preview_pdf_url || "",
    delivery_info: raw?.delivery_info || "সারাদেশে ক্যাশ অন ডেলিভারি ২-৩ কার্যদিবসে",
    isbn: raw?.isbn || "",
    description: raw?.description || "",
    target_audience: raw?.target_audience || "",
    table_of_contents: Array.isArray(raw?.table_of_contents) ? raw.table_of_contents : [],
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

    if (!error && data?.value && Array.isArray(data.value)) {
      return data.value.map((b: any, idx: number) => normalizeBookItem(b, idx));
    }
  } catch (e) {
    console.warn("Could not fetch books from DB:", e);
  }
  return [];
}

export async function fetchBookById(id: string): Promise<BookItem | null> {
  const books = await fetchAllBooks();
  const found = books.find(
    (b) => String(b.id).toLowerCase() === String(id).toLowerCase()
  );
  return found || null;
}
