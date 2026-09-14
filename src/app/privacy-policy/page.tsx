import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "গোপনীয়তা নীতি (Privacy Policy) | Ormission",
  description: "অর্মিশন প্ল্যাটফর্মে শিক্ষার্থীদের ব্যক্তিগত তথ্য সংরক্ষণ ও নিরাপত্তার নীতিমালা।",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen py-10 lg:py-16">
      <div className="container-main max-w-3xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold font-bengali mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>নিরাপত্তা ও গোপনীয়তা</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text font-bengali tracking-tight mb-2">
            গোপনীয়তা নীতি (Privacy Policy)
          </h1>
          <p className="text-xs text-text-muted font-sans">
            সর্বশেষ পরিমার্জন: ০১ সেপ্টেম্বর, ২০২৬
          </p>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 lg:p-10 space-y-6 text-sm lg:text-base text-text font-bengali leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-text mb-2">১. তথ্যের সংগ্রহ ও ব্যবহার</h2>
            <p className="text-text-muted">
              অর্মিশন-এ অ্যাকাউন্ট খোলা বা কোর্স ক্রয়ের সময় আমরা আপনার নাম, মোবাইল নম্বর, ইমেইল ঠিকানা এবং শিক্ষা প্রতিষ্ঠানের তথ্য সংগ্রহ করি। এই তথ্য শুধুমাত্র আপনার অ্যাকাউন্ট নিরাপত্তা, কোর্স অ্যাক্সেস নিশ্চিতকরণ এবং সাপোর্ট প্রদানের উদ্দেশ্যে ব্যবহৃত হয়।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">২. পেমেন্ট তথ্যের নিরাপত্তা</h2>
            <p className="text-text-muted">
              আমরা কোনো প্রকার ক্রেডিট/ডেবিট কার্ড বা মোবাইল ব্যাংকিংয়ের পিন/ওটিপি আমাদের সার্ভারে সংরক্ষণ করি না। সকল আর্থিক লেনদেন বাংলাদেশ ব্যাংক অনুমোদিত পেমেন্ট গেটওয়ে (SSLCommerz) এর মাধ্যমে সম্পূর্ণ এনক্রিপ্টেড ও সুরক্ষিত চ্যানেলে সম্পন্ন হয়।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">৩. তৃতীয় পক্ষের সাথে তথ্য শেয়ারিং</h2>
            <p className="text-text-muted">
              অর্মিশন কোনো অবস্থাতেই আপনার ব্যক্তিগত তথ্য কোনো বাণিজ্যিক বিজ্ঞাপনদাতা বা বহিরাগত তৃতীয় পক্ষের কাছে বিক্রি, লিজ বা হস্তান্তর করে না।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">৪. যোগাযোগ ও প্রশ্ন</h2>
            <p className="text-text-muted">
              আপনার ব্যক্তিগত তথ্য বা গোপনীয়তা সংক্রান্ত কোনো প্রশ্ন থাকলে সরাসরি ইমেইল করুন:{" "}
              <a href="mailto:privacy@ormission.com" className="text-primary font-sans font-semibold underline">
                privacy@ormission.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
