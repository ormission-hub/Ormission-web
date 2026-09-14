"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Receipt,
  User,
  LogOut,
  GraduationCap,
  Sparkles,
} from "lucide-react";

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

  return (
    <div className="bg-background min-h-screen py-8 lg:py-12">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Dashboard Sidebar (Desktop) */}
          <aside className="lg:col-span-3">
            <div className="bg-surface rounded-lg border border-border p-6 shadow-xs sticky top-24">
              {/* Student Profile Card */}
              <div className="text-center pb-6 border-b border-border">
                <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary/20 shadow-xs">
                  <Image
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"
                    alt="Sadman Islam"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-base text-text font-bengali">
                  সাদমান ইসলাম
                </h3>
                <p className="text-xs text-text-muted font-sans mt-0.5">
                  01712345678
                </p>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full mt-2 font-bengali">
                  <Sparkles className="w-3 h-3" />
                  <span>এইচএসসি '২৬ পরীক্ষার্থী</span>
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
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs lg:text-sm font-bengali font-semibold transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-text-muted hover:text-text hover:bg-surface-secondary"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <div className="pt-4 border-t border-border mt-4">
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs lg:text-sm font-bengali font-medium text-error hover:bg-error/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>লগআউট করুন</span>
                  </Link>
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
