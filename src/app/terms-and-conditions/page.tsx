import { FileText, Scale, Shield, BookOpen, AlertTriangle, RefreshCw } from "lucide-react";

export const metadata = {
  title: "শর্তাবলী ও নীতিমালা (Terms & Conditions) | Ormission",
  description:
    "অর্মিশন প্ল্যাটফর্ম ব্যবহারের সাধারণ নিয়মাবলী, সেবার শর্ত ও আইনি বাধ্যবাধকতা।",
};

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen pt-24 pb-12 sm:pt-28 sm:pb-16 lg:py-16">
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

        <div className="bg-surface rounded-xl border border-border p-6 lg:p-10 space-y-8 text-sm lg:text-base text-text font-bengali leading-relaxed">
          {/* Intro */}
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-sm text-text-muted">
            অর্মিশন (Ormission) ওয়েবসাইট, মোবাইল অ্যাপ্লিকেশন বা এর যেকোনো ডিজিটাল সেবা ব্যবহার করার পূর্বে অনুগ্রহ করে নিম্নোক্ত শর্তাবলী মনোযোগ সহকারে পড়ুন। প্ল্যাটফর্মে প্রবেশ বা কোনো কোর্সে নথিভুক্ত হওয়ার মাধ্যমে আপনি এই শর্তাবলীর প্রতি পূর্ণ সম্মতি জ্ঞাপন করছেন।
          </div>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              ১. সেবার সংজ্ঞা ও পরিধি
            </h2>
            <p className="text-text-muted">
              অর্মিশন একটি অনলাইন শিক্ষা প্ল্যাটফর্ম যা এসএসসি, এইচএসসি, বিশ্ববিদ্যালয় ভর্তি পরীক্ষা প্রস্তুতি ও দক্ষতা উন্নয়নমূলক রেকর্ডেড ও লাইভ কোর্স প্রদান করে। এর অন্তর্ভুক্ত ভিডিও লেকচার, লেকচার শিট, মডেল টেস্ট, অনলাইন পরীক্ষা এবং সাপোর্ট সেবা — সবকিছুই এই শর্তাবলী দ্বারা পরিচালিত।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              ২. অ্যাকাউন্ট ও নিরাপত্তা
            </h2>
            <p className="text-text-muted mb-3">
              প্রতিটি অ্যাকাউন্ট সম্পূর্ণ ব্যক্তিগত এবং অ-হস্তান্তরযোগ্য। নিম্নোক্ত কার্যকলাপ কঠোরভাবে নিষিদ্ধ:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-1.5 ml-1">
              <li>একটি অ্যাকাউন্ট একাধিক ব্যক্তির সাথে শেয়ার করা বা লগইন ক্রেডেনশিয়াল ভাগাভাগি করা</li>
              <li>অ্যাকাউন্ট ভাড়া দেওয়া, বিক্রি করা বা অন্য কারো নামে হস্তান্তর করা</li>
              <li>ভিপিএন, প্রক্সি বা অন্য কোনো উপায়ে সেশন নিরাপত্তা ফাঁকি দেওয়ার চেষ্টা করা</li>
              <li>একাধিক ডিভাইসে একসাথে অননুমোদিত লগইন বজায় রাখা</li>
            </ul>
            <p className="text-text-muted mt-3 text-sm">
              <strong className="text-text">সতর্কতা:</strong> উপরোক্ত যেকোনো লঙ্ঘন শনাক্ত হলে পূর্ব নোটিশ ছাড়াই অ্যাকাউন্ট সাময়িক বা স্থায়ীভাবে বাতিল করা হতে পারে এবং ক্ষেত্রবিশেষে কোর্সের মূল্য ফেরতযোগ্য হবে না।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              ৩. মেধাসম্পদ ও কপিরাইট
            </h2>
            <p className="text-text-muted mb-3">
              অর্মিশনে প্রকাশিত সকল শিক্ষামূলক কন্টেন্ট — যার মধ্যে রয়েছে ভিডিও লেকচার, অডিও, লেকচার শিট, হ্যান্ডনোট, মডেল টেস্ট প্রশ্নপত্র, গ্রাফিক্স ও ডিজাইন — বাংলাদেশ কপিরাইট আইন ২০০০ (সংশোধিত ২০০৫) এবং আন্তর্জাতিক মেধাসম্পদ আইনের অধীনে সুরক্ষিত। নিম্নোক্ত কার্যকলাপ দণ্ডনীয় অপরাধ হিসেবে বিবেচিত:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-1.5 ml-1">
              <li>ভিডিও বা অডিও স্ক্রিন রেকর্ড, ক্যাপচার বা ডাউনলোড করা</li>
              <li>লেকচার শিট বা কন্টেন্ট ফটোকপি, স্ক্যান বা পুনরুৎপাদন করা</li>
              <li>কোনো কন্টেন্ট সামাজিক যোগাযোগ মাধ্যম, টেলিগ্রাম গ্রুপ বা অন্য কোনো প্ল্যাটফর্মে শেয়ার বা বিতরণ করা</li>
              <li>কন্টেন্ট পুনরায় বিক্রি বা বাণিজ্যিক উদ্দেশ্যে ব্যবহার করা</li>
            </ul>
            <p className="text-text-muted mt-3 text-sm">
              <strong className="text-text">আইনি পদক্ষেপ:</strong> কপিরাইট লঙ্ঘন প্রমাণিত হলে বাংলাদেশ কপিরাইট আইন অনুযায়ী সর্বনিম্ন ৫০,০০০ টাকা জরিমানা এবং/অথবা কারাদণ্ডের বিধান রয়েছে। অর্মিশন কর্তৃপক্ষ আইনি ব্যবস্থা গ্রহণের অধিকার সংরক্ষণ করে।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">
              ৪. কোর্স ক্রয় ও পেমেন্ট
            </h2>
            <p className="text-text-muted mb-3">
              কোর্স ক্রয় সম্পর্কিত নীতিমালা:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-1.5 ml-1">
              <li>ওয়েবসাইটে প্রদর্শিত কোর্সের মূল্য বাংলাদেশি টাকায় (BDT) এবং সকল প্রযোজ্য কর সহ।</li>
              <li>পেমেন্ট সফলভাবে সম্পন্ন ও যাচাই হওয়ার পর স্বয়ংক্রিয়ভাবে কোর্স অ্যাক্সেস প্রদান করা হয়।</li>
              <li>ম্যানুয়াল পেমেন্টের ক্ষেত্রে (বিকাশ/নগদ সেন্ডমানি) যাচাইকরণে ১ থেকে ২৪ ঘণ্টা সময় লাগতে পারে।</li>
              <li>অর্মিশন কর্তৃপক্ষ যেকোনো সময় কোর্সের মূল্য পরিবর্তন করার অধিকার রাখে, তবে পূর্বে ক্রয়কৃত কোর্সের মূল্যের উপর এর প্রভাব পড়বে না।</li>
              <li>প্রমোশনাল/ডিসকাউন্ট অফার সীমিত সময়ের জন্য এবং নির্দিষ্ট শর্তসাপেক্ষ।</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">
              ৫. কোর্স অ্যাক্সেস ও মেয়াদ
            </h2>
            <p className="text-text-muted">
              ক্রয়কৃত রেকর্ডেড কোর্সের অ্যাক্সেস কোর্সের বিবরণে উল্লিখিত মেয়াদ অনুযায়ী বহাল থাকবে (সাধারণত ভর্তি পরীক্ষার তারিখ পর্যন্ত অথবা নির্ধারিত সময়কাল)। মেয়াদ শেষে পুনরায় অ্যাক্সেসের জন্য কোর্স নবায়ন করতে হতে পারে। লাইভ কোর্সের শিডিউল ও সেশন সংখ্যা পরিবর্তনের অধিকার অর্মিশন কর্তৃপক্ষ সংরক্ষণ করে।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">
              ৬. ব্যবহারকারীর আচরণবিধি
            </h2>
            <p className="text-text-muted mb-3">
              অর্মিশনের সকল ব্যবহারকারীর কাছ থেকে পেশাদার ও শ্রদ্ধাশীল আচরণ প্রত্যাশিত। নিম্নোক্ত কার্যকলাপ সম্পূর্ণ নিষিদ্ধ:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-1.5 ml-1">
              <li>কোনো শিক্ষক, সাপোর্ট কর্মী বা অন্য শিক্ষার্থীর প্রতি অশোভন বা আপত্তিকর ভাষা প্রয়োগ</li>
              <li>মিথ্যা তথ্য প্রদান করে অ্যাকাউন্ট তৈরি বা পেমেন্ট সংক্রান্ত প্রতারণা</li>
              <li>প্ল্যাটফর্মের নিরাপত্তা ব্যবস্থায় অনুপ্রবেশ বা ক্ষতি করার চেষ্টা</li>
              <li>প্রচারমূলক স্প্যাম, ম্যালওয়্যার বা অনুমতিহীন লিংক শেয়ার</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">
              ৭. দায়সীমাবদ্ধতা
            </h2>
            <p className="text-text-muted">
              অর্মিশন সর্বোচ্চ চেষ্টা করে নিরবচ্ছিন্ন ও মানসম্মত সেবা প্রদানের জন্য। তবে প্রযুক্তিগত ত্রুটি, সার্ভার ডাউনটাইম, ইন্টারনেট সংযোগ সমস্যা বা তৃতীয় পক্ষের সেবা ব্যাঘাতের কারণে সাময়িক সেবা বিঘ্নিত হলে অর্মিশন এর জন্য কোনো আর্থিক ক্ষতিপূরণে বাধ্য থাকবে না। পরীক্ষার ফলাফল বা ভর্তি সংক্রান্ত চূড়ান্ত সিদ্ধান্ত সম্পূর্ণ শিক্ষার্থীর নিজস্ব দায়িত্ব।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-primary" />
              ৮. শর্তাবলীর পরিবর্তন
            </h2>
            <p className="text-text-muted">
              অর্মিশন কর্তৃপক্ষ যেকোনো সময় এই শর্তাবলীতে সংযোজন, সংশোধন বা পরিবর্তন আনার অধিকার সংরক্ষণ করে। গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে ব্যবহারকারীদের ওয়েবসাইট ও ইমেইলের মাধ্যমে অবহিত করা হবে। সংশোধিত শর্তাবলী ওয়েবসাইটে প্রকাশের তারিখ থেকে কার্যকর বলে গণ্য হবে এবং পরবর্তীতে প্ল্যাটফর্ম ব্যবহারের মাধ্যমে আপনি সংশোধিত শর্তাবলীতে সম্মতি জ্ঞাপন করছেন বলে ধরে নেওয়া হবে।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">
              ৯. প্রযোজ্য আইন ও এখতিয়ার
            </h2>
            <p className="text-text-muted">
              এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের প্রচলিত আইন দ্বারা পরিচালিত ও ব্যাখ্যায়িত হবে। যেকোনো বিরোধ নিষ্পত্তির ক্ষেত্রে ঢাকা জেলা আদালতের এখতিয়ার প্রযোজ্য হবে।
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mb-2">
              ১০. যোগাযোগ
            </h2>
            <p className="text-text-muted">
              এই শর্তাবলী সম্পর্কে কোনো প্রশ্ন বা ব্যাখ্যার প্রয়োজন হলে অনুগ্রহ করে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন:{" "}
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
