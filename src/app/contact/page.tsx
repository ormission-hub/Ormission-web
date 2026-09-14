"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-background min-h-screen py-10 lg:py-16">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-primary/10 text-primary font-bengali inline-block mb-3">
            সরাসরি যোগাযোগ
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-text font-bengali tracking-tight mb-3">
            আমাদের সাথে যোগাযোগ করুন
          </h1>
          <p className="text-text-muted text-base font-bengali">
            যেকোনো কোর্স সংক্রান্ত তথ্য, পেমেন্ট জিজ্ঞাসা বা কারিগরি সহায়তার জন্য আমাদের টিম সার্বক্ষণিক প্রস্তুত।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Contact Details Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface rounded-lg border border-border p-6 space-y-5">
              <h3 className="text-lg font-bold text-text font-bengali border-b border-border pb-3">
                যোগাযোগের মাধ্যমসমূহ
              </h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-text-muted font-bengali block">হটলাইন ও হেল্পলাইন:</span>
                  <a href="tel:+8801700000000" className="text-base font-bold text-text hover:text-primary transition-colors font-sans">
                    +880 1700-000000
                  </a>
                  <p className="text-[11px] text-text-muted font-bengali mt-0.5">সকাল ৯টা থেকে রাত ১০টা (প্রতিদিন)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-text-muted font-bengali block">ইমেইল ঠিকানা:</span>
                  <a href="mailto:support@ormission.com" className="text-base font-bold text-text hover:text-secondary transition-colors font-sans">
                    support@ormission.com
                  </a>
                  <p className="text-[11px] text-text-muted font-bengali mt-0.5">২৪ ঘণ্টার মধ্যে দ্রুত উত্তর প্রদান</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-text-muted font-bengali block">হোয়াটসঅ্যাপ সাপোর্ট:</span>
                  <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer" className="text-base font-bold text-text hover:text-accent transition-colors font-sans">
                    +880 1700-000000
                  </a>
                  <p className="text-[11px] text-text-muted font-bengali mt-0.5">তাৎক্ষণিক মেসেজ ও চ্যাট সহায়তা</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-secondary text-text-muted flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-text-muted font-bengali block">অফিস ঠিকানা:</span>
                  <p className="text-sm font-semibold text-text font-bengali">
                    লেভেল ৪, রূপায়ন টাওয়ার, ধানমন্ডি ২৭, ঢাকা-১২০৯
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Right Column */}
          <div className="lg:col-span-7">
            <div className="bg-surface rounded-lg border border-border p-6 lg:p-8">
              <h3 className="text-xl font-bold text-text font-bengali mb-2">
                বার্তা পাঠান
              </h3>
              <p className="text-xs text-text-muted font-bengali mb-6">
                ফর্মটি পূরণ করে আপনার জিজ্ঞাসা পাঠিয়ে দিন, আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবেন।
              </p>

              {submitted ? (
                <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-secondary mx-auto" />
                  <h4 className="text-lg font-bold text-text font-bengali">
                    আপনার বার্তাটি সফলভাবে পৌঁছেছে!
                  </h4>
                  <p className="text-sm text-text-muted font-bengali max-w-sm mx-auto">
                    ধন্যবাদ। আমাদের সাপোর্ট টিম খুব শীঘ্রই আপনার প্রদত্ত মোবাইল নম্বরে বা ইমেইলে যোগাযোগ করবে।
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
                    }}
                    className="btn btn-outline btn-sm font-bengali mt-4"
                  >
                    আরেকটি বার্তা পাঠান
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text font-bengali mb-1.5">
                        আপনার পূর্ণ নাম *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="উদা: সাদমান ইসলাম"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input text-sm font-bengali w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text font-bengali mb-1.5">
                        মোবাইল নম্বর *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input text-sm font-sans w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text font-bengali mb-1.5">
                        ইমেইল ঠিকানা
                      </label>
                      <input
                        type="email"
                        placeholder="example@mail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input text-sm font-sans w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text font-bengali mb-1.5">
                        বিষয় (Subject) *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="input text-sm font-bengali w-full"
                      >
                        <option value="">বিষয় নির্বাচন করুন</option>
                        <option value="course-query">কোর্স সম্পর্কিত তথ্য</option>
                        <option value="payment-help">পেমেন্ট বা ভর্তি সমস্যা</option>
                        <option value="technical">ওয়েবসাইট ও অ্যাপের কারিগরি সমস্যা</option>
                        <option value="other">অন্যান্য</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text font-bengali mb-1.5">
                      আপনার বার্তা বা জিজ্ঞাসা *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="বিস্তারিত এখানে লিখুন..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input text-sm font-bengali w-full py-2.5 resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary font-bengali font-bold flex items-center justify-center gap-2 w-full py-3"
                  >
                    <Send className="w-4 h-4" />
                    <span>বার্তা পাঠান</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
