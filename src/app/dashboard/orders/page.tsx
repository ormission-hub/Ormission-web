"use client";

import { Download, Receipt, CheckCircle2 } from "lucide-react";

interface OrderItem {
  id: string;
  orderNumber: string;
  courseTitleBn: string;
  date: string;
  amount: number;
  method: string;
  status: "success" | "pending" | "failed";
}

const ORDERS: OrderItem[] = [
  {
    id: "ord-1",
    orderNumber: "ORM-948201",
    courseTitleBn: "বুয়েট ও ইঞ্জিনিয়ারিং পদার্থবিজ্ঞান স্পেশাল ব্যাচ",
    date: "১০ আগস্ট, ২০২৬",
    amount: 3850,
    method: "bKash",
    status: "success",
  },
  {
    id: "ord-2",
    orderNumber: "ORM-742910",
    courseTitleBn: "মেডিকেল জীববিজ্ঞান সম্পূর্ণ কনসেপ্ট ও প্রশ্নব্যাংক সলভ",
    date: "২৮ জুলাই, ২০২৬",
    amount: 3200,
    method: "Nagad",
    status: "success",
  },
  {
    id: "ord-3",
    orderNumber: "ORM-618492",
    courseTitleBn: "এইচএসসি উচ্চতর গণিত ১ম ও ২য় পত্র পূর্ণাঙ্গ প্রস্তুতি",
    date: "১৫ জুন, ২০২৬",
    amount: 3450,
    method: "Visa Card",
    status: "success",
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text font-bengali">
          অর্ডার ও পেমেন্ট হিস্ট্রি
        </h1>
        <p className="text-xs text-text-muted font-bengali mt-0.5">
          আপনার সকল সফল লেনদেনের তথ্য ও অফিশিয়াল মানি রসিদ
        </p>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50 text-xs font-semibold text-text-muted font-bengali">
                <th className="p-4">অর্ডার নম্বর</th>
                <th className="p-4">কোর্সের বিবরণ</th>
                <th className="p-4">তারিখ</th>
                <th className="p-4">পেমেন্ট মাধ্যম</th>
                <th className="p-4">মূল্য</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4 text-right">রসিদ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="p-4 font-bold text-text font-sans">
                    {order.orderNumber}
                  </td>
                  <td className="p-4 font-bold text-text font-bengali max-w-xs truncate">
                    {order.courseTitleBn}
                  </td>
                  <td className="p-4 text-text-muted font-sans whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="p-4 font-medium text-text font-sans uppercase">
                    {order.method}
                  </td>
                  <td className="p-4 font-bold text-primary font-sans text-sm whitespace-nowrap">
                    ৳{order.amount.toLocaleString("en-US")}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-success/10 text-success font-bengali">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>পরিশোধিত</span>
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        alert(`অর্ডার ${order.orderNumber}-এর ইনভয়েস ডাউনলোড হচ্ছে...`);
                      }}
                      className="btn btn-outline btn-sm text-[11px] font-bengali py-1 px-2.5 inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>ইনভয়েস</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
