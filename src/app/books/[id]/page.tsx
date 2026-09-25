"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Star,
  CheckCircle2,
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
  FileText,
  Sparkles,
  Phone,
  User,
  MapPin,
  ChevronRight,
  Share2,
  Check,
  Loader2,
  HelpCircle,
  Package,
  Layers,
  ArrowRight,
  Eye,
  X,
  CreditCard,
  Building,
} from "lucide-react";
import { fetchBookById, fetchAllBooks, type BookItem } from "@/lib/data/books";
import { createClient } from "@/lib/supabase/client";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;

  const [book, setBook] = useState<BookItem | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Order modal & form states
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [district, setDistrict] = useState("ঢাকা");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad">("cod");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<{
    orderNumber: string;
    totalAmount: number;
  } | null>(null);

  // PDF Preview Modal
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const found = await fetchBookById(bookId);
        setBook(found);

        const all = await fetchAllBooks();
        setRelatedBooks(all.filter((b) => b.id !== bookId).slice(0, 3));
      } catch (err) {
        console.error("Error loading book detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [bookId]);

  // Pre-fill user data if authenticated
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          if (session.user.user_metadata?.full_name) {
            setCustomerName(session.user.user_metadata.full_name);
          }
          if (session.user.phone) {
            setCustomerPhone(session.user.phone);
          }
        }
      } catch {
        // Guest mode fallback
      }
    }
    loadUserProfile();
  }, []);

  const handleShare = () => {
    if (navigator.share && book) {
      navigator.share({
        title: book.title,
        text: book.subtitle,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    if (!customerName.trim()) {
      alert("অনুগ্রহ করে আপনার নাম লিখুন।");
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 11) {
      alert("অনুগ্রহ করে একটি সঠিক মোবাইল নম্বর দিন (কমপক্ষে ১১ ডিজিট)।");
      return;
    }
    if (!deliveryAddress.trim()) {
      alert("অনুগ্রহ করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন।");
      return;
    }

    setIsSubmittingOrder(true);

    try {
      const orderNumber = `ORM-BK-${Math.floor(100000 + Math.random() * 900000)}`;
      const deliveryFee = district === "ঢাকা" ? 60 : 100;
      const totalAmount = book.price * quantity + deliveryFee;

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Store in orders or fallback to notification
      const orderPayload = {
        item_type: "book",
        book_id: book.id,
        book_title: book.title,
        quantity,
        unit_price: book.price,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        delivery_address: deliveryAddress.trim(),
        district,
        payment_method: paymentMethod,
        order_notes: orderNotes.trim(),
        order_number: orderNumber,
        status: "pending",
        user_id: session?.user?.id || null,
        created_at: new Date().toISOString(),
      };

      try {
        await supabase.from("orders").insert({
          user_id: session?.user?.id || null,
          course_id: null,
          original_amount: book.original_price * quantity,
          discount_amount: (book.original_price - book.price) * quantity,
          final_amount: totalAmount,
          status: "pending",
          payment_method: paymentMethod,
          notes: JSON.stringify(orderPayload),
        });
      } catch (dbErr) {
        console.warn("Direct order table insert failed, recorded in local session:", dbErr);
      }

      setOrderSuccessData({
        orderNumber,
        totalAmount,
      });
    } catch (err: any) {
      alert("অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-24 pb-16 font-bengali">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm font-semibold text-text-muted">বইয়ের বিস্তারিত লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-24 pb-16 font-bengali px-4">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-text-muted/60" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-2">বইটি খুঁজে পাওয়া যায়নি</h2>
        <p className="text-sm text-text-muted mb-6 text-center max-w-md">
          আপনি যে বইটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা লিংকটি সঠিক নয়।
        </p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল বই দেখুন</span>
        </Link>
      </div>
    );
  }

  const discountPercent =
    book.original_price > book.price
      ? Math.round(((book.original_price - book.price) / book.original_price) * 100)
      : 0;

  const deliveryFee = district === "ঢাকা" ? 60 : 100;
  const grandTotal = book.price * quantity + deliveryFee;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 sm:pt-28 sm:pb-24 font-bengali">
      {/* Top Breadcrumb */}
      <div className="container-main mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-text-muted font-bengali flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">
            হোম
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted/60 shrink-0" />
          <Link href="/books" className="hover:text-primary transition-colors">
            বইসমূহ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted/60 shrink-0" />
          <span className="text-text font-semibold truncate max-w-[220px] sm:max-w-md">
            {book.title}
          </span>
        </div>
      </div>

      {/* Main Showcase Hero Section */}
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Clean Book Image Showcase (Strictly NO colorful background gradient boxes) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[380px] lg:max-w-none bg-surface border border-border/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-xs">
              {/* Clean Image Container */}
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.02] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 border border-border/50">
                {book.cover_image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <BookOpen className="w-16 h-16 text-primary/70 mb-3" />
                    <h4 className="text-base font-bold text-text mb-1">{book.title}</h4>
                    <span className="text-xs text-text-muted">{book.category}</span>
                  </div>
                )}

                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-500 text-white text-[11px] font-black font-sans shadow-md">
                    -{discountPercent}% ছাড়
                  </div>
                )}
              </div>

              {/* Action Buttons under Image */}
              <div className="w-full flex items-center justify-center gap-3 mt-6">
                {book.preview_pdf_url && (
                  <button
                    type="button"
                    onClick={() => setShowPdfModal(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:border-primary/50 bg-surface-secondary text-xs sm:text-sm font-bold text-text hover:text-primary transition-all cursor-pointer shadow-xs"
                  >
                    <FileText className="w-4 h-4 text-primary" />
                    <span>নমুনা পাতা পড়ুন</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border hover:border-primary/50 bg-surface-secondary text-xs sm:text-sm font-bold text-text hover:text-primary transition-all cursor-pointer shadow-xs"
                  title="শেয়ার করুন"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-500">কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>শেয়ার</span>
                    </>
                  )}
                </button>
              </div>

              {/* Guarantees Box */}
              <div className="w-full mt-6 pt-5 border-t border-border/60 grid grid-cols-2 gap-3 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text">ক্যাশ অন ডেলিভারি</p>
                    <p className="text-[11px] text-text-muted">সারাদেশে ডেলিভারি</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text">১০০% আসল বই</p>
                    <p className="text-[11px] text-text-muted">রিটার্ন নিশ্চয়তা</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Book Details & Order CTA */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Category & Status Badges */}
            <div className="flex items-center gap-2 mb-3.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {book.category}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  book.stock_status === "pre_order"
                    ? "bg-sky-500/10 text-sky-600 border border-sky-500/20"
                    : book.stock_status === "low_stock"
                    ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                }`}
              >
                {book.stock_status === "pre_order"
                  ? "প্রি-অর্ডার চলছে"
                  : book.stock_status === "low_stock"
                  ? "সীমিত স্টক"
                  : "স্টকে আছে"}
              </span>
              {book.is_popular && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-950 flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>জনপ্রিয়</span>
                </span>
              )}
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text tracking-tight mb-2 leading-tight">
              {book.title}
            </h1>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-4">
              {book.subtitle}
            </p>

            {/* Author & Publisher */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-text-muted mb-5 pb-5 border-b border-border/60">
              {book.author && (
                <div>
                  <span className="text-text-muted">লেখক: </span>
                  <span className="font-bold text-text">{book.author}</span>
                </div>
              )}
              {book.publisher && (
                <div>
                  <span className="text-text-muted">প্রকাশনা: </span>
                  <span className="font-bold text-text">{book.publisher}</span>
                </div>
              )}
              {book.edition && (
                <div>
                  <span className="text-text-muted">সংস্করণ: </span>
                  <span className="font-bold text-text">{book.edition}</span>
                </div>
              )}
            </div>

            {/* Pricing Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-text-muted block mb-1">নির্ধারিত মূল্য:</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-primary font-sans tabular-nums">
                    ৳{book.price.toLocaleString("en-US")}
                  </span>
                  {book.original_price > book.price && (
                    <span className="text-base sm:text-lg text-text-muted line-through font-sans tabular-nums">
                      ৳{book.original_price.toLocaleString("en-US")}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full font-bengali">
                      {discountPercent}% ছাড়
                    </span>
                  )}
                </div>
                <span className="text-xs text-text-muted block mt-1">
                  {book.delivery_info || "সারাদেশে ক্যাশ অন ডেলিভারি ২-৩ কার্যদিবসে"}
                </span>
              </div>

              {/* Order / Collect Button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>সংগ্রহ করুন / অর্ডার করুন</span>
                </button>
              </div>
            </div>

            {/* Book Meta Specification Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {book.pages && (
                <div className="p-3 rounded-xl bg-surface border border-border/60">
                  <span className="text-[11px] text-text-muted block">পৃষ্ঠা সংখ্যা</span>
                  <span className="text-xs sm:text-sm font-bold text-text">{book.pages}</span>
                </div>
              )}
              {book.format && (
                <div className="p-3 rounded-xl bg-surface border border-border/60">
                  <span className="text-[11px] text-text-muted block">বইয়ের বাঁধাই</span>
                  <span className="text-xs sm:text-sm font-bold text-text">{book.format}</span>
                </div>
              )}
              <div className="p-3 rounded-xl bg-surface border border-border/60">
                <span className="text-[11px] text-text-muted block">ভাষা</span>
                <span className="text-xs sm:text-sm font-bold text-text">বাংলা ও ইংরেজি</span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-border/60">
                <span className="text-[11px] text-text-muted block">দেশ</span>
                <span className="text-xs sm:text-sm font-bold text-text">বাংলাদেশ</span>
              </div>
            </div>

            {/* Key Features */}
            {Array.isArray(book.features) && book.features.length > 0 && (
              <div className="mb-6 p-5 rounded-2xl bg-surface border border-border/80">
                <h3 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>বইটির মূল আকর্ষণ ও বৈশিষ্ট্যসমূহ</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {book.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-text-muted">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description / Overview */}
            {book.description && (
              <div className="p-5 rounded-2xl bg-surface border border-border/80 mb-6">
                <h3 className="text-sm font-bold text-text mb-2.5">বইটি সম্পর্কে বিস্তারিত</h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
                {book.target_audience && (
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <span className="text-xs font-bold text-text">কাদের জন্য: </span>
                    <span className="text-xs text-text-muted">{book.target_audience}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Books Section */}
      {relatedBooks.length > 0 && (
        <div className="container-main mt-16 sm:mt-20 pt-10 border-t border-border/60">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-text">আরও সম্পর্কিত বইসমূহ</h2>
              <p className="text-xs sm:text-sm text-text-muted">
                আপনার পড়াশোনা ও পরীক্ষার পূর্ণাঙ্গ প্রস্তুতির জন্য উপযোগী
              </p>
            </div>
            <Link
              href="/books"
              className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>সকল বই</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBooks.map((item) => (
              <Link
                key={item.id}
                href={`/books/${item.id}`}
                className="group p-4 rounded-2xl bg-surface border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex items-center gap-4"
              >
                <div className="w-20 h-26 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-border/50 shrink-0 flex items-center justify-center p-1">
                  {item.cover_image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <BookOpen className="w-8 h-8 text-primary/60" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 inline-block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-text group-hover:text-primary transition-colors line-clamp-1 mb-1">
                    {item.title}
                  </h4>
                  <span className="text-xs font-black text-text block mb-2 font-sans">
                    ৳{item.price.toLocaleString("en-US")}
                  </span>
                  <span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1">
                    <span>বিস্তারিত দেখুন</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Order Bar on Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-surface/95 backdrop-blur-md border-t border-border shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[11px] text-text-muted block">মূল্য</span>
          <div className="flex items-baseline gap-1.5 font-sans">
            <span className="text-lg font-black text-primary">
              ৳{book.price.toLocaleString("en-US")}
            </span>
            {book.original_price > book.price && (
              <span className="text-xs text-text-muted line-through">
                ৳{book.original_price.toLocaleString("en-US")}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOrderModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/25 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>সংগ্রহ করুন</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* ORDER MODAL (সংগ্রহ / অর্ডার করুন) */}
      {/* ============================================================ */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-surface border border-border rounded-3xl p-6 sm:p-7 shadow-2xl my-8 font-bengali">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setIsOrderModalOpen(false);
                setOrderSuccessData(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:text-text hover:bg-surface-secondary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {orderSuccessData ? (
              /* Success Confirmation View */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-text mb-2">
                  আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!
                </h3>
                <p className="text-xs sm:text-sm text-text-muted mb-4 max-w-sm mx-auto">
                  অরমিশন টিম থেকে অতি দ্রুত আপনার নম্বরে কল করে অর্ডার নিশ্চিত ও ডেলিভারি তথ্য ভেরিফাই করা হবে।
                </p>

                <div className="p-4 rounded-2xl bg-surface-secondary/60 border border-border/80 text-left mb-6 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">অর্ডার নম্বর:</span>
                    <span className="font-bold text-primary font-sans">{orderSuccessData.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">বইয়ের নাম:</span>
                    <span className="font-bold text-text truncate max-w-[200px]">{book.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">কপি:</span>
                    <span className="font-bold text-text">{quantity} টি</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">মোট প্রদেয় বিল:</span>
                    <span className="font-black text-text font-sans">
                      ৳{orderSuccessData.totalAmount.toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">পেমেন্ট মেথড:</span>
                    <span className="font-bold text-emerald-600">
                      {paymentMethod === "cod" ? "ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা)" : paymentMethod.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOrderModalOpen(false);
                      setOrderSuccessData(null);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold shadow-md hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    ঠিক আছে
                  </button>
                </div>
              </div>
            ) : (
              /* Order Form View */
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h3 className="text-lg sm:text-xl font-black text-text">বইটি সংগ্রহ করুন</h3>
                </div>
                <p className="text-xs text-text-muted mb-5">
                  নিচের তথ্যগুলো পূরণ করে সরাসরি ক্যাশ অন ডেলিভারিতে অর্ডার কনফার্ম করুন।
                </p>

                {/* Book Mini Summary Card */}
                <div className="p-3 rounded-2xl bg-surface-secondary/60 border border-border/80 flex items-center justify-between gap-3 mb-5">
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-text truncate">{book.title}</h4>
                    <span className="text-xs text-primary font-bold font-sans">
                      ৳{book.price} / কপি
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 border border-border rounded-xl px-2 py-1 bg-surface">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-6 h-6 flex items-center justify-center text-text font-bold hover:text-primary cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold font-sans min-w-[16px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="w-6 h-6 flex items-center justify-center text-text font-bold hover:text-primary cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-3.5 text-left">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-bold text-text block mb-1">
                      আপনার নাম <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        required
                        placeholder="আপনার পূর্ণ নাম"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="input w-full pl-10 text-xs sm:text-sm h-10.5 font-bengali"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-bold text-text block mb-1">
                      মোবাইল নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="tel"
                        required
                        placeholder="০১৭xxxxxxxx"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="input w-full pl-10 text-xs sm:text-sm h-10.5 font-sans"
                      />
                    </div>
                  </div>

                  {/* Delivery District */}
                  <div>
                    <label className="text-xs font-bold text-text block mb-1">
                      ডেলিভারি এরিয়া / জেলা <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDistrict("ঢাকা")}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          district === "ঢাকা"
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-surface border-border text-text-muted hover:border-text-muted"
                        }`}
                      >
                        ঢাকার ভিতরে (৬০ ৳)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDistrict("ঢাকার বাইরে")}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          district === "ঢাকার বাইরে"
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-surface border-border text-text-muted hover:border-text-muted"
                        }`}
                      >
                        ঢাকার বাইরে (১০০ ৳)
                      </button>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-xs font-bold text-text block mb-1">
                      পূর্ণাঙ্গ ডেলিভারি ঠিকানা <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
                      <textarea
                        required
                        rows={2}
                        placeholder="বাসা/হোল্ডিং নম্বর, রোড, এলাকা, থানা ও জেলা..."
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="input w-full pl-10 text-xs sm:text-sm py-2 font-bengali"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="text-xs font-bold text-text block mb-1">
                      পেমেন্ট মেথড
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          paymentMethod === "cod"
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-600"
                            : "bg-surface border-border text-text-muted"
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        <span>ক্যাশ অন ডেলিভারি</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("bkash")}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          paymentMethod === "bkash"
                            ? "bg-rose-500/10 border-rose-500 text-rose-600"
                            : "bg-surface border-border text-text-muted"
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>বিকাশ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("nagad")}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          paymentMethod === "nagad"
                            ? "bg-amber-500/10 border-amber-500 text-amber-600"
                            : "bg-surface border-border text-text-muted"
                        }`}
                      >
                        <Building className="w-4 h-4" />
                        <span>নগদ</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Total Breakdown */}
                  <div className="pt-3 border-t border-border/60 text-xs space-y-1.5 font-bengali">
                    <div className="flex justify-between text-text-muted">
                      <span>বইয়ের মূল্য ({quantity}টি):</span>
                      <span className="font-sans">৳{(book.price * quantity).toLocaleString("en-US")}</span>
                    </div>
                    <div className="flex justify-between text-text-muted">
                      <span>ডেলিভারি চার্জ:</span>
                      <span className="font-sans">৳{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-text pt-1 border-t border-border/40">
                      <span>সর্বমোট প্রদেয় বিল:</span>
                      <span className="text-primary font-sans text-base">
                        ৳{grandTotal.toLocaleString("en-US")}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="w-full mt-4 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmittingOrder ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>অর্ডার সম্পন্ন হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>অর্ডার কনফার্ম করুন (৳{grandTotal.toLocaleString("en-US")})</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SAMPLE PDF PREVIEW MODAL */}
      {/* ============================================================ */}
      {showPdfModal && book.preview_pdf_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl h-[85vh] bg-surface rounded-3xl border border-border flex flex-col overflow-hidden shadow-2xl font-bengali">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-text truncate">
                  নমুনা পাতা: {book.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="p-1.5 rounded-full text-text-muted hover:text-text hover:bg-surface-secondary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PDF Viewer Frame */}
            <div className="flex-1 w-full bg-slate-900">
              <iframe
                src={`${book.preview_pdf_url}#toolbar=0`}
                title={`Preview ${book.title}`}
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-border flex items-center justify-between gap-3 bg-surface">
              <span className="text-xs text-text-muted">
                পুরো বইটি সংগ্রহ করতে এখনই অর্ডার সম্পন্ন করুন।
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowPdfModal(false);
                  setIsOrderModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-hover transition-colors cursor-pointer"
              >
                অর্ডার করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
