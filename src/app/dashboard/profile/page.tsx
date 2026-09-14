"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Camera, Save, Lock, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "সাদমান ইসলাম",
    phone: "01712345678",
    email: "sadman@example.com",
    institution: "নটর ডেম কলেজ, ঢাকা",
    targetBatch: "এইচএসসি '২৬ ও ইঞ্জিনিয়ারিং",
    district: "ঢাকা",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-text font-bengali">
          প্রোফাইল সেটিংস
        </h1>
        <p className="text-xs text-text-muted font-bengali mt-0.5">
          আপনার ব্যক্তিগত তথ্য ও অ্যাকাউন্টের নিরাপত্তা পরিচালনা করুন
        </p>
      </div>

      <div className="bg-surface rounded-lg border border-border p-6 shadow-xs">
        {/* Avatar Upload Preview */}
        <div className="flex items-center gap-5 pb-6 border-b border-border mb-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-sm text-text font-bengali">
              প্রোফাইল ছবি
            </h4>
            <p className="text-xs text-text-muted font-bengali mb-2">
              JPG, PNG বা WEBP (সর্বোচ্চ ২ মেগাবাইট)
            </p>
            <button
              type="button"
              onClick={() => alert("ছবি আপলোড উইন্ডো চালু হচ্ছে...")}
              className="btn btn-outline btn-sm text-xs font-bengali py-1.5 flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>ছবি পরিবর্তন করুন</span>
            </button>
          </div>
        </div>

        {saved && (
          <div className="mb-6 p-3 bg-success/10 border border-success/20 rounded-lg text-xs font-bengali text-success flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>প্রোফাইল সফলভাবে আপডেট করা হয়েছে!</span>
          </div>
        )}

        {/* Profile Info Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text font-bengali mb-1">
                আপনার পূর্ণ নাম *
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="input text-sm font-bengali w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text font-bengali mb-1">
                মোবাইল নম্বর (অপরিবর্তনযোগ্য)
              </label>
              <input
                type="tel"
                disabled
                value={profile.phone}
                className="input text-sm font-sans w-full bg-surface-secondary text-text-muted cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text font-bengali mb-1">
                ইমেইল ঠিকানা *
              </label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="input text-sm font-sans w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text font-bengali mb-1">
                শিক্ষা প্রতিষ্ঠান / কলেজ
              </label>
              <input
                type="text"
                value={profile.institution}
                onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                className="input text-sm font-bengali w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text font-bengali mb-1">
                টার্গেট ব্যাচ / লক্ষ্য
              </label>
              <input
                type="text"
                value={profile.targetBatch}
                onChange={(e) => setProfile({ ...profile, targetBatch: e.target.value })}
                className="input text-sm font-bengali w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text font-bengali mb-1">
                জেলা / শহর
              </label>
              <input
                type="text"
                value={profile.district}
                onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                className="input text-sm font-bengali w-full"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn btn-primary font-bengali font-bold px-6 py-2.5 flex items-center gap-2 text-xs"
            >
              <Save className="w-4 h-4" />
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
