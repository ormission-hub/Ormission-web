import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// POST: Create a new manual payment order
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json(
        { success: false, error: "ইউজার আইডি আবশ্যক।" },
        { status: 400 }
      );
    }

    // Robust Course ID resolution (handles numeric IDs, string IDs, slugs, or titles)
    let validCourseId: number | null = null;
    if (body.courseId && !isNaN(Number(body.courseId))) {
      validCourseId = Number(body.courseId);
    }

    // If courseId is not a valid number (e.g. "course-1") or not found, resolve by slug
    if (!validCourseId && body.courseSlug) {
      const { data: cData } = await supabaseAdmin
        .from("courses")
        .select("id")
        .eq("slug", body.courseSlug)
        .maybeSingle();
      if (cData?.id) {
        validCourseId = cData.id;
      }
    }

    // Fallback search by title
    if (!validCourseId && body.courseTitle) {
      const { data: cData } = await supabaseAdmin
        .from("courses")
        .select("id")
        .or(`title.eq."${body.courseTitle}",title_bn.eq."${body.courseTitle}"`)
        .maybeSingle();
      if (cData?.id) {
        validCourseId = cData.id;
      }
    }

    // If still not found, auto-create minimal course record so foreign key is guaranteed
    if (!validCourseId && body.courseSlug) {
      const { data: newCourse } = await supabaseAdmin
        .from("courses")
        .insert({
          slug: body.courseSlug,
          title: body.courseTitle || body.courseSlug,
          title_bn: body.courseTitle || body.courseSlug,
          price: Number(body.finalAmount) || 0,
          status: "published",
        })
        .select("id")
        .single();
      if (newCourse?.id) {
        validCourseId = newCourse.id;
      }
    }

    // Final fallback to any valid course ID in DB
    if (!validCourseId) {
      const { data: anyCourse } = await supabaseAdmin
        .from("courses")
        .select("id")
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (anyCourse?.id) {
        validCourseId = anyCourse.id;
      }
    }

    if (!validCourseId) {
      return NextResponse.json(
        { success: false, error: "কোর্স আইডি পাওয়া যায়নি।" },
        { status: 400 }
      );
    }

    const orderNumber =
      body.orderNumber || `ORM-${Math.floor(100000 + Math.random() * 900000)}`;
    const txIdValue =
      body.transactionId?.trim() || `TXN${Date.now().toString().slice(-8)}`;
    const senderNumber = body.senderNumber?.trim() || "";

    const orderPayload = {
      user_id: body.userId,
      course_id: validCourseId,
      original_amount: Number(body.originalAmount) || Number(body.finalAmount) || 0,
      discount_amount: Number(body.discountAmount) || 0,
      final_amount: Number(body.finalAmount) || 0,
      status: "pending",
      payment_method: body.paymentMethod || "bkash",
      notes: JSON.stringify({
        order_number: orderNumber,
        sender_number: senderNumber,
        transaction_id: txIdValue,
        payment_method: body.paymentMethod || "bkash",
        course_title: body.courseTitle || "",
        course_slug: body.courseSlug || "",
        student_name: body.studentName || "",
        student_phone: body.studentPhone || senderNumber,
        student_email: body.studentEmail || "",
        submitted_at: new Date().toISOString(),
      }),
    };

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert(orderPayload)
      .select()
      .single();

    if (orderErr) {
      console.error("Error creating order:", orderErr);
      return NextResponse.json(
        { success: false, error: orderErr.message },
        { status: 500 }
      );
    }

    // Also record in payments table
    try {
      await supabaseAdmin.from("payments").insert({
        order_id: order.id,
        gateway: body.paymentMethod || "bkash",
        transaction_id: txIdValue,
        gateway_ref: senderNumber,
        amount: Number(body.finalAmount) || 0,
        currency: "BDT",
        status: "pending",
        raw_response: {
          order_number: orderNumber,
          sender_number: senderNumber,
          transaction_id: txIdValue,
          submitted_at: new Date().toISOString(),
        },
      });
    } catch (payErr) {
      console.warn("Payment entry warning:", payErr);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber,
      transactionId: txIdValue,
      status: "pending",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "অর্ডার প্রক্রিয়াকরণ ব্যর্থ হয়েছে";
    console.error("Order API exception:", err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// GET: Fetch student orders by userId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "ইউজার আইডি প্রদান করুন।" },
        { status: 400 }
      );
    }

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        courses:course_id (
          id,
          title,
          title_bn,
          slug,
          thumbnail_url
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Enrich orders with parsed notes
    const formattedOrders = (orders || []).map((ord) => {
      let parsedNotes: any = {};
      try {
        if (ord.notes && ord.notes.startsWith("{")) {
          parsedNotes = JSON.parse(ord.notes);
        }
      } catch {
        // fallback
      }

      return {
        ...ord,
        orderNumber: parsedNotes.order_number || String(ord.id || "").slice(0, 8).toUpperCase(),
        senderNumber: parsedNotes.sender_number || "",
        transactionId: parsedNotes.transaction_id || "",
        courseTitle:
          ord.courses?.title_bn ||
          ord.courses?.title ||
          parsedNotes.course_title ||
          "কোর্স",
      };
    });

    return NextResponse.json({ success: true, data: formattedOrders });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "অর্ডার লোড ব্যর্থ হয়েছে";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE: Delete an order by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }

    // Delete associated payments first
    await supabaseAdmin
      .from("payments")
      .delete()
      .eq("order_id", id);

    // Delete the order
    const { error } = await supabaseAdmin
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "অর্ডার ডিলিট ব্যর্থ হয়েছে";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
