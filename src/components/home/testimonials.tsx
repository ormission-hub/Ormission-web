"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star, CheckCircle2 } from "lucide-react";
import { SectionWrapper } from "@/components/global/section-wrapper";
import { SectionHeading } from "@/components/global/section-heading";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "সানজিদা জাহান",
    batch: "চট্টগ্রাম বিশ্ববিদ্যালয় — আইন বিভাগ (CU Law, মেধা তালিকায় ১৭তম)",
    course: "CU এডমিশন English স্পেশাল ও প্রশ্নব্যাংক সলভিং ব্যাচ",
    review:
      "এডমিশন ইংরেজিতে যে ১০টি টপিক পড়লে ১৫ মার্ক নিশ্চিত হয় এবং বিগত ২০ বছরের প্রশ্নব্যাংক শর্টকাট এনালাইসিস—এই টেকনিকগুলো না জানলে চবি আইন বিভাগে চান্স পাওয়া আমার জন্য অসম্ভব হতো। ওহিদ স্যারের গাইডলাইন ও ১৪ ঘণ্টার স্টাডি রুটিনই আমার জীবন বদলে দিয়েছে।",
    rating: 5,
  },
  {
    id: 2,
    name: "মারুফ হাসান",
    batch: "গুচ্ছ (GST) ভর্তি পরীক্ষায় ৯০+ স্কোর (মেধা তালিকায় ৩৫তম)",
    course: "কোচিং ছাড়া ঘরে বসে এডমিশন সেলফ-স্টাডি ব্যাচ",
    review:
      "ঢাকায় গিয়ে নামী কোচিংয়ে লাখ টাকা খরচ করার সামর্থ্য আমাদের পরিবারের ছিল না। ঘরে বসে Ormission-এর প্রশ্নব্যাংক এনালাইসিস, ঘুমে নিয়ন্ত্রণ আনার টেকনিক ও সার্বক্ষণিক টেলিগ্রাম মেন্টরশিপ পেয়েই আমি গুচ্ছে সেরা সাবজেক্ট নিশ্চিত করতে পেরেছি।",
    rating: 5,
  },
  {
    id: 3,
    name: "তানভীর মাহমুদ",
    batch: "ঢাকা বিশ্ববিদ্যালয় 'খ' ইউনিট (ব্যাচ '২৬)",
    course: "এডমিশন সাধারণ জ্ঞান, বাংলা ও লিখিত মাস্টারকোর্স",
    review:
      "মুখস্থের বদলে যৌক্তিক কনসেপ্ট ক্লিয়ারিং এবং পরীক্ষায় সময় বাঁচানোর নির্ভুল টেকনিক Ormission-কে অন্যান্য প্ল্যাটফর্ম থেকে আলাদা করে। বিশেষ করে পরীক্ষার ভীতি দূর করা ও পড়া মনে রাখার বৈজ্ঞানিক কৌশলগুলো দারুণ কাজে দিয়েছে।",
    rating: 5,
  },
  {
    id: 4,
    name: "ডা. ফারহানা ইয়াসমিন",
    batch: "ঢাকা মেডিকেল কলেজ (ব্যাচ '২৫)",
    course: "মেডিকেল জীববিজ্ঞান সম্পূর্ণ কনসেপ্ট ব্যাচ",
    review:
      "মেডিকেল জীববিজ্ঞানে বোটানি ও জুলজির দুর্বোধ্য টার্মগুলো Ormission-এর ডায়াগ্রাম ও নেমোনিক ব্যাখ্যার মাধ্যমে একদম সহজ হয়ে গিয়েছিল। মুখস্থের বদলে গভীর কনসেপ্ট ক্লিয়ার হওয়াতেই মেডিকেলে চান্স পাওয়া সম্ভব হয়েছে।",
    rating: 5,
  },
  {
    id: 5,
    name: "সাদমান ইসলাম",
    batch: "বুয়েট CSE (ব্যাচ '২৫)",
    course: "বুয়েট পদার্থবিজ্ঞান ও উচ্চতর গণিত স্পেশাল ব্যাচ",
    review:
      "পদার্থবিজ্ঞানের জটিল মেকানিক্স ও ক্যালকুলাসের টাইপভিত্তিক শর্টকাট প্র্যাকটিস শিটগুলো বুয়েটে শীর্ষ ১০০-তে জায়গা করে নিতে আমার সবচেয়ে বড় শক্তি হিসেবে কাজ করেছে। Ormission-এর মেন্টরদের প্রতি আমি কৃতজ্ঞ।",
    rating: 5,
  },
  {
    id: 6,
    name: "রাফিয়া সুলতানা",
    batch: "HSC গোল্ডেন GPA-5 (মানবিক শাখা)",
    course: "HSC মানবিক Top 300+ MCQ ও ফাইনাল সাজেশন",
    review:
      "সমাজবিজ্ঞান ও সমাজকর্মের অধ্যায়ভিত্তিক Top 300+ MCQ সলভ করে বোর্ডে প্রায় সব প্রশ্ন হুবহু কমন পেয়েছিলাম। প্রতিটি উত্তরের সঠিক ব্যাখ্যা ও এক্সক্লুসিভ সাজেশন শিট আমাকে বোর্ডে এ+ এনে দিয়েছে।",
    rating: 5,
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;

  const next = () => setCurrent((prev) => (prev + 1) % total);
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);

  return (
    <SectionWrapper>
      <SectionHeading
        title="শিক্ষার্থীদের সাফল্যের গল্প"
        subtitle="চট্টগ্রাম বিশ্ববিদ্যালয়, ঢাকা বিশ্ববিদ্যালয়, মেডিকেল ও বুয়েটে চান্স পাওয়া এবং বোর্ডে টপ করা শিক্ষার্থীদের মুখে শুনুন Ormission-এর অভিজ্ঞতা"
      />

      <div className="max-w-3xl mx-auto">
        {/* Testimonial card */}
        <div className="relative bg-surface border border-border/80 rounded-2xl p-7 lg:p-10 shadow-lg shadow-primary/5">
          <div className="flex items-center justify-between mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Quote className="w-5 h-5" />
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>

          <p className="text-text text-base lg:text-lg leading-relaxed mb-8 font-bengali">
            &ldquo;{testimonials[current].review}&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-border">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-base font-bold text-text font-bengali">
                  {testimonials[current].name}
                </p>
                <CheckCircle2 className="w-4 h-4 text-secondary fill-secondary/20" />
              </div>
              <p className="text-xs text-text-muted font-bengali mt-0.5">
                <strong className="text-primary font-semibold">{testimonials[current].batch}</strong> · {testimonials[current].course}
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="p-2 rounded-xl bg-surface-secondary text-text-muted hover:text-text hover:bg-border transition-colors border border-border"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-bold text-text-muted px-2 tabular-nums">
                {current + 1} / {total}
              </span>

              <button
                onClick={next}
                className="p-2 rounded-xl bg-surface-secondary text-text-muted hover:text-text hover:bg-border transition-colors border border-border"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
