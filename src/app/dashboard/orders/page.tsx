"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Download,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface StudentOrder {
  id: string;
  orderNumber: string;
  courseTitle: string;
  created_at: string;
  final_amount: number;
  payment_method: string;
  status: "pending" | "paid" | "completed" | "failed" | "cancelled" | "refunded";
  senderNumber?: string;
  transactionId?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<StudentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");

  const loadStudentOrders = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        return;
      }

      setUserEmail(session.user.email || "");

      const res = await fetch(`/api/orders?userId=${session.user.id}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error("Error loading student orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bengali">
            <CheckCircle2 className="w-3 h-3" />
            <span>অনুমোদিত ও সক্রিয়</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bengali">
            <Clock className="w-3 h-3 animate-pulse" />
            <span>ভেরিফিকেশন চলছে</span>
          </span>
        );
      case "failed":
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bengali">
            <AlertCircle className="w-3 h-3" />
            <span>বাতিলকৃত</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-surface-secondary text-text-muted border border-border font-bengali">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text font-bengali">
            অর্ডার ও পেমেন্ট হিস্ট্রি
          </h1>
          <p className="text-xs text-text-muted font-bengali mt-0.5">
            আপনার সকল কোর্স অর্ডারের অবস্থা, ভেরিফিকেশন স্ট্যাটাস ও মানি রসিদ
          </p>
        </div>

        <button
          type="button"
          onClick={loadStudentOrders}
          disabled={loading}
          className="btn btn-outline btn-sm font-bengali text-xs flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-text-muted font-bengali">
            <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-primary" />
            অর্ডার তালিকা লোড হচ্ছে...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30 text-text-muted" />
            <h3 className="text-base font-bold text-text font-bengali mb-1">
              এখনো কোনো অর্ডার পাওয়া যায়নি
            </h3>
            <p className="text-xs text-text-muted font-bengali mb-4 max-w-sm mx-auto">
              আপনার পছন্দের কোর্সটিতে ভর্তি হয়ে সহজেই প্রস্তুতি শুরু করতে পারেন।
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold font-bengali shadow-xs hover:bg-primary-hover transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>কোর্সসমূহ ব্রাউজ করুন</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/50 text-[11px] font-semibold text-text-muted font-bengali">
                  <th className="p-4">অর্ডার নম্বর</th>
                  <th className="p-4">কোর্সের বিবরণ</th>
                  <th className="p-4">পেমেন্ট মাধ্যম ও TrxID</th>
                  <th className="p-4">তারিখ</th>
                  <th className="p-4">মূল্য</th>
                  <th className="p-4">ভেরিফিকেশন অবস্থা</th>
                  <th className="p-4 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => {
                  const dateStr = order.created_at
                    ? new Date(order.created_at).toLocaleDateString("bn-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <tr key={order.id} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="p-4 font-bold text-text font-mono">
                        {order.orderNumber}
                      </td>

                      <td className="p-4 font-bold text-text font-bengali max-w-[200px] truncate">
                        {order.courseTitle}
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-text uppercase font-sans">
                          {order.payment_method || "bKash"}
                        </div>
                        {order.transactionId && (
                          <div className="text-[11px] text-text-muted font-mono">
                            Trx: {order.transactionId}
                          </div>
                        )}
                        {order.senderNumber && (
                          <div className="text-[10px] text-text-muted font-sans">
                            Sender: {order.senderNumber}
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-text-muted font-bengali whitespace-nowrap">
                        {dateStr}
                      </td>

                      <td className="p-4 font-bold text-primary font-sans text-sm whitespace-nowrap">
                        ৳{Number(order.final_amount || 0).toLocaleString("en-US")}
                      </td>

                      <td className="p-4">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="p-4 text-right">
                        {order.status === "paid" || order.status === "completed" ? (
                          <Link
                            href="/dashboard/my-courses"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold font-bengali transition-colors"
                          >
                            <span>ক্লাসরুম</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bengali">
                            যাচাইকরণাধীন
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
