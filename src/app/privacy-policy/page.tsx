import { ShieldCheck, Lock, Eye, Server, UserCheck, Mail } from "lucide-react";

export const metadata = {
  title: "গোপনীয়তা নীতি (Privacy Policy) | Ormission",
  description:
    "অর্মিশন প্ল্যাটফর্মে শিক্ষার্থীদের ব্যক্তিগত তথ্য সংরক্ষণ, ব্যবহার ও নিরাপত্তার বিস্তারিত নীতিমালা।",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen pt-24 pb-12 sm:pt-28 sm:pb-16 lg:py-16">
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

        <div className="bg-surface rounded-xl border border-border p-6 lg:p-10 space-y-8 text-sm lg:text-base text-text font-bengali leading-relaxed">
          {/* Intro */}
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-sm text-text-muted">
            অর্মিশন (Ormission) আপনার ব্যক্তিগত গোপনীয়তাকে সর্বোচ্চ গুরুত্বের সাথে বিবেচনা করে। এই গোপনীয়তা নীতিতে আমরা ব্যাখ্যা করছি কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার, সংরক্ষণ ও সুরক্ষিত রাখা হয়। আমাদের প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে আপনি এই নীতির শর্তাবলীতে সম্মতি প্রদান করছেন।
          </div>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              ১. তথ্যের সংগ্রহ
            </h2>
            <p className="text-text-muted mb-3">
              অর্মিশন প্ল্যাটফর্মে অ্যাকাউন্ট তৈরি, কোর্সে ভর্তি বা সাপোর্ট টিকিট প্রদানের সময় আমরা নিম্নলিখিত তথ্যসমূহ সংগ্রহ করতে পারি:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-1.5 ml-1">
              <li>আপনার পূর্ণ নাম ও প্রোফাইল তথ্য</li>
              <li>মোবাইল নম্বর ও ইমেইল ঠিকানা</li>
              <li>ঠিকানা (যদি প্রোফাইলে প্রদান করেন)</li>
              <li>শিক্ষা প্রতিষ্ঠানের নাম ও ক্লাস/ব্যাচ সংক্রান্ত তথ্য</li>
              <li>কোর্স ক্রয় ও পেমেন্ট সংশ্লিষ্ট লেনদেন তথ্য (ট্রানজাকশন আইডি, অর্ডার নম্বর)</li>
              <li>ডিভাইস, ব্রাউজার ও আইপি সম্পর্কিত প্রযুক্তিগত তথ্য (সেশন নিরাপত্তার জন্য)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              ২. তথ্যের ব্যবহার
            </h2>
            <p className="text-text-muted mb-3">
              সংগৃহীত তথ্যসমূহ নিম্নোক্ত উদ্দেশ্যে ব্যবহৃত হয়:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-1.5 ml-1">
              <li>আপনার অ্যাকাউন্ট তৈরি, যাচাইকরণ ও নিরাপদ লগইন নিশ্চিতকরণ</li>
              <li>কোর্স অ্যাক্সেস প্রদান ও ক্লাসরুম পরিচালনা</li>
              <li>পেমেন্ট প্রক্রিয়াকরণ, অর্ডার যাচাই ও রশিদ প্রেরণ</li>
              <li>সাপোর্ট টিকিট পরিচালনা ও সমস্যা সমাধান</li>
              <li>কোর্স সম্পর্কিত গুরুত্বপূর্ণ বিজ্ঞপ্তি ও আপডেট প্রদান</li>
              <li>প্ল্যাটফর্মের সামগ্রিক মানোন্নয়ন ও প্রযুক্তিগত উন্নতিসাধন</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              ৩. পেমেন্ট তথ্যের নিরাপত্তা
            </h2>
            <p className="text-text-muted">
              অর্মিশন কোনো প্রকার ক্রেডিট/ডেবিট কার্ড নম্বর, মোবাইল ব্যাংকিংয়ের পিন বা ওটিপি নিজস্ব সার্ভারে সংরক্ষণ করে না। সকল আর্থিক লেনদেন বাংলাদেশ ব্যাংক অনুমোদিত পেমেন্ট গেটওয়ে (SSLCommerz)-এর মাধ্যমে সম্পূর্ণ এনক্রিপ্টেড ও সুরক্ষিত চ্যানেলে সম্পাদিত হয়। বিকাশ, নগদ, রকেট ও কার্ডের মাধ্যমে প্রদত্ত সকল পেমেন্ট PCI-DSS কমপ্লায়েন্ট নিরাপত্তা মানদণ্ড অনুসরণ করে।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              ৪. তথ্য সংরক্ষণ ও সুরক্ষা
            </h2>
            <p className="text-text-muted">
              আপনার তথ্য আন্তর্জাতিক মানসম্পন্ন সুরক্ষিত ক্লাউড সার্ভারে (Supabase/AWS) এনক্রিপ্টেড অবস্থায় সংরক্ষণ করা হয়। ডাটাবেস অ্যাক্সেস Row Level Security (RLS) দ্বারা নিয়ন্ত্রিত এবং শুধুমাত্র অনুমোদিত কর্মীরাই প্রশাসনিক তথ্য দেখতে পারেন। আমরা নিয়মিত নিরাপত্তা নিরীক্ষা ও আপডেট পরিচালনা করি।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">
              ৫. তৃতীয় পক্ষের সাথে তথ্য আদান-প্রদান
            </h2>
            <p className="text-text-muted">
              অর্মিশন কোনো অবস্থাতেই আপনার ব্যক্তিগত তথ্য কোনো বাণিজ্যিক বিজ্ঞাপনদাতা, মার্কেটিং সংস্থা বা বহিরাগত তৃতীয় পক্ষের কাছে বিক্রি, লিজ বা হস্তান্তর করে না। তবে পেমেন্ট প্রসেসিং (SSLCommerz), ইমেইল বিজ্ঞপ্তি পরিষেবা এবং আইনগত বাধ্যবাধকতার ক্ষেত্রে সীমিত তথ্য সংশ্লিষ্ট সেবা প্রদানকারীর সাথে শেয়ার করা হতে পারে।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">
              ৬. কুকিজ ও অ্যানালিটিক্স
            </h2>
            <p className="text-text-muted">
              আমাদের ওয়েবসাইট ব্যবহারকারীর অভিজ্ঞতা উন্নত করার জন্য প্রয়োজনীয় কুকিজ ব্যবহার করে (যেমন: লগইন সেশন, থিম পছন্দ)। এই কুকিজ কোনো ব্যক্তিগত সংবেদনশীল তথ্য সংরক্ষণ করে না। আমরা প্ল্যাটফর্মের ব্যবহার পরিসংখ্যান বিশ্লেষণের জন্য বেনামী অ্যানালিটিক্স ব্যবহার করতে পারি।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">
              ৭. আপনার অধিকার
            </h2>
            <p className="text-text-muted mb-3">
              আপনার ব্যক্তিগত তথ্য সম্পর্কে আপনার নিম্নোক্ত অধিকার রয়েছে:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-1.5 ml-1">
              <li>আপনার সংরক্ষিত তথ্য দেখা ও পর্যালোচনা করার অধিকার</li>
              <li>ভুল বা পুরনো তথ্য সংশোধন করার অনুরোধ</li>
              <li>অ্যাকাউন্ট মুছে ফেলার (Account Deletion) আবেদন</li>
              <li>প্রচারমূলক বার্তা গ্রহণ থেকে বিরত থাকার অনুরোধ (Unsubscribe)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">
              ৮. নীতিমালার পরিবর্তন
            </h2>
            <p className="text-text-muted">
              অর্মিশন কর্তৃপক্ষ প্রয়োজন অনুসারে এই গোপনীয়তা নীতিমালায় পরিবর্তন বা সংশোধন আনার অধিকার সংরক্ষণ করে। কোনো গুরুত্বপূর্ণ পরিবর্তন হলে ওয়েবসাইট ও ইমেইলের মাধ্যমে শিক্ষার্থীদের অবহিত করা হবে। সংশোধিত নীতিমালা প্রকাশের তারিখ থেকে কার্যকর বলে গণ্য হবে।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              ৯. যোগাযোগ
            </h2>
            <p className="text-text-muted">
              আপনার ব্যক্তিগত তথ্য, গোপনীয়তা বা এই নীতিমালা সম্পর্কে কোনো প্রশ্ন, অভিযোগ বা পরামর্শ থাকলে অনুগ্রহ করে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন:{" "}
              <a
                href="mailto:support@ormission.com"
                className="text-primary font-sans font-semibold underline"
              >
                support@ormission.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
