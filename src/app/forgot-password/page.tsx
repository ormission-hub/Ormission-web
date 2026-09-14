"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  };

  return (
    <div className="bg-background min-h-screen py-12 lg:py-20 flex items-center justify-center">
      <div className="container-main max-w-md w-full">
        <div className="bg-surface rounded-xl border border-border p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-text font-bengali tracking-tight mb-1.5">
              পাসওয়ার্ড পুনরুদ্ধার
            </h1>
            <p className="text-xs text-text-muted font-bengali">
              আপনার নিবন্ধিত মোবাইল নম্বর বা ইমেইল লিখুন
            </p>
          </div>

          {sent ? (
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-secondary mx-auto" />
              <h4 className="font-bold text-base text-text font-bengali">
                রিসেট নির্দেশনা পাঠানো হয়েছে
              </h4>
              <p className="text-xs text-text-muted font-bengali leading-relaxed">
                আপনার প্রদত্ত নম্বরে বা ইমেইলে পাসওয়ার্ড রিসেট লিংক ও ওটিপি পাঠিয়ে দেওয়া হয়েছে। অনুগ্রহ করে ইনবক্স চেক করুন।
              </p>
              <Link
                href="/login"
                className="btn btn-primary btn-sm font-bengali font-semibold block mt-4"
              >
                লগইন পাতায় ফিরে যান
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text font-bengali mb-1.5">
                  মোবাইল নম্বর বা ইমেইল *
                </label>
                <input
                  type="text"
                  required
                  placeholder="017XXXXXXXX বা mail@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="input text-sm font-sans w-full"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary font-bengali font-bold w-full py-3 flex items-center justify-center gap-2"
              >
                <span>রিসেট কোড পাঠান</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="border-t border-border mt-6 pt-5 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors font-bengali"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>লগইন পাতায় ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
