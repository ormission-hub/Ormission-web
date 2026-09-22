"use client";

import { useEffect, useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Headphones,
  PlusCircle,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  RefreshCw,
  X,
  ChevronRight,
  Receipt,
  User,
  ShieldCheck,
  HelpCircle,
  Filter,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TicketReply {
  id: string;
  sender: "student" | "admin";
  sender_name: string;
  message: string;
  created_at: string;
}

interface SupportTicket {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  category: "payment" | "course_access" | "player" | "account" | "other";
  subject: string;
  message: string;
  order_number?: string;
  course_title?: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  created_at: string;
  updated_at: string;
  replies: TicketReply[];
}

function SupportContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");

  // Selected Ticket for Conversation View Modal
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);

  // New Ticket Modal State
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState<SupportTicket["category"]>("payment");
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newPriority, setNewPriority] = useState<SupportTicket["priority"]>("high");
  const [selectedOrderNumber, setSelectedOrderNumber] = useState("");
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load user data and tickets
  const loadData = async () => {
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

      setUser(session.user);

      // 1. Fetch user tickets
      const res = await fetch(`/api/support/tickets?userId=${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.success && Array.isArray(data.data)) {
          setTickets(data.data);
          // If modal is open, sync selectedTicket
          if (selectedTicket) {
            const updated = data.data.find((t: SupportTicket) => t.id === selectedTicket.id);
            if (updated) setSelectedTicket(updated);
          }
        }
      }

      // 2. Fetch user orders for dropdown
      const ordersRes = await fetch(`/api/orders?userId=${session.user.id}`);
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData?.success && Array.isArray(ordersData.data)) {
          setUserOrders(ordersData.data);
        }
      }
    } catch (e) {
      console.error("Error loading support data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle URL query parameters (e.g. ?new=true&orderId=ORM-166927&course=Versity)
  useEffect(() => {
    const isNew = searchParams.get("new");
    const orderId = searchParams.get("orderId");
    const course = searchParams.get("course");

    if (isNew === "true" || orderId) {
      setIsNewTicketOpen(true);
      if (orderId) {
        setSelectedOrderNumber(orderId);
        setNewCategory("payment");
        setNewPriority("high");
      }
      if (course) {
        setSelectedCourseTitle(course);
        setNewSubject(`পেমেন্ট ও অর্ডার যাচাই সমস্যা: ${course} (${orderId || ""})`);
        setNewMessage(
          `আমার কোর্স "${course}" এর অর্ডার #${orderId || ""} এর পেমেন্ট রিকোয়েস্ট যাচাইকরণে সমস্যা হয়েছে। অনুগ্রহ করে ট্রানজাকশনটি পুনরায় যাচাই করে ক্লাসরুম সক্রিয় করে দিন।`
        );
      }
    }
  }, [searchParams]);

  // Handle submit new ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) {
      alert("বিষয় এবং বিস্তারিত বার্তা আবশ্যক।");
      return;
    }

    setSubmitting(true);
    try {
      const userMeta = user?.user_metadata || {};
      const payload = {
        userId: user.id,
        userName: userMeta.full_name || userMeta.name || user.email?.split("@")[0] || "শিক্ষার্থী",
        userEmail: user.email || "",
        userPhone: userMeta.phone || "",
        category: newCategory,
        subject: newSubject.trim(),
        message: newMessage.trim(),
        orderNumber: selectedOrderNumber,
        courseTitle: selectedCourseTitle,
        priority: newPriority,
      };

      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data?.success) {
        setIsNewTicketOpen(false);
        setNewSubject("");
        setNewMessage("");
        setSelectedOrderNumber("");
        setSelectedCourseTitle("");
        loadData();
        if (data.ticket) {
          setSelectedTicket(data.ticket);
        }
      } else {
        alert(data?.error || "টিকিট জমা দিতে সমস্যা হয়েছে।");
      }
    } catch (err) {
      console.error("Create ticket error:", err);
      alert("নেটওয়ার্ক ত্রুটি, অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle send reply in conversation
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    setSendingReply(true);
    try {
      const userMeta = user?.user_metadata || {};
      const payload = {
        ticketId: selectedTicket.id,
        sender: "student",
        senderName: userMeta.full_name || userMeta.name || user.email?.split("@")[0] || "শিক্ষার্থী",
        message: replyMessage.trim(),
      };

      const res = await fetch("/api/support/tickets/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data?.success) {
        setReplyMessage("");
        setSelectedTicket(data.ticket);
        // Refresh ticket list
        setTickets((prev) =>
          prev.map((t) => (t.id === data.ticket.id ? data.ticket : t))
        );
      } else {
        alert(data?.error || "রিপ্লাই পাঠাতে সমস্যা হয়েছে।");
      }
    } catch (err) {
      console.error("Reply error:", err);
      alert("বার্তা পাঠাতে ত্রুটি হয়েছে।");
    } finally {
      setSendingReply(false);
    }
  };

  // Delete ticket
  const handleDeleteTicket = async (ticketId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const confirmed = window.confirm(
      `আপনি কি নিশ্চিতভাবে এই সাপোর্ট টিকিটটি (#${ticketId}) স্থায়ীভাবে মুছে ফেলতে চান?`
    );
    if (!confirmed) return;

    setDeletingTicketId(ticketId);
    try {
      const res = await fetch(`/api/support/tickets?ticketId=${ticketId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data?.success) {
        setTickets((prev) => prev.filter((t) => t.id !== ticketId));
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(null);
        }
      } else {
        alert(data?.error || "টিকিট ডিলিট করতে সমস্যা হয়েছে।");
      }
    } catch (err) {
      console.error("Delete ticket error:", err);
      alert("নেটওয়ার্ক ত্রুটি, অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setDeletingTicketId(null);
    }
  };

  // Helper for status badge
  const getStatusBadge = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>অপেক্ষমান (Open)</span>
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>প্রক্রিয়াধীন (In Progress)</span>
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
            <CheckCircle2 className="w-3 h-3" />
            <span>সমাধানকৃত (Resolved)</span>
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/15 text-slate-500 border border-slate-500/25">
            <span>বন্ধ (Closed)</span>
          </span>
        );
    }
  };

  // Helper for category label
  const getCategoryLabel = (category: SupportTicket["category"]) => {
    switch (category) {
      case "payment":
        return "পেমেন্ট ও অর্ডার";
      case "course_access":
        return "কোর্স অ্যাক্সেস";
      case "player":
        return "ভিডিও প্লেয়ার";
      case "account":
        return "অ্যাকাউন্ট";
      default:
        return "অন্যান্য";
    }
  };

  const openTicketsCount = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const resolvedTicketsCount = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;

  const filteredTickets =
    filter === "open"
      ? tickets.filter((t) => t.status === "open" || t.status === "in_progress")
      : filter === "resolved"
      ? tickets.filter((t) => t.status === "resolved" || t.status === "closed")
      : tickets;

  return (
    <div className="space-y-6 font-bengali">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 mb-1">
            <Headphones className="w-3.5 h-3.5" />
            <span>২৪/৭ হেল্পডেস্ক</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-text">
            সাপোর্ট ও শিক্ষার্থী সহায়তা
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            যেকোনো সমস্যা, পেমেন্ট সংক্রান্ত তথ্য যাচাই বা অনুসন্ধানে আমাদের সাপোর্ট টিমের সাহায্য নিন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            title="রিফ্রেশ করুন"
            className="p-2.5 rounded-xl bg-surface-secondary hover:bg-surface-secondary/80 border border-border text-text transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsNewTicketOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন সাপোর্ট টিকিট</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-2xl border border-border p-5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black text-text font-sans">{tickets.length}</span>
            <span className="text-xs text-text-muted block">মোট দাখিলকৃত টিকিট</span>
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-sans">
              {openTicketsCount}
            </span>
            <span className="text-xs text-text-muted block">অপেক্ষমান ও চলমান</span>
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-5 flex items-center gap-4 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-sans">
              {resolvedTicketsCount}
            </span>
            <span className="text-xs text-text-muted block">সফলভাবে সমাধানকৃত</span>
          </div>
        </div>
      </div>

      {/* Ticket List Header & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-text">আপনার টিকিটসমূহ</h2>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface-secondary border border-border text-text-muted">
            {filteredTickets.length}টি
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-surface-secondary/80 rounded-xl text-xs font-semibold border border-border/60">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === "all" ? "bg-surface text-primary shadow-xs font-bold" : "text-text-muted hover:text-text"
            }`}
          >
            সকল ({tickets.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("open")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === "open" ? "bg-surface text-amber-600 shadow-xs font-bold" : "text-text-muted hover:text-text"
            }`}
          >
            অপেক্ষমান ({openTicketsCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("resolved")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === "resolved" ? "bg-surface text-emerald-600 shadow-xs font-bold" : "text-text-muted hover:text-text"
            }`}
          >
            সমাধানকৃত ({resolvedTicketsCount})
          </button>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center text-xs text-text-muted">
          <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-primary" />
          সাপোর্ট টিকিটগুলো লোড হচ্ছে...
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center shadow-xs">
          <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30 text-text-muted" />
          <h3 className="text-base font-bold text-text mb-1">
            {filter === "all"
              ? "আপনার কোনো সাপোর্ট টিকিট নেই"
              : filter === "open"
              ? "কোনো অপেক্ষমান টিকিট নেই"
              : "কোনো সমাধানকৃত টিকিট নেই"}
          </h3>
          <p className="text-xs text-text-muted mb-4 max-w-sm mx-auto">
            যেকোনো বিষয়ে কোনো সহায়তা লাগলে সরাসরি নতুন টিকিট খুলে আমাদের সাথে যোগাযোগ করুন।
          </p>
          <button
            type="button"
            onClick={() => setIsNewTicketOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>নতুন টিকিট তৈরি করুন</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => {
            const repliesCount = ticket.replies?.length || 1;
            const lastReply = ticket.replies?.[ticket.replies.length - 1];
            const isLastFromAdmin = lastReply?.sender === "admin";
            const updateDate = new Date(ticket.updated_at).toLocaleDateString("bn-BD", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="bg-surface hover:bg-surface-secondary/40 border border-border hover:border-primary/40 rounded-2xl p-5 transition-all cursor-pointer shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-text-muted px-2 py-0.5 rounded-md bg-surface-secondary border border-border">
                      {ticket.id}
                    </span>
                    {getStatusBadge(ticket.status)}
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                      {getCategoryLabel(ticket.category)}
                    </span>
                    {ticket.priority === "high" || ticket.priority === "urgent" ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        জরুরি
                      </span>
                    ) : null}
                    {ticket.order_number ? (
                      <span className="text-[11px] text-text-muted font-mono flex items-center gap-1">
                        <Receipt className="w-3 h-3 text-primary" />
                        <span>{ticket.order_number}</span>
                      </span>
                    ) : null}
                  </div>

                  <h3 className="font-bold text-base text-text group-hover:text-primary transition-colors leading-snug">
                    {ticket.subject}
                  </h3>

                  <p className="text-xs text-text-muted line-clamp-1">
                    {lastReply ? (
                      <span>
                        <strong className={isLastFromAdmin ? "text-primary font-bold" : "text-text"}>
                          {lastReply.sender_name}:
                        </strong>{" "}
                        {lastReply.message}
                      </span>
                    ) : (
                      ticket.message
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center text-xs">
                  <div className="text-right">
                    <span className="text-[11px] text-text-muted block font-sans">{updateDate}</span>
                    <span className="text-[11px] font-semibold text-primary inline-flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{repliesCount}টি বার্তা</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={deletingTicketId === ticket.id}
                      onClick={(e) => handleDeleteTicket(ticket.id, e)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors opacity-80 hover:opacity-100 cursor-pointer"
                      title="টিকিট মুছে ফেলুন"
                    >
                      {deletingTicketId === ticket.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-500" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Conversation / View Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-border bg-surface-secondary/40 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-xs text-primary px-2 py-0.5 rounded bg-primary/10">
                    {selectedTicket.id}
                  </span>
                  {getStatusBadge(selectedTicket.status)}
                  <span className="text-xs text-text-muted px-2 py-0.5 rounded bg-surface border border-border">
                    {getCategoryLabel(selectedTicket.category)}
                  </span>
                  {selectedTicket.order_number && (
                    <span className="text-xs text-text-muted font-mono flex items-center gap-1 bg-surface px-2 py-0.5 rounded border border-border">
                      <Receipt className="w-3 h-3 text-primary" />
                      <span>{selectedTicket.order_number}</span>
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg text-text">{selectedTicket.subject}</h3>
                {selectedTicket.course_title && (
                  <p className="text-xs text-text-muted">
                    সম্পর্কিত কোর্স: <strong>{selectedTicket.course_title}</strong>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={deletingTicketId === selectedTicket.id}
                  onClick={() => handleDeleteTicket(selectedTicket.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  title="টিকিট স্থায়ীভাবে মুছে ফেলুন"
                >
                  {deletingTicketId === selectedTicket.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>ডিলিট</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 max-h-[50vh] bg-surface-secondary/10">
              {(selectedTicket.replies || []).map((reply, idx) => {
                const isAdmin = reply.sender === "admin";
                return (
                  <div
                    key={reply.id || idx}
                    className={`flex flex-col ${isAdmin ? "items-start" : "items-end"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-text-muted">
                      {isAdmin ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                          <span className="font-bold text-primary">{reply.sender_name}</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 text-text-muted" />
                          <span className="font-semibold text-text">{reply.sender_name} (আপনি)</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="font-sans">
                        {new Date(reply.created_at).toLocaleTimeString("bn-BD", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                        isAdmin
                          ? "bg-surface border-2 border-primary/20 text-text shadow-xs"
                          : "bg-primary text-white shadow-xs"
                      }`}
                    >
                      {reply.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-border bg-surface flex gap-2">
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="এখানে আপনার বার্তা লিখুন..."
                disabled={sendingReply || selectedTicket.status === "closed"}
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface-secondary border border-border text-text text-xs focus:outline-hidden focus:border-primary transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!replyMessage.trim() || sendingReply || selectedTicket.status === "closed"}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {sendingReply ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>পাঠান</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-border bg-surface-secondary/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-text">নতুন সাপোর্ট টিকিট খুলুন</h3>
                  <p className="text-xs text-text-muted">আপনার সমস্যা বা জিজ্ঞাসা বিস্তারিতভাবে জানান</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNewTicketOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTicket} className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  সমস্যার ধরন / ক্যাটাগরি <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-text text-xs focus:outline-hidden focus:border-primary transition-colors"
                >
                  <option value="payment">পেমেন্ট ও অর্ডার সমস্যা (যেমন: পেমেন্ট রিজেক্ট, TrxID মেলেনি)</option>
                  <option value="course_access">কোর্স অ্যাক্সেস বা ক্লাসরুম সমস্যা</option>
                  <option value="player">ভিডিও প্লেয়ার বা লেকচার দেখতে সমস্যা</option>
                  <option value="account">অ্যাকাউন্ট বা প্রোফাইল সমস্যা</option>
                  <option value="other">অন্যান্য অনুসন্ধান ও জিজ্ঞাসা</option>
                </select>
              </div>

              {/* Linked Order (if available) */}
              {userOrders.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">
                    সম্পর্কিত অর্ডার (যদি থাকে)
                  </label>
                  <select
                    value={selectedOrderNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedOrderNumber(val);
                      const matched = userOrders.find((o) => o.orderNumber === val);
                      if (matched) {
                        setSelectedCourseTitle(matched.courseTitle || "");
                        if (!newSubject) {
                          setNewSubject(`অর্ডার সমস্যা: ${matched.courseTitle} (#${matched.orderNumber})`);
                        }
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-text text-xs focus:outline-hidden focus:border-primary transition-colors font-mono"
                  >
                    <option value="">কোনো নির্দিষ্ট অর্ডার নেই</option>
                    {userOrders.map((ord) => (
                      <option key={ord.id} value={ord.orderNumber}>
                        #{ord.orderNumber} — {ord.courseTitle} ({ord.status === "paid" ? "অনুমোদিত" : ord.status === "failed" ? "বাতিলকৃত" : "অপেক্ষমান"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">গুরুত্ব / প্রায়োরিটি</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPriority("normal")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      newPriority === "normal"
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-surface-secondary border-border text-text-muted hover:text-text"
                    }`}
                  >
                    সাধারণ (Normal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPriority("high")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      newPriority === "high"
                        ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400"
                        : "bg-surface-secondary border-border text-text-muted hover:text-text"
                    }`}
                  >
                    জরুরি / পেমেন্ট (High)
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  বিষয়ের শিরোনাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="যেমন: পেমেন্ট রিজেক্ট হয়েছে, TrxID চেক করুন"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-text text-xs focus:outline-hidden focus:border-primary transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-text mb-1.5">
                  বিস্তারিত বিবরণ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                  placeholder="সমস্যাটির বিস্তারিত লিখুন (যেমন: প্রেরক নম্বর, লেনদেনের তারিখ ও সময় বা কি সমস্যা হচ্ছে)..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-border text-text text-xs focus:outline-hidden focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-surface-secondary hover:bg-surface-secondary/80 border border-border text-text text-xs font-bold transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newSubject.trim() || !newMessage.trim()}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>টিকিট জমা দিন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 max-w-6xl mx-auto pb-12 font-bengali p-6">
          <div className="p-8 text-center text-xs text-text-muted">
            <RefreshCw className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
            <span>সাপোর্ট প্যানেল লোড হচ্ছে...</span>
          </div>
        </div>
      }
    >
      <SupportContent />
    </Suspense>
  );
}
