import { RefreshCw, Clock, AlertTriangle, CheckCircle2, XCircle, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "রিফান্ড নীতিমালা (Refund Policy) | Ormission",
  description:
    "কোর্স ক্রয় পরবর্তী রিফান্ড পাওয়ার বিস্তারিত নিয়মাবলী, শর্ত, সময়সীমা ও আবেদন প্রক্রিয়া।",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-background min-h-screen pt-24 pb-12 sm:pt-28 sm:pb-16 lg:py-16">
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

        <div className="bg-surface rounded-xl border border-border p-6 lg:p-10 space-y-8 text-sm lg:text-base text-text font-bengali leading-relaxed">
          {/* Intro */}
          <div className="bg-secondary/5 border border-secondary/10 rounded-lg p-4 text-sm text-text-muted">
            অর্মিশন (Ormission) শিক্ষার্থীদের সন্তুষ্টি ও আস্থাকে সর্বোচ্চ গুরুত্ব দেয়। আমরা বিশ্বাস করি স্বচ্ছ ও ন্যায্য রিফান্ড নীতিমালা শিক্ষার্থী ও প্রতিষ্ঠান উভয়ের স্বার্থ রক্ষা করে। কোর্স ক্রয়ের পূর্বে অনুগ্রহ করে এই নীতিমালাটি সম্পূর্ণ পড়ে নিন।
          </div>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary" />
              ১. শর্তসাপেক্ষ রিফান্ড সময়সীমা
            </h2>
            <p className="text-text-muted mb-3">
              যেকোনো রেকর্ডেড কোর্সে ভর্তির <strong className="text-text">৪৮ ঘণ্টার</strong> মধ্যে আপনি রিফান্ডের আবেদন করতে পারবেন, যদি নিম্নোক্ত যেকোনো একটি শর্ত পূরণ হয়:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-1.5 ml-1">
              <li>কোর্সের আউটলাইনে বর্ণিত কন্টেন্টের সাথে প্রকৃত কন্টেন্টে উল্লেখযোগ্য অমিল পাওয়া যায়</li>
              <li>গুরুতর কারিগরি সমস্যা যা আমাদের সাপোর্ট টিম সমাধান করতে ব্যর্থ হয়</li>
              <li>পেমেন্ট প্রক্রিয়ায় ত্রুটির কারণে একই কোর্সে দ্বিতীয়বার চার্জ কাটা হয় (Duplicate Payment)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              ২. যেক্ষেত্রে রিফান্ড প্রযোজ্য নয়
            </h2>
            <p className="text-text-muted mb-3">
              নিম্নোক্ত পরিস্থিতিতে রিফান্ড আবেদন গ্রহণযোগ্য হবে না:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-1.5 ml-1">
              <li>কোর্সের <strong className="text-text">২০% বা তার বেশি</strong> ভিডিও কন্টেন্ট দেখা সম্পন্ন হয়ে গেলে</li>
              <li>কোর্সের সাথে সংযুক্ত কোনো লেকচার শিট, হ্যান্ডনোট বা রিসোর্স PDF ডাউনলোড করা হলে</li>
              <li>ভর্তির <strong className="text-text">৪৮ ঘণ্টা</strong> পার হয়ে যাওয়ার পর আবেদন করা হলে</li>
              <li>ব্যক্তিগত মানসিক সিদ্ধান্ত পরিবর্তন, ভুল ধারণা বা পছন্দ না হওয়ার কারণে</li>
              <li>অ্যাকাউন্ট শেয়ারিং বা কপিরাইট লঙ্ঘনের কারণে অ্যাকাউন্ট বাতিল হলে</li>
              <li>প্রমোশনাল বা ডিসকাউন্ট অফারে কেনা কোর্সের ক্ষেত্রে (যদি না অফারের শর্তে ভিন্নভাবে উল্লেখ থাকে)</li>
              <li>লাইভ কোর্সের নির্ধারিত ক্লাস শুরু হয়ে গেলে</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ৩. রিফান্ড প্রক্রিয়া ও সময়কাল
            </h2>
            <p className="text-text-muted mb-3">
              রিফান্ড অনুমোদনের পর নিম্নোক্ত প্রক্রিয়ায় টাকা ফেরত প্রদান করা হবে:
            </p>
            <div className="bg-surface-secondary rounded-lg border border-border p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">বিকাশ / নগদ / রকেট</span>
                <span className="font-bold text-text">৩ — ৫ কার্যদিবস</span>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">ডেবিট / ক্রেডিট কার্ড</span>
                <span className="font-bold text-text">৫ — ৭ কার্যদিবস</span>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">ব্যাংক ট্রান্সফার</span>
                <span className="font-bold text-text">৭ — ১০ কার্যদিবস</span>
              </div>
            </div>
            <p className="text-text-muted mt-3 text-sm">
              রিফান্ডের টাকা সর্বদা মূল পেমেন্ট মাধ্যমে (যে মাধ্যমে পেমেন্ট করা হয়েছিল) ফেরত প্রদান করা হবে। পেমেন্ট গেটওয়ে বা ব্যাংকের প্রক্রিয়াগত কারণে সময় কিছুটা বেশি লাগতে পারে।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">
              ৪. আংশিক রিফান্ড
            </h2>
            <p className="text-text-muted">
              বিশেষ ক্ষেত্রে (যেমন: কোর্সের কিছু অংশ প্রযুক্তিগত কারণে দীর্ঘ সময় ধরে অপ্রাপ্য থাকলে) অর্মিশন কর্তৃপক্ষ আংশিক রিফান্ড বা কোর্স ক্রেডিট (অন্য কোর্সে ব্যবহারযোগ্য) প্রদানের সিদ্ধান্ত নিতে পারে। এই সিদ্ধান্ত সম্পূর্ণ অর্মিশনের বিবেচনাধীন এবং প্রতিটি কেস পৃথকভাবে পর্যালোচনা করা হবে।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              ৫. Duplicate Payment ও ভুল চার্জ
            </h2>
            <p className="text-text-muted">
              পেমেন্ট গেটওয়ের ত্রুটির কারণে যদি একই কোর্সে দ্বিতীয়বার চার্জ কাটা হয় বা ভুল পরিমাণে টাকা কাটা যায়, তবে অতিরিক্ত অংশের পূর্ণ রিফান্ড স্বয়ংক্রিয়ভাবে অথবা সাপোর্ট টিকিটের মাধ্যমে আবেদনের ৪৮ ঘণ্টার মধ্যে প্রক্রিয়া করা হবে। এই ক্ষেত্রে ৪৮ ঘণ্টার সময়সীমা প্রযোজ্য হবে না।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-secondary" />
              ৬. রিফান্ডের আবেদন পদ্ধতি
            </h2>
            <p className="text-text-muted mb-3">
              রিফান্ডের আবেদন করতে নিম্নোক্ত যেকোনো একটি উপায় অনুসরণ করুন:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-secondary border border-border">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold font-sans">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-text text-sm mb-0.5">সাপোর্ট টিকিট (সবচেয়ে দ্রুত)</h4>
                  <p className="text-xs text-text-muted">
                    ড্যাশবোর্ডের "সাপোর্ট" বিভাগ থেকে "পেমেন্ট ও অর্ডার" ক্যাটাগরিতে নতুন টিকিট খুলুন এবং আপনার অর্ডার আইডি, মোবাইল নম্বর ও রিফান্ডের কারণ উল্লেখ করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-secondary border border-border">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold font-sans">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-text text-sm mb-0.5">ইমেইল</h4>
                  <p className="text-xs text-text-muted">
                    আপনার অর্ডার আইডি, নিবন্ধিত মোবাইল নম্বর ও বিস্তারিত কারণ উল্লেখ করে ইমেইল পাঠান:{" "}
                    <a
                      href="mailto:support@ormission.com"
                      className="text-primary font-sans font-semibold underline"
                    >
                      support@ormission.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-secondary border border-border">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold font-sans">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-text text-sm mb-0.5">হেল্পলাইন</h4>
                  <p className="text-xs text-text-muted">
                    সকাল ৯টা থেকে রাত ১০টা পর্যন্ত (প্রতিদিন) আমাদের হেল্পলাইনে কল করে রিফান্ডের আবেদন জানাতে পারেন।
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">
              ৭. চূড়ান্ত সিদ্ধান্ত
            </h2>
            <p className="text-text-muted">
              রিফান্ড অনুমোদন বা প্রত্যাখ্যানের চূড়ান্ত সিদ্ধান্ত অর্মিশন কর্তৃপক্ষের বিবেচনাধীন। প্রতিটি আবেদন পৃথকভাবে পর্যালোচনা করা হয় এবং ন্যায্যতার ভিত্তিতে সিদ্ধান্ত গ্রহণ করা হয়। রিফান্ড আবেদনের বিপরীতে অর্মিশন কর্তৃপক্ষ প্রয়োজনে শিক্ষার্থীর ব্যবহার লগ (ভিডিও দেখার ইতিহাস, ডাউনলোড ইত্যাদি) যাচাই করতে পারবে।
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
