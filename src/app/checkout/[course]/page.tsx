"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Check,
  Tag,
  ArrowLeft,
  CreditCard,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { getCourseBySlug, COURSES, type Course } from "@/lib/data/courses";
import { createClient } from "@/lib/supabase/client";
import { mapDbCourseToAppCourse } from "@/lib/supabase/course-mapper";

interface CheckoutPageProps {
  params: Promise<{ course: string }>;
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const courseSlug = resolvedParams.course;
  const [course, setCourse] = useState<Course>(() => getCourseBySlug(courseSlug) || COURSES[0]);

  useEffect(() => {
    const supabase = createClient();
    async function loadCourse() {
      try {
        const { data: dbCourse, error } = await supabase
          .from("courses")
          .select(`
            *,
            categories:category_id (*),
            instructors:instructor_id (*)
          `)
          .eq("slug", courseSlug)
          .maybeSingle();

        if (!error && dbCourse) {
          setCourse(mapDbCourseToAppCourse(dbCourse));
        }
      } catch (e) {
        console.error("Error loading checkout course:", e);
      }
    }
    loadCourse();
  }, [courseSlug]);

  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket" | "card">("bkash");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "সাদমান ইসলাম",
    phone: "01712345678",
    email: "sadman@example.com",
    agreed: true,
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");

    const code = couponCode.trim().toUpperCase();
    if (code === "ORMISSION10" || code === "FIRST10") {
      const discount = Math.round(course.price * 0.1);
      setDiscountAmount(discount);
      setCouponApplied(true);
    } else if (code === "BUET26" || code === "DMC26") {
      const discount = 500;
      setDiscountAmount(discount);
      setCouponApplied(true);
    } else {
      setCouponError("কুপন কোডটি সঠিক নয় বা মেয়াদ শেষ হয়ে গেছে।");
    }
  };

  const finalPrice = Math.max(0, course.price - discountAmount);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderId = `ORM-${Math.floor(100000 + Math.random() * 900000)}`;
    const txId = `TXN${Date.now().toString().slice(-8)}`;

    setTimeout(() => {
      setLoading(false);
      router.push(
        `/checkout/success?orderId=${orderId}&txId=${txId}&course=${course.slug}&amount=${finalPrice}&method=${paymentMethod}`
      );
    }, 1200);
  };

  return (
    <div className="bg-background min-h-screen py-10 lg:py-16">
      <div className="container-main max-w-5xl">
        {/* Back Link */}
        <Link
          href={`/course/${course.slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary mb-6 transition-colors font-bengali"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>কোর্স বিস্তারিত পাতায় ফিরে যান</span>
        </Link>

        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-text font-bengali tracking-tight">
              নিরাপদ চেকআউট ও কোর্স ভর্তি
            </h1>
            <p className="text-xs text-text-muted font-bengali mt-1">
              SSLCommerz এনক্রিপ্টেড পেমেন্ট গেটওয়ের মাধ্যমে তাৎক্ষণিক ভর্তি সম্পন্ন করুন
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-secondary font-semibold font-bengali bg-secondary/10 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>২৫৬-বিট SSL সুরক্ষিত</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Student Details & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* Student Info Card */}
            <div className="bg-surface rounded-lg border border-border p-6 shadow-xs">
              <h3 className="font-bold text-base text-text font-bengali mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-sans font-bold">
                  ১
                </span>
                <span>শিক্ষার্থীর তথ্য</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text font-bengali mb-1.5">
                    পূর্ণ নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input text-sm font-bengali w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text font-bengali mb-1.5">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input text-sm font-sans w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text font-bengali mb-1.5">
                    ইমেইল ঠিকানা *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input text-sm font-sans w-full"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-surface rounded-lg border border-border p-6 shadow-xs">
              <h3 className="font-bold text-base text-text font-bengali mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-sans font-bold">
                  ২
                </span>
                <span>পেমেন্ট মাধ্যম বেছে নিন</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bkash")}
                  className={`p-4 rounded-lg border text-left transition-all relative ${
                    paymentMethod === "bkash"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-border/80 bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#D12053] font-sans">bKash</span>
                    {paymentMethod === "bkash" && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <span className="text-xs text-text font-bengali font-medium">বিকাশ পেমেন্ট</span>
                  <p className="text-[11px] text-text-muted mt-0.5 font-bengali">তাৎক্ষণিক অটো-অ্যাক্টিভ</p>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("nagad")}
                  className={`p-4 rounded-lg border text-left transition-all relative ${
                    paymentMethod === "nagad"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-border/80 bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#F7941D] font-sans">Nagad</span>
                    {paymentMethod === "nagad" && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <span className="text-xs text-text font-bengali font-medium">নগদ পেমেন্ট</span>
                  <p className="text-[11px] text-text-muted mt-0.5 font-bengali">সহজ ও দ্রুত পেমেন্ট</p>
                </button>

                {/* Rocket */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("rocket")}
                  className={`p-4 rounded-lg border text-left transition-all relative ${
                    paymentMethod === "rocket"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-border/80 bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#8C3494] font-sans">Rocket</span>
                    {paymentMethod === "rocket" && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <span className="text-xs text-text font-bengali font-medium">রকেট পেমেন্ট</span>
                  <p className="text-[11px] text-text-muted mt-0.5 font-bengali">ডাচ-বাংলা মোবাইল ব্যাংকিং</p>
                </button>

                {/* Cards */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-lg border text-left transition-all relative ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-border/80 bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-text font-sans flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      <span>Card</span>
                    </span>
                    {paymentMethod === "card" && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <span className="text-xs text-text font-bengali font-medium">ভিসা / মাস্টারকার্ড</span>
                  <p className="text-[11px] text-text-muted mt-0.5 font-bengali">সকল ব্যাংক কার্ড গ্রহণযোগ্য</p>
                </button>
              </div>

              <div className="p-3 bg-surface-secondary rounded text-xs text-text-muted font-bengali flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
                <span>পেমেন্ট গেটওয়েতে আপনার তথ্য সম্পূর্ণ সুরক্ষিত থাকবে। কোনো পিন বা ওটিপি শেয়ার করবেন না।</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface rounded-lg border border-border p-6 shadow-xs sticky top-24">
              <h3 className="font-bold text-base text-text font-bengali mb-4 pb-3 border-b border-border">
                অর্ডার বিবরণী
              </h3>

              {/* Course Item */}
              <div className="flex gap-3.5 mb-6">
                <div className="relative w-20 h-14 rounded overflow-hidden shrink-0 bg-slate-900 border border-border">
                  <Image
                    src={course.thumbnail || (course as any).thumbnail_url || "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=800&auto=format&fit=crop"}
                    alt={course.titleBn || course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs lg:text-sm text-text font-bengali line-clamp-2 leading-snug">
                    {course.titleBn}
                  </h4>
                  <span className="text-[11px] text-secondary font-bengali font-semibold block mt-1">
                    {course.categoryNameBn}
                  </span>
                </div>
              </div>

              {/* Coupon Form */}
              <div className="border-t border-border pt-4 mb-4">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="কুপন কোড (উদা: ORMISSION10)"
                    value={couponCode}
                    disabled={couponApplied}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="input text-xs font-sans uppercase flex-1"
                  />
                  <button
                    type="submit"
                    disabled={couponApplied || !couponCode.trim()}
                    className="btn btn-outline btn-sm text-xs font-bengali font-semibold px-4"
                  >
                    {couponApplied ? "প্রযুক্ত" : "প্রয়োগ"}
                  </button>
                </form>
                {couponError && (
                  <p className="text-[11px] text-error font-bengali mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{couponError}</span>
                  </p>
                )}
                {couponApplied && (
                  <p className="text-[11px] text-success font-bengali mt-1.5 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>কুপন কোড সফলভাবে যুক্ত হয়েছে!</span>
                  </p>
                )}
              </div>

              {/* Price Calculation Table */}
              <div className="space-y-2.5 text-xs border-t border-border pt-4 mb-6">
                <div className="flex items-center justify-between text-text-muted font-bengali">
                  <span>কোর্স ফি (নিয়মিত)</span>
                  <span className="font-sans line-through">
                    ৳{course.originalPrice.toLocaleString("en-US")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-text-muted font-bengali">
                  <span>ওয়েবসাইট ডিসকাউন্ট</span>
                  <span className="font-sans text-secondary font-medium">
                    -৳{(course.originalPrice - course.price).toLocaleString("en-US")}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-accent font-bengali font-semibold">
                    <span>কুপন ডিসকাউন্ট</span>
                    <span className="font-sans">-৳{discountAmount.toLocaleString("en-US")}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm font-bold text-text font-bengali border-t border-border pt-3">
                  <span>সর্বমোট প্রদেয়</span>
                  <span className="text-xl font-extrabold text-primary font-sans">
                    ৳{finalPrice.toLocaleString("en-US")}
                  </span>
                </div>
              </div>

              {/* Pay CTA */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={loading}
                className="btn btn-primary w-full py-3.5 text-base font-bold font-bengali flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {loading ? "পেমেন্ট গেটওয়েতে রিডাইরেক্ট হচ্ছে..." : `৳${finalPrice.toLocaleString("en-US")} পরিশোধ করুন`}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-text-muted font-bengali mt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                <span>পেমেন্ট পরবর্তী ৪৮ ঘণ্টার মধ্যে শর্তসাপেক্ষ রিফান্ড গ্যারান্টি</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
