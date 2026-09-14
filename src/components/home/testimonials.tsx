"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionWrapper } from "@/components/global/section-wrapper";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "রাকিব হাসান",
    institution: "চট্টগ্রাম বিশ্ববিদ্যালয় (CU Law)",
    quote:
      "Admission Course করে চট্টগ্রাম বিশ্ববিদ্যালয়ে চান্স পেয়েছি! বিগত ২০ বছরের প্রশ্নব্যাংক এনালাইসিস ও শর্টকাট সত্যিই কোর্সটিকে অসাধারণ করেছে।",
    rating: 5,
    avatar: "/images/hero-student.jpg",
  },
  {
    id: 2,
    name: "নুসরাত জাহান",
    institution: "ঢাকা বিশ্ববিদ্যালয় ('খ' ইউনিট)",
    quote:
      "English Course অনেক সহজভাবে পড়ানো হয়েছে। ওহিদ স্যারের লেকচার ও PDF নোটগুলো এডমিশনে আমার সর্বোচ্চ নম্বর নিশ্চিত করেছে।",
    rating: 5,
    avatar: "/images/hero-student.jpg",
  },
  {
    id: 3,
    name: "ফাহিম আহমেদ",
    institution: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয়",
    quote:
      "নোট আর প্র্যাকটিস শিট অসাধারণ ছিল! মডেল টেস্ট নিয়মিত অংশ নিয়ে নিজের দুর্বলতা কাটিয়ে স্বপ্ন পূরণ করতে পেরেছি।",
    rating: 5,
    avatar: "/images/hero-student.jpg",
  },
  {
    id: 4,
    name: "মারুফ হাসান",
    institution: "গুচ্ছ (GST) মেধা তালিকা ৩৫তম",
    quote:
      "কোচিং ছাড়াই ঘরে বসে Ormission-এর গাইডলাইনে গুচ্ছে সেরা সাবজেক্ট পেয়েছি। সার্বক্ষণিক টেলিগ্রাম সাপোর্ট দারুণ ছিল।",
    rating: 5,
    avatar: "/images/hero-student.jpg",
  },
  {
    id: 5,
    name: "ডা. ফারহানা ইয়াসমিন",
    institution: "ঢাকা মেডিকেল কলেজ (DMC)",
    quote:
      "মেডিকেল বায়োলজির দুর্বোধ্য কনসেপ্টগুলো ডায়াগ্ৰাম ও নেমোনিক দিয়ে একদম সহজ হয়ে গিয়েছিল। Ormission-কে অনেক ধন্যবাদ।",
    rating: 5,
    avatar: "/images/hero-student.jpg",
  },
  {
    id: 6,
    name: "সাদমান ইসলাম",
    institution: "বুয়েট (BUET CSE)",
    quote:
      "পদার্থবিজ্ঞানের ক্যালকুলাস ও শর্টকাট প্র্যাকটিস শিটগুলো বুয়েটে সেরা ১০০-তে জায়গা করে নেওয়ার মূল চাবিকাঠি ছিল।",
    rating: 5,
    avatar: "/images/hero-student.jpg",
  },
];

export function Testimonials() {
  const [page, setPage] = useState(0);
  const cardsPerPage = 3;
  const maxPages = Math.ceil(testimonials.length / cardsPerPage);

  const displayed = testimonials.slice(page * cardsPerPage, (page + 1) * cardsPerPage);

  return (
    <SectionWrapper className="py-12 lg:py-16 bg-surface-secondary/40">
      {/* Title with accent lines matching Reference Mockup: —— শিক্ষার্থীদের মতামত —— */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="w-12 sm:w-20 h-0.5 bg-primary/40 rounded-full" />
        <h2 className="text-2xl sm:text-3xl font-black text-text font-bengali tracking-tight text-center">
          শিক্ষার্থীদের মতামত
        </h2>
        <div className="w-12 sm:w-20 h-0.5 bg-primary/40 rounded-full" />
      </div>

      {/* 3-Card Grid matching Reference Mockup */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayed.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between bg-surface border border-border/80 rounded-2xl p-6 sm:p-7 shadow-soft-card hover:shadow-floating hover:border-primary/40 transition-all duration-300"
          >
            <div>
              {/* 5 Yellow Stars */}
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Student Quote */}
              <p className="text-xs sm:text-sm text-text-muted font-bengali leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Student Avatar + Name + University */}
            <div className="flex items-center gap-3 pt-4 border-t border-border/60">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-primary/25 shrink-0">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text font-bengali leading-tight">
                  {t.name}
                </span>
                <span className="text-xs text-primary font-medium font-bengali mt-0.5">
                  {t.institution}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators / Controls */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: maxPages }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPage(i)}
            className={`transition-all duration-200 cursor-pointer rounded-full ${
              page === i ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-border hover:bg-text-muted"
            }`}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
