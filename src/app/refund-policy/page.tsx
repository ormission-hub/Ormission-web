import Link from "next/link";
import { RefreshCw } from "lucide-react";

export const metadata = {
  title: "রিফান্ড নীতিমালা (Refund Policy) | Ormission",
  description: "কোর্স ক্রয় পরবর্তী রিফান্ড পাওয়ার নিয়মাবলী, শর্ত ও সময়সীমা।",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-background min-h-screen py-10 lg:py-16">
      <div className="container-main max-w-3xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold font-bengali mb-3">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>স্বচ্ছ রিফান্ড পলিসি</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text font-bengali tracking-tight mb-2">
            রিফান্ড নীতিমালা (Refund Policy)
          </h1>
          <p className="text-xs text-text-muted font-sans">
            সর্বশেষ পরিমার্জন: ০১ সেপ্টেম্বর, ২০২৬
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 lg:p-10 space-y-6 text-sm lg:text-base text-text font-bengali leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-text mb-2">১. ৪৮ ঘণ্টার শর্তসাপেক্ষ মানি-ব্যাক</h2>
            <p className="text-text-muted">
              যেকোনো রেকর্ডেড কোর্সে ভর্তির ৪৮ ঘণ্টার মধ্যে যদি আপনি কোনো গুরুতর কারিগরি সমস্যায় পড়েন যা আমাদের সাপোর্ট টিম সমাধান করতে ব্যর্থ হয়, অথবা কোর্সের আউটলাইনে বর্ণিত কন্টেন্টের সাথে বাস্তবে অমিল থাকে, তবে আপনি পূর্ণ রিফান্ডের আবেদন করতে পারবেন।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">২. যেক্ষেত্রে রিফান্ড প্রযোজ্য নয়</h2>
            <ul className="list-disc list-inside text-text-muted space-y-1.5 mt-2">
              <li>কোর্সের ২০% বা তার বেশি ভিডিও দেখা সম্পন্ন হয়ে গেলে।</li>
              <li>কোর্সের সাথে সংযুক্ত কোনো লেকচার শিট বা রিসোর্স PDF ডাউনলোড করা হলে।</li>
              <li>ভর্তির ৪৮ ঘণ্টা পার হয়ে যাওয়ার পর আবেদন করা হলে।</li>
              <li>ব্যক্তিগত মানসিক সিদ্ধান্ত পরিবর্তন বা ভুল ধারণার কারণে রিফান্ড চাওয়া হলে।</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">৩. রিফান্ডের প্রক্রিয়া ও সময়কাল</h2>
            <p className="text-text-muted">
              রিফান্ড অনুমোদনের পর সংশ্লিষ্ট পেমেন্ট গেটওয়ের মাধ্যমে (বিকাশ/নগদ/কার্ড) ৫ থেকে ৭ কার্যদিবসের মধ্যে টাকা আপনার মূল অ্যাকাউন্টে ফেরত প্রদান করা হবে।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">৪. রিফান্ডের আবেদন পাঠানোর উপায়</h2>
            <p className="text-text-muted">
              রিফান্ডের জন্য আপনার অর্ডার আইডি ও মোবাইল নম্বর উল্লেখ করে ইমেইল করুন:{" "}
              <a href="mailto:refund@ormission.com" className="text-primary font-sans font-semibold underline">
                refund@ormission.com
              </a>{" "}
              অথবা হেল্পলাইনে কল করুন।
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
