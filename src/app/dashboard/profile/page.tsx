"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  User,
  Camera,
  Save,
  Lock,
  CheckCircle2,
  RefreshCw,
  UploadCloud,
  Trash2,
  Sparkles,
  ShieldCheck,
  Mail,
  Phone,
  GraduationCap,
  Target,
  MapPin,
  Calendar,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    institution: "",
    targetBatch: "",
    district: "",
    avatarUrl: "",
    createdAt: "",
  });

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          const meta = session.user.user_metadata || {};

          // Fetch from profiles table
          const { data: dbProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          setProfile({
            name: dbProfile?.full_name || meta.full_name || meta.name || "",
            phone: dbProfile?.phone || meta.phone || "",
            email: session.user.email || "",
            address: meta.address || meta.district || "",
            institution: meta.institution || "",
            targetBatch: meta.hsc_batch ? `এইচএসসি '${meta.hsc_batch}` : meta.target || "",
            district: meta.district || "ঢাকা",
            avatarUrl: dbProfile?.avatar_url || meta.avatar_url || "",
            createdAt: session.user.created_at || "",
          });
        }
      } catch (e) {
        console.error("Error loading profile:", e);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // Handle Photo File Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।");
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = { success: false, error: "ছবি আপলোডে সার্ভার থেকে ত্রুটি এসেছে" };
      }

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "ছবি আপলোড ব্যর্থ হয়েছে");
      }

      const uploadedUrl = data.url;

      // Update local state
      setProfile((prev) => ({ ...prev, avatarUrl: uploadedUrl }));

      // Save to Supabase
      const supabase = createClient();
      if (user) {
        await supabase
          .from("profiles")
          .update({
            avatar_url: uploadedUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        await supabase.auth.updateUser({
          data: { avatar_url: uploadedUrl },
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ছবি আপলোড করতে সমস্যা হয়েছে";
      console.error("Image upload error:", err);
      alert(msg);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!confirm("আপনি কি প্রোফাইল ছবি মুছে ফেলতে চান?")) return;

    setProfile((prev) => ({ ...prev, avatarUrl: "" }));

    try {
      const supabase = createClient();
      if (user) {
        await supabase
          .from("profiles")
          .update({
            avatar_url: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        await supabase.auth.updateUser({
          data: { avatar_url: null },
        });
      }
    } catch (e) {
      console.warn("Remove photo note:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const supabase = createClient();

      if (user) {
        // Update user metadata
        await supabase.auth.updateUser({
          data: {
            full_name: profile.name,
            phone: profile.phone,
            address: profile.address,
            institution: profile.institution,
            district: profile.district,
            target: profile.targetBatch,
          },
        });

        // Update profiles table
        await supabase
          .from("profiles")
          .update({
            full_name: profile.name,
            phone: profile.phone,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (e) {
      console.error("Error saving profile:", e);
      alert("প্রোফাইল সংরক্ষণ করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  const studentInitial = (
    profile.name?.[0] ||
    profile.email?.[0] ||
    "U"
  ).toUpperCase();

  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("bn-BD", {
        month: "long",
        year: "numeric",
      })
    : "২০২৬";

  if (loading) {
    return (
      <div className="bg-surface rounded-2xl border border-border p-12 text-center text-xs text-text-muted font-bengali">
        <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-primary" />
        প্রোফাইল তথ্য লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl font-bengali">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-text tracking-tight">
          শিক্ষার্থী প্রোফাইল ও অ্যাকাউন্ট সেটিংস
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          আপনার ব্যক্তিগত তথ্য, ছবি ও পড়াশোনার লক্ষ্যসমূহ আপডেট রাখুন
        </p>
      </div>

      {/* Hero Profile Banner & Avatar Card */}
      <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
        {/* Sleek Dynamic Cover Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950/80 dark:to-slate-950 relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,95,0,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(124,58,237,0.2),transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
          {/* Platform Badge */}
          <div className="absolute top-3.5 right-4 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 dark:bg-slate-900/50 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>অরমিসন লার্নার প্রোফাইল</span>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-5">
            {/* Avatar with Camera Overlay */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-surface bg-surface-secondary shadow-lg shrink-0 group">
              {profile.avatarUrl ? (
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name || "Student"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-3xl sm:text-4xl uppercase shadow-xs">
                  {studentInitial}
                </div>
              )}

              {/* Uploading Spinner Overlay */}
              {uploadingImage && (
                <div className="absolute inset-0 rounded-full bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white text-[10px] font-bold">
                  <RefreshCw className="w-5 h-5 animate-spin mb-1 text-primary" />
                  <span>আপলোড হচ্ছে...</span>
                </div>
              )}

              {/* Camera Icon Trigger Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                title="ছবি পরিবর্তন করুন"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer border-2 border-surface disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 font-bengali text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>নতুন ছবি আপলোড করুন</span>
              </button>

              {profile.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={uploadingImage}
                  title="ছবি মুছে ফেলুন"
                  className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* User Name & Info Headline */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-text">
                {profile.name || "শিক্ষার্থী"}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ভেরিফাইড শিক্ষার্থী প্রোফাইল
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-text-muted" />
                <span className="font-sans">{profile.email}</span>
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-text-muted" />
                  <span className="font-sans">{profile.phone}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-text-muted" />
                <span>সদস্য হয়েছেন: {joinedDate}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          <span className="font-bold">আপনার প্রোফাইল তথ্য সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      {/* Profile Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Details */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <User className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-text">ব্যক্তিগত তথ্যাবলী</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text mb-1.5">
                আপনার পূর্ণ নাম <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/70 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-secondary/70 hover:bg-surface-secondary focus:bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm text-text placeholder:text-text-muted/50 placeholder:font-bengali font-bengali transition-all duration-150 outline-none shadow-2xs"
                  placeholder="উদাঃ নাহিয়ান শেখ"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1.5">
                মোবাইল নম্বর
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/70 pointer-events-none" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-secondary/70 hover:bg-surface-secondary focus:bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm text-text placeholder:text-text-muted/50 font-sans transition-all duration-150 outline-none shadow-2xs"
                  placeholder="উদাঃ 01700123456"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-text">
                  ইমেইল ঠিকানা (রেজিস্ট্রেশন ইমেইল)
                </label>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-sans font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Verified
                </span>
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/70 pointer-events-none" />
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-secondary/40 border border-border/60 text-xs sm:text-sm text-text-muted font-sans cursor-not-allowed border-dashed"
                />
              </div>
              <p className="text-[11px] text-text-muted mt-1.5">
                অ্যাকাউন্টের নিরাপত্তার স্বার্থে প্রাথমিক ইমেইলটি অপরিবর্তনযোগ্য রাখা হয়েছে।
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-text mb-1.5">
                আপনার পূর্ণাঙ্গ ঠিকানা (Address)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/70 pointer-events-none" />
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-secondary/70 hover:bg-surface-secondary focus:bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm text-text placeholder:text-text-muted/50 placeholder:font-bengali font-bengali transition-all duration-150 outline-none shadow-2xs"
                  placeholder="উদাঃ বাড়ি নং ১২, রোড নং ৫, ধানমন্ডি, ঢাকা"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Academic & Target Goals */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <GraduationCap className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-text">শিক্ষাগত ও ক্যারিয়ার লক্ষ্য</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text mb-1.5">
                শিক্ষা প্রতিষ্ঠান / কলেজ
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/70 pointer-events-none" />
                <input
                  type="text"
                  value={profile.institution}
                  onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-secondary/70 hover:bg-surface-secondary focus:bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm text-text placeholder:text-text-muted/50 placeholder:font-bengali font-bengali transition-all duration-150 outline-none shadow-2xs"
                  placeholder="উদাঃ ঢাকা কলেজ / নটর ডেম কলেজ"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text mb-1.5">
                টার্গেট ব্যাচ / লক্ষ্য
              </label>
              <div className="relative">
                <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/70 pointer-events-none" />
                <input
                  type="text"
                  value={profile.targetBatch}
                  onChange={(e) => setProfile({ ...profile, targetBatch: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-secondary/70 hover:bg-surface-secondary focus:bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm text-text placeholder:text-text-muted/50 placeholder:font-bengali font-bengali transition-all duration-150 outline-none shadow-2xs"
                  placeholder="উদাঃ এইচএসসি '২৬ / ইঞ্জিনিয়ারিং / মেডিকেল"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-text mb-1.5">
                জেলা / শহর
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/70 pointer-events-none" />
                <input
                  type="text"
                  value={profile.district}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-secondary/70 hover:bg-surface-secondary focus:bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm text-text placeholder:text-text-muted/50 placeholder:font-bengali font-bengali transition-all duration-150 outline-none shadow-2xs"
                  placeholder="উদাঃ ঢাকা, চট্টগ্রাম, রাজশাহী বা আপনার শহর"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-bold text-xs sm:text-sm font-bengali shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
