"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Receipt,
  User,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const sidebarNavItems = [
  { label: "ড্যাশবোর্ড ওভারভিউ", href: "/dashboard", icon: LayoutDashboard },
  { label: "আমার কোর্সসমূহ", href: "/dashboard/my-courses", icon: BookOpen },
  { label: "অর্ডার ও পেমেন্ট হিস্ট্রি", href: "/dashboard/orders", icon: Receipt },
  { label: "প্রোফাইল সেটিংস", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadUserData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      setUser(session.user);

      // Fetch profile from profiles table
      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileData) {
          setProfile(profileData);
        }
      } catch (e) {
        console.warn("Profile fetch note:", e);
      }
    }

    loadUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setLoggingOut(false);
    }
  };

  const userMeta = user?.user_metadata || {};
  const displayName =
    profile?.full_name ||
    userMeta.full_name ||
    userMeta.name ||
    user?.email?.split("@")[0] ||
    "শিক্ষার্থী";

  const studentPhone =
    profile?.phone ||
    userMeta.phone ||
    "";

  const studentInitial = (
    displayName?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();

  const studentBatch = userMeta.hsc_batch
    ? `এইচএসসি '${userMeta.hsc_batch} ব্যাচ`
    : "ভেরিফাইড শিক্ষার্থী";

  return (
    <div className="bg-background min-h-screen pt-24 pb-12 lg:pt-28 lg:pb-16">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Dashboard Sidebar (Desktop) */}
          <aside className="lg:col-span-3">
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs sticky top-24">
              {/* Student Profile Card */}
              <div className="text-center pb-6 border-b border-border">
                <div className="relative w-20 h-20 rounded-full mx-auto mb-3.5 border-2 border-primary/30 p-1 shadow-xs flex items-center justify-center bg-surface-secondary">
                  {(profile?.avatar_url || userMeta?.avatar_url) ? (
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={profile?.avatar_url || userMeta?.avatar_url}
                        alt={displayName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-2xl uppercase shadow-xs">
                      {studentInitial}
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-base text-text font-bengali truncate px-2">
                  {displayName}
                </h3>

                {studentPhone && (
                  <p className="text-xs text-text-muted font-sans mt-0.5">
                    {studentPhone}
                  </p>
                )}

                {user?.email && (
                  <p className="text-[11px] text-text-muted font-sans truncate px-2 mt-0.5">
                    {user.email}
                  </p>
                )}

                <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full mt-2.5 font-bengali">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{studentBatch}</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="pt-6 space-y-1">
                {sidebarNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs lg:text-sm font-bengali font-semibold transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-xs font-bold"
                          : "text-text-muted hover:text-text hover:bg-surface-secondary"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <div className="pt-4 border-t border-border mt-4">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs lg:text-sm font-bengali font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>{loggingOut ? "লগআউট হচ্ছে..." : "লগআউট করুন"}</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
