import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Megaphone, Bell } from "lucide-react";
import { getLiveNotices } from "@/lib/data/notices";
import { NoticesClient } from "@/components/notices/notices-client";

// ISR: Cache notice board page for 120s for ultra-fast transitions
export const revalidate = 120;

export const metadata: Metadata = {
  title: "অফিশিয়াল নোটিশ বোর্ড ও ঘোষণা | Ormission",
  description:
    "Ormission-এর সকল একাডেমিক ক্লাস রুটিন, পরীক্ষার সময়সূচী, ভর্তি বিজ্ঞপ্তি এবং বিশেষ অফারের অফিসিয়াল নোটিশ বোর্ড।",
  openGraph: {
    title: "অফিশিয়াল নোটিশ বোর্ড ও ঘোষণা | Ormission",
    description: "একাডেমিক ক্লাস রুটিন, পরীক্ষার সময়সূচী এবং ভর্তি বিজ্ঞপ্তি।",
  },
};

export default async function NoticesPage() {
  const notices = await getLiveNotices();

  return (
    <div className="bg-background min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32">
      <div className="container-main space-y-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-text-muted font-bengali"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            হোম
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted/60" />
          <span className="text-primary font-bold">নোটিশ বোর্ড</span>
        </nav>

        {/* Hero Header Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-surface via-surface-secondary/60 to-primary/5 p-6 sm:p-10 lg:p-12 shadow-xs font-bengali">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <Megaphone className="w-3.5 h-3.5" />
              <span>কেন্দ্রীয় নোটিশ বোর্ড ও আপডেট</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-text tracking-tight">
              সকল একাডেমিক ও অফিশিয়াল ঘোষণা
            </h1>

            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              এইচএসসি, এসএসসি ও ভর্তি পরীক্ষার সকল রুটিন, ক্লাস আপডেট এবং বিশেষ অফারের নোটিফিকেশন এক নজরে দেখে নিন।
            </p>
          </div>
        </div>

        {/* Interactive Notice Board Content */}
        <NoticesClient initialNotices={notices} />
      </div>
    </div>
  );
}
