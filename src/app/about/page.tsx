import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Award, Users, BookOpen, Compass, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "আমাদের সম্পর্কে | Ormission — Learn · Build · Grow",
  description: "অর্মিশন-এর পরিচিতি, লক্ষ্য, দূরদৃষ্টি এবং শিক্ষার্থীদের সাফল্যের পথ সুগম করার অঙ্গীকার।",
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen py-10 lg:py-16">
      <div className="container-main">
        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-primary/10 text-primary font-bengali inline-block mb-3">
            আমাদের গল্প ও দর্শন
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text font-bengali tracking-tight leading-tight mb-6">
            গুণগত শিক্ষা হোক সবার জন্য উন্মুক্ত ও ফলপ্রসূ
          </h1>
          <p className="text-base lg:text-lg text-text-muted font-bengali leading-relaxed">
            অর্মিশন (Ormission) একটি আধুনিক ও মানবিক শিক্ষা উদ্যোগ। আমাদের মূল লক্ষ্য শিক্ষার্থীদের মুখস্থবিদ্যার গণ্ডি থেকে বের করে যৌক্তিক বিশ্লেষণ, গভীর কনসেপচুয়াল বোঝাপড়া এবং আত্মবিশ্বাসী মেধা হিসেবে গড়ে তোলা।
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-surface rounded-lg border border-border p-8">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text font-bengali mb-3">
              আমাদের মিশন (Mission)
            </h3>
            <p className="text-sm text-text-muted font-bengali leading-relaxed">
              দেশের যেকোনো প্রান্তের প্রতিটি শিক্ষার্থী যেন রাজধানী বা বড় শহরের সেরা শিক্ষকদের বিশ্বমানের অ্যাকাডেমিক ও ভর্তি গাইডলাইন সাশ্রয়ী মূল্যে গ্রহণ করতে পারে।
            </p>
          </div>

          <div className="bg-surface rounded-lg border border-border p-8">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text font-bengali mb-3">
              আমাদের ভিশন (Vision)
            </h3>
            <p className="text-sm text-text-muted font-bengali leading-relaxed">
              বাংলাদেশের প্রধান অনলাইন শিক্ষা প্ল্যাটফর্ম হিসেবে আত্মপ্রকাশ করা, যা কেবল পরীক্ষায় ভালো নম্বর পাওয়ায় নয়, বরং শিক্ষার্থীদের স্বনির্ভর ও উদ্ভাবনী চিন্তায় গড়ে তোলে।
            </p>
          </div>

          <div className="bg-surface rounded-lg border border-border p-8">
            <div className="w-12 h-12 rounded-lg bg-accent/15 text-accent flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text font-bengali mb-3">
              আমাদের অঙ্গীকার (Values)
            </h3>
            <p className="text-sm text-text-muted font-bengali leading-relaxed">
              স্বচ্ছতা, শিক্ষায় আপসহীন মান, নির্ভরযোগ্য সাপোর্ট এবং প্রতিটি শিক্ষার্থীর ব্যক্তিগত অগ্রগতির প্রতি সজাগ দৃষ্টি রাখা।
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-surface rounded-lg border border-border p-8 lg:p-12 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-text font-bengali leading-snug">
                শিক্ষার্থীদের প্রকৃত ভীতি দূর করাই আমাদের পথচলার সূচনা
              </h2>
              <p className="text-sm lg:text-base text-text-muted font-bengali leading-relaxed">
                এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার সময় লাখ লাখ শিক্ষার্থী সঠিক দিকনির্দেশনা ও ভালো মেন্টরশিপের অভাবে পিছিয়ে পড়ে। অর্মিশন তৈরি হয়েছে সেই শূন্যতা পূরণ করতে।
              </p>
              <p className="text-sm lg:text-base text-text-muted font-bengali leading-relaxed">
                এখানে প্রতিটি লেকচার তৈরি হয় নিবিড় পরিকল্পনায়। কোনো অপ্রয়োজনীয় সময়ক্ষেপণ ছাড়া সম্পূর্ণ সিলেবাস ভিত্তিক টু-দ্য-পয়েন্ট আলোচনা ও বাস্তব সমস্যা সমাধানের পদ্ধতি আমাদের বিশেষত্ব।
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-4 rounded-lg bg-surface-secondary">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-text text-sm font-bengali">কনসেপ্ট ক্লিয়ারিং ক্লাস</h4>
                    <p className="text-xs text-text-muted font-bengali">মৌলিক সূত্র থেকে শুরু করে জটিল গাণিতিক সমস্যার স্পষ্ট সমাধান।</p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5 p-4 rounded-lg bg-surface-secondary">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-text text-sm font-bengali">দেশসেরা মেন্টর প্যানেল</h4>
                    <p className="text-xs text-text-muted font-bengali">বুয়েট, ডিএমসি ও ঢাবির কৃতি শিক্ষার্থীদের সরাসরি পাঠদান।</p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5 p-4 rounded-lg bg-surface-secondary">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-text text-sm font-bengali">অফলাইন মোবাইল ভিউ</h4>
                    <p className="text-xs text-text-muted font-bengali">ইন্টারনেট না থাকলেও অ্যাপের মাধ্যমে নির্বিঘ্ন পড়াশোনা।</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-text font-bengali mb-4">
            আমাদের সাথে আপনার যাত্রা শুরু করুন আজই
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/courses" className="btn btn-primary font-bengali font-bold">
              কোর্সসমূহ ব্রাউজ করুন
            </Link>
            <Link href="/contact" className="btn btn-outline font-bengali font-semibold">
              যোগাযোগ করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
