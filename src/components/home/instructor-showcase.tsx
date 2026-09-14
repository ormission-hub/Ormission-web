import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/global/section-wrapper";
import { SectionHeading } from "@/components/global/section-heading";
import { cn } from "@/lib/utils";

const instructors = [
  {
    name: "ওহিদ রাশেদ (Ohid Rashed)",
    designation: "লিড মেন্টর (এডমিশন ইংলিশ ও গাইডলাইন)",
    institution: "আইন বিভাগ, চট্টগ্রাম বিশ্ববিদ্যালয় (CU)",
    slug: "ohid-rashed",
    courseCount: 12,
    initials: "ওরা",
  },
  {
    name: "ড. আব্দুল্লাহ আল মামুন",
    designation: "সহকারী অধ্যাপক, পদার্থবিজ্ঞান",
    institution: "ঢাকা বিশ্ববিদ্যালয়",
    slug: "abdullah-al-mamun",
    courseCount: 8,
    initials: "আম",
  },
  {
    name: "ড. ফারহানা ইসলাম",
    designation: "সহকারী অধ্যাপক, জীববিজ্ঞান",
    institution: "স্যার সলিমুল্লাহ মেডিকেল কলেজ",
    slug: "farhana-islam",
    courseCount: 5,
    initials: "ফই",
  },
  {
    name: "প্রফেসর কামরুল হাসান",
    designation: "অধ্যাপক, রসায়ন",
    institution: "বুয়েট",
    slug: "kamrul-hasan",
    courseCount: 6,
    initials: "কহ",
  },
  {
    name: "মোঃ রাফিউল ইসলাম",
    designation: "প্রভাষক, গণিত",
    institution: "নটরডেম কলেজ",
    slug: "rafiul-islam",
    courseCount: 10,
    initials: "রই",
  },
];

export function InstructorShowcase() {
  return (
    <SectionWrapper className="bg-surface-secondary">
      <div className="flex items-center justify-between mb-8 lg:mb-10">
        <SectionHeading
          title="আমাদের অভিজ্ঞ মেন্টর ও শিক্ষকবৃন্দ"
          subtitle="চট্টগ্রাম বিশ্ববিদ্যালয়, ঢাকা বিশ্ববিদ্যালয় ও বুয়েটের সেরা মেন্টরদের নিবিড় দিকনির্দেশনা"
          centered={false}
          className="mb-0"
        />
        <Link
          href="/instructors"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          সব দেখুন
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {instructors.map((instructor) => (
          <Link
            key={instructor.slug}
            href={`/instructor/${instructor.slug}`}
            className={cn(
              "group flex flex-col items-center text-center p-5 rounded-2xl transition-all",
              "bg-surface border border-border hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
            )}
            style={{ transitionDuration: "200ms" }}
          >
            {/* Avatar with initials */}
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-base font-bold mb-3 group-hover:scale-105 transition-transform">
              {instructor.initials}
            </div>

            <h3 className="text-sm font-bold text-text mb-1 font-bengali line-clamp-1 group-hover:text-primary transition-colors">
              {instructor.name}
            </h3>
            <p className="text-xs text-text-muted mb-1 line-clamp-1 font-bengali">
              {instructor.designation}
            </p>
            <p className="text-xs text-secondary font-semibold line-clamp-1 font-bengali">
              {instructor.institution}
            </p>
            <p className="text-xs text-text-muted mt-2 font-bengali">
              {instructor.courseCount}টি সক্রিয় কোর্স
            </p>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
}
