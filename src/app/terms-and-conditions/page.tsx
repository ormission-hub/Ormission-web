import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata = {
  title: "শর্তাবলী ও নীতিমালা (Terms & Conditions) | Ormission",
  description: "অর্মিশন ব্যবহারের সাধারণ নিয়মাবলী ও আইনি বাধ্যবাধকতা।",
};

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen py-10 lg:py-16">
      <div className="container-main max-w-3xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold font-bengali mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>আইনি বিধিমালা</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text font-bengali tracking-tight mb-2">
            ব্যবহারের শর্তাবলী (Terms & Conditions)
          </h1>
          <p className="text-xs text-text-muted font-sans">
            সর্বশেষ পরিমার্জন: ০১ সেপ্টেম্বর, ২০২৬
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 lg:p-10 space-y-6 text-sm lg:text-base text-text font-bengali leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-text mb-2">১. প্ল্যাটফর্ম ব্যবহারের সম্মতি</h2>
            <p className="text-text-muted">
              অর্মিশন ওয়েবসাইট বা মোবাইল অ্যাপ্লিকেশন ব্যবহার করে যেকোনো কোর্সে নথিভুক্ত হলে আপনি এই শর্তাবলীর প্রতি পূর্ণ সম্মতি জ্ঞাপন করছেন।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">২. অ্যাকাউন্ট ও পাসওয়ার্ড নিরাপত্তা</h2>
            <p className="text-text-muted">
              প্রতিটি অ্যাকাউন্ট ব্যক্তিগত। একটি অ্যাকাউন্ট একাধিক ব্যক্তির সাথে শেয়ার করা, আইডি ভাড়া দেওয়া বা অন্য কোনো অননুমোদিত ব্যক্তির সাথে ক্রেডেনশিয়াল ভাগাভাগি করা কঠোরভাবে নিষিদ্ধ। এমন ঘটনা শনাক্ত হলে অ্যাকাউন্ট স্থায়ীভাবে বাতিল করা হতে পারে।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">৩. মেধা সম্পদ ও কপিরাইট আইন</h2>
            <p className="text-text-muted">
              অর্মিশনের সকল ভিডিও লেকচার, অডিও, লেকচার শিট, হ্যান্ডনোট এবং কন্টেন্ট বাংলাদেশ কপিরাইট আইনের অধীনে সুরক্ষিত। অনুমতি ছাড়া কোনো কন্টেন্ট স্ক্রিন রেকর্ড, ডাউনলোড করে পুনরুৎপাদন, বিক্রি বা সামাজিক যোগাযোগ মাধ্যমে বিতরণ আইনত দণ্ডনীয় অপরাধ।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">৪. পরিবর্তন ও সংশোধন</h2>
            <p className="text-text-muted">
              অর্মিশন কর্তৃপক্ষ যেকোনো সময় এই শর্তাবলীতে পরিবর্তন আনার অধিকার সংরক্ষণ করে। সংশোধিত নিয়মাবলী ওয়েবসাইটে প্রকাশের সাথে সাথে কার্যকর হবে।
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
