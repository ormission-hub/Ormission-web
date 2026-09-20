import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SupportTicket } from "../route";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ticketId, sender, senderName, message, status } = body;

    if (!ticketId || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "টিকিট আইডি ও রিপ্লাই বার্তা আবশ্যক।" },
        { status: 400 }
      );
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

    const newReply = {
      id: `msg_${Date.now()}`,
      sender: (sender === "admin" ? "admin" : "student") as "admin" | "student",
      sender_name: senderName || (sender === "admin" ? "Ormission সাপোর্ট টিম" : "শিক্ষার্থী"),
      message: message.trim(),
      created_at: now,
    };

    if (!Array.isArray(ticket.replies)) {
      ticket.replies = [];
    }
    ticket.replies.push(newReply);
    ticket.updated_at = now;

    if (status) {
      ticket.status = status;
    } else if (sender === "admin" && ticket.status === "open") {
      ticket.status = "in_progress";
    }

    const { error: saveErr } = await supabaseAdmin.from("site_settings").upsert({
      key: storageKey,
      value: ticket,
      updated_at: now,
    });

    if (saveErr) {
      return NextResponse.json({ success: false, error: saveErr.message }, { status: 500 });
    }

    // If admin replied, send in-app notification to student
    if (sender === "admin" && ticket.user_id) {
      try {
        await supabaseAdmin.from("notifications").insert({
          user_id: ticket.user_id,
          type: "support_reply",
          title: `সাপোর্ট টিকিট #${ticket.id}-এ নতুন বার্তা এসেছে`,
          body: `${newReply.sender_name}: "${message.slice(0, 50)}..."`,
          link: `/dashboard/support`,
          is_read: false,
        });
      } catch {}
    }

    return NextResponse.json({ success: true, ticket, reply: newReply });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "রিপ্লাই প্রক্রিয়া করতে সমস্যা হয়েছে";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
