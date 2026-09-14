import Link from "next/link";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { SectionWrapper } from "@/components/global/section-wrapper";
import { SectionHeading } from "@/components/global/section-heading";
import { cn } from "@/lib/utils";

const posts = [
  {
    slug: "admission-14-hour-study-routine",
    title: "এডমিশনের জন্য ১৪ ঘণ্টা পড়ার রুটিন ও ঘুমে নিয়ন্ত্রণ আনার উপায়",
    excerpt:
      "কোচিং ছাড়া ঘরে বসেই পূর্ণাঙ্গ এডমিশন সিলেবাস কমপ্লিট করার বৈজ্ঞানিক ১৪ ঘণ্টার স্টাডি রুটিন এবং পড়ার সময় ঘুম দূর করার পরীক্ষিত কৌশল।",
    category: "এডমিশন রুটিন",
    readTime: "৭ মিনিট",
    date: "১২ সেপ্টেম্বর ২০২৬",
  },
  {
    slug: "cu-admission-a-to-z-roadmap",
    title: "চট্টগ্রাম বিশ্ববিদ্যালয় (CU) ভর্তি পরীক্ষা: চান্স পাওয়ার পূর্ণাঙ্গ মাস্টারপ্ল্যান",
    excerpt:
      "CU 'B', 'D' ও আইন বিভাগে চান্স পেতে কীভাবে বিগত ২০ বছরের প্রশ্নব্যাংক সলভ করবেন এবং ইংরেজিতে নিশ্চিত ১৫ মার্ক তুলবেন তার A to Z গাইডলাইন।",
    category: "CU এডমিশন গাইড",
    readTime: "৮ মিনিট",
    date: "১০ সেপ্টেম্বর ২০২৬",
  },
  {
    slug: "memory-retention-study-hacks",
    title: "পড়া ভুলে যাওয়ার ভয় দূর করবেন কীভাবে? পড়া মনে রাখার ৫টি বৈজ্ঞানিক কৌশল",
    excerpt:
      "পড়া একবার পড়েই দীর্ঘমেয়াদে মনে রাখার অ্যাক্টিভ রিকল ও স্পেসড রিপিটেশন টেকনিক এবং কম জিপিএ নিয়ে সফল হওয়ার বিকল্প বিশ্ববিদ্যালয়ের উপায়।",
    category: "স্টাডি হ্যাক্স",
    readTime: "৬ মিনিট",
    date: "০৫ সেপ্টেম্বর ২০২৬",
  },
];

export function BlogPreview() {
  return (
    <SectionWrapper>
      <div className="flex items-center justify-between mb-8 lg:mb-10">
        <SectionHeading
          title="বিশেষ স্টাডি গাইড ও টিপস"
          subtitle="এডমিশন ও বোর্ড পরীক্ষায় টপ করার সেরা কৌশল, রুটিন ও এক্সক্লুসিভ আর্টিকেল"
          centered={false}
          className="mb-0"
        />
        <Link
          href="/blog"
          className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:text-primary-hover transition-colors font-bengali"
        >
          সব গাইড পড়ুন
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={cn(
              "group flex flex-col p-6 rounded-2xl transition-all duration-300",
              "bg-surface border border-border hover:border-primary/40 hover:shadow-lg hover:-translate-y-1"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 font-bengali">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-text-muted font-bengali">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>

            <h3 className="text-base font-bold text-text mb-2.5 font-bengali line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {post.title}
            </h3>
            <p className="text-sm text-text-muted line-clamp-3 mb-5 leading-relaxed font-bengali">
              {post.excerpt}
            </p>

            <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-muted font-bengali">
              <span>{post.date}</span>
              <span className="font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                পড়ুন <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
}
