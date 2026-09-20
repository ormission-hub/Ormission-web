import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export interface SupportTicket {
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
  replies: Array<{
    id: string;
    sender: "student" | "admin";
    sender_name: string;
    message: string;
    created_at: string;
  }>;
}

// GET: Fetch tickets
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    // Fetch from site_settings persistent storage
    const { data: records, error } = await supabaseAdmin
      .from("site_settings")
      .select("*")
      .like("key", "ticket_%")
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    let tickets: SupportTicket[] = (records || [])
      .map((r) => r.value as SupportTicket)
      .filter(Boolean);

    // Filter by userId if requested by student
    if (userId) {
      tickets = tickets.filter((t) => t.user_id === userId);
    }

    // Filter by status if specified
    if (status && status !== "all") {
      tickets = tickets.filter((t) => t.status === status);
    }

    // Sort by updated_at descending
    tickets.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return NextResponse.json({ success: true, data: tickets });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "টিকিট লোড করতে সমস্যা হয়েছে";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST: Create a new ticket
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      userName,
      userEmail,
      userPhone,
      category,
      subject,
      message,
      orderNumber,
      courseTitle,
      priority = "normal",
    } = body;

    if (!userId || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "ইউজার আইডি, বিষয় এবং বিস্তারিত বিবরণ আবশ্যক।" },
        { status: 400 }
      );
    }

    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const newTicket: SupportTicket = {
      id: ticketId,
      user_id: userId,
      user_name: userName || "শিক্ষার্থী",
      user_email: userEmail || "",
      user_phone: userPhone || "",
      category: category || "payment",
      subject: subject.trim(),
      message: message.trim(),
      order_number: orderNumber || "",
      course_title: courseTitle || "",
      status: "open",
      priority: priority || (category === "payment" ? "high" : "normal"),
      created_at: now,
      updated_at: now,
      replies: [
        {
          id: `msg_${Date.now()}`,
          sender: "student",
          sender_name: userName || "শিক্ষার্থী",
          message: message.trim(),
          created_at: now,
        },
      ],
    };

    const storageKey = `ticket_${ticketId}`;

    const { error: insertErr } = await supabaseAdmin.from("site_settings").upsert({
      key: storageKey,
      value: newTicket,
      updated_at: now,
    });

    if (insertErr) {
      console.error("Ticket storage error:", insertErr);
      return NextResponse.json(
        { success: false, error: "টিকিট সংরক্ষণ ব্যর্থ হয়েছে।" },
        { status: 500 }
      );
    }

    // Try creating notification for user
    try {
      await supabaseAdmin.from("notifications").insert({
        user_id: userId,
        type: "support_ticket_created",
        title: `নতুন সাপোর্ট টিকিট তৈরি হয়েছে (#${ticketId})`,
        body: `আপনার টিকিট "${subject.slice(0, 40)}..." সফলভাবে জমা হয়েছে। আমাদের টিম শীঘ্রই যোগাযোগ করবে।`,
        link: `/dashboard/support`,
        is_read: false,
      });
    } catch {}

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      message: "সাপোর্ট টিকিট সফলভাবে জমা দেওয়া হয়েছে।",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "টিকিট জমা দিতে সমস্যা হয়েছে";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// PATCH: Update ticket status or priority
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { ticketId, status, priority } = body;

    if (!ticketId) {
      return NextResponse.json({ success: false, error: "টিকিট আইডি আবশ্যক।" }, { status: 400 });
    }

    const storageKey = `ticket_${ticketId}`;
    const { data: record, error: fetchErr } = await supabaseAdmin
      .from("site_settings")
      .select("*")
      .eq("key", storageKey)
      .maybeSingle();

    if (fetchErr || !record?.value) {
      return NextResponse.json({ success: false, error: "টিকিট পাওয়া যায়নি।" }, { status: 404 });
    }

    const ticket = record.value as SupportTicket;
    const now = new Date().toISOString();

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    ticket.updated_at = now;

    const { error: updateErr } = await supabaseAdmin.from("site_settings").upsert({
      key: storageKey,
      value: ticket,
      updated_at: now,
    });

    if (updateErr) {
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, ticket });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "আপডেট করতে সমস্যা হয়েছে";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE: Delete ticket completely from database
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let ticketId = searchParams.get("ticketId");

    if (!ticketId) {
      try {
        const body = await request.json();
        ticketId = body.ticketId;
      } catch {}
    }

    if (!ticketId) {
      return NextResponse.json({ success: false, error: "টিকিট আইডি আবশ্যক।" }, { status: 400 });
    }

    const storageKey = `ticket_${ticketId}`;

    const { error: deleteErr } = await supabaseAdmin
      .from("site_settings")
      .delete()
      .eq("key", storageKey);

    if (deleteErr) {
      return NextResponse.json({ success: false, error: deleteErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `সাপোর্ট টিকিট #${ticketId} ডাটাবেজ থেকে সম্পূর্ণ মুছে ফেলা হয়েছে।`,
      ticketId,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "ডিলিট করতে সমস্যা হয়েছে";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

