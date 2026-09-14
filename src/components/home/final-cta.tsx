import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section className="section">
      <div className="container-main">
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16 text-center",
            "bg-gradient-to-r from-primary via-blue-700 to-primary-hover shadow-2xl shadow-primary/20"
          )}
        >
          {/* Subtle grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white border border-white/20 text-xs font-semibold backdrop-blur-xs font-bengali">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>স্বপ্ন ছোঁয়ার প্রস্তুতি শুরু হোক আজ থেকেই</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-bengali leading-tight tracking-tight">
              আপনার স্বপ্নের বিশ্ববিদ্যালয় ও ক্যারিয়ারের যাত্রা শুরু হোক Ormission-এর সাথে
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-bengali max-w-xl mx-auto">
              বুয়েট, মেডিকেল ও ঢাবি সহ দেশসেরা মেন্টরদের নিবিড় গাইডলাইন, অফলাইন ক্লাস ডাউনলোড ও কার্যকর রোডম্যাপ নিয়ে এগিয়ে যান লক্ষ্যের দিকে।
            </p>

            <div className="flex flex-wrap justify-center gap-3.5 pt-2 font-bengali">
              <Link
                href="/courses"
                className={cn(
                  "inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold rounded-xl transition-all duration-200",
                  "bg-white text-primary hover:bg-white/95 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                )}
              >
                <span>কোর্সগুলো ঘুরে দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl transition-all duration-200",
                  "bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-xs hover:-translate-y-0.5 active:translate-y-0"
                )}
              >
                <span>ফ্রি অ্যাকাউন্ট খুলুন</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-white/80 font-bengali">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>যেকোনো সময় বাতিলযোগ্য</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>২৪/৭ ডাউট সলভিং সাপোর্ট</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>অফলাইন ডাউনলোড সুবিধা</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
