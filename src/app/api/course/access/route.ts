import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { encryptVideoUrl, encryptServersArray, DECOY_HONEYPOT_URL } from "@/lib/crypto/encrypt-video";
import { signVideoSessionToken } from "@/lib/crypto/jwt-video-token";
import { cleanAndNormalizeVideoUrl } from "@/lib/video-helpers";


export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseSlug, lessonId } = body;

    if (!courseSlug || !lessonId) {
      return NextResponse.json(
        { authorized: false, error: "Course slug and lesson ID required" },
        { status: 400 }
      );
    }

    // 1. Fetch user authentication session
    const supabase = await createClient();
    let user = null;

    // Check Bearer token if provided in header (using supabaseAdmin for reliable JWT verification)
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      try {
        const { data } = await supabaseAdmin.auth.getUser(token);
        user = data?.user || null;
      } catch {
        // fallback to standard client below
      }
    }

    if (!user) {
      try {
        const { data } = await supabase.auth.getUser();
        user = data?.user || null;
      } catch {
        user = null;
      }
    }

    // 2. Lookup course and lesson in Supabase
    let courseData: any = null;
    let targetLesson: any = null;

    const { data: dbCourse } = await supabaseAdmin
      .from("courses")
      .select(`
        id,
        slug,
        price,
        is_free,
        course_sections (
          id,
          lessons (
            *,
            lesson_servers (
              id,
              server_name,
              server_type,
              video_url,
              is_enabled,
              sort_order
            )
          )
        )
      `)
      .eq("slug", courseSlug)
      .maybeSingle();

    if (dbCourse) {
      courseData = dbCourse;
      if (Array.isArray(dbCourse.course_sections)) {
        for (const sec of dbCourse.course_sections) {
          if (Array.isArray(sec.lessons)) {
            const found = sec.lessons.find((l: any) => String(l.id) === String(lessonId));
            if (found) {
              // Build servers array from lesson_servers (enabled only, sorted)
              const rawServers = Array.isArray(found.lesson_servers) ? found.lesson_servers : [];
              const enabledServers = rawServers
                .filter((s: any) => s.is_enabled)
                .sort((a: any, b: any) => (a.sort_order || 1) - (b.sort_order || 1))
                .map((s: any) => ({
                  name: (s.server_name && s.server_name.trim()) ? s.server_name.trim() : `Server ${s.sort_order || 1}`,
                  type: s.server_type,
                  url: cleanAndNormalizeVideoUrl(s.video_url || ""),
                }));

              // Build final servers list — deduplicate by URL
              let finalServers = enabledServers.length > 0
                ? enabledServers
                : (found.video_url ? [{ name: "Server 1", type: "youtube", url: cleanAndNormalizeVideoUrl(found.video_url) }] : []);

              // Deduplicate by URL (case-insensitive)
              const seenUrls = new Set<string>();
              finalServers = finalServers.filter((s: any) => {
                const key = (s.url || "").toLowerCase().trim();
                if (!key || seenUrls.has(key)) return false;
                seenUrls.add(key);
                return true;
              });

              // Primary videoUrl: first server
              const primaryUrl = finalServers.length > 0 ? finalServers[0].url : cleanAndNormalizeVideoUrl(found.video_url || "");

              targetLesson = {
                id: String(found.id),
                videoUrl: primaryUrl,
                servers: finalServers,
                isFreePreview: found.is_preview === true,
              };
              break;
            }
          }
        }
      }
    }

    // No static/mock fallback — lesson must exist in the real DB

    if (!targetLesson) {
      return NextResponse.json(
        { authorized: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    // 3. Authorization Check: Free Preview
    if (targetLesson.isFreePreview) {
      return NextResponse.json({
        authorized: true,
        isFreePreview: true,
        isEncrypted: false,
        videoUrl: targetLesson.videoUrl,
        servers: targetLesson.servers,
      });
    }

    // Course is completely free (0 Taka)
    if (courseData && (courseData.price === 0 || courseData.is_free === true)) {
      return NextResponse.json({
        authorized: true,
        isFreePreview: false,
        isEncrypted: false,
        videoUrl: targetLesson.videoUrl,
        servers: targetLesson.servers,
      });
    }

    // 4. Admin Preview Bypass: Admins & superadmins have full access to inspect/test all lessons & servers
    if (user) {
      const { data: userProfile } = await supabaseAdmin
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (userProfile?.role === "admin" || userProfile?.role === "superadmin") {
        const videoSessionToken = signVideoSessionToken({
          sub: user.id,
          email: user.email,
          courseId: courseData?.id || courseSlug,
          courseSlug: courseSlug,
          lessonId: targetLesson.id,
        }, 7200);

        return NextResponse.json({
          authorized: true,
          isFreePreview: false,
          isAdmin: true,
          isEncrypted: true,
          decoyUrl: DECOY_HONEYPOT_URL,
          videoUrl: encryptVideoUrl(targetLesson.videoUrl),
          servers: encryptServersArray(targetLesson.servers),
          videoSessionToken,
        });
      }
    }

    // 5. Paid / Locked Lesson Verification
    // Unauthenticated user -> DENY (Strict JWT Authentication required)
    if (!user) {
      return NextResponse.json(
        {
          authorized: false,
          reason: "unauthenticated",
          error: "JWT_AUTH_REQUIRED",
          message: "পেইড ক্লাস দেখার জন্য বৈধ JWT অথেনটিকেশন টোকেন আবশ্যক। অনুগ্রহ করে লগইন করুন।",
        },
        { status: 401 }
      );
    }

    // Authenticated user -> Verify paid order or active enrollment in Supabase
    let isEnrolled = false;

    // Check enrollments table
    if (courseData?.id && !isNaN(Number(courseData.id))) {
      const { data: enrollment } = await supabaseAdmin
        .from("enrollments")
        .select("id, is_active")
        .eq("user_id", user.id)
        .eq("course_id", Number(courseData.id))
        .eq("is_active", true)
        .maybeSingle();

      if (enrollment) {
        isEnrolled = true;
      }
    }

    // Check approved orders table
    if (!isEnrolled) {
      let orderQuery = supabaseAdmin
        .from("orders")
        .select("id, status, notes")
        .eq("user_id", user.id)
        .in("status", ["paid", "completed"]);

      if (courseData?.id && !isNaN(Number(courseData.id))) {
        orderQuery = orderQuery.or(`course_id.eq.${courseData.id},notes.ilike.%"course_slug":"${courseSlug}"%`);
      } else {
        orderQuery = orderQuery.ilike("notes", `%"course_slug":"${courseSlug}"%`);
      }

      const { data: approvedOrder } = await orderQuery.maybeSingle();
      if (approvedOrder) {
        isEnrolled = true;
      }
    }

    // Check profile phone & email fallback matching
    if (!isEnrolled && user) {
      const { data: userProfile } = await supabaseAdmin
        .from("profiles")
        .select("phone")
        .eq("id", user.id)
        .maybeSingle();

      const userPhone = userProfile?.phone || user.phone || "";
      const userEmail = user.email || "";

      let fallbackOrderQuery = supabaseAdmin
        .from("orders")
        .select("id, status")
        .in("status", ["paid", "completed"]);

      if (courseData?.id && !isNaN(Number(courseData.id))) {
        fallbackOrderQuery = fallbackOrderQuery.eq("course_id", Number(courseData.id));
      }

      const orConditions: string[] = [];
      if (userPhone) {
        orConditions.push(`notes.ilike.%"student_phone":"${userPhone}"%`);
        orConditions.push(`notes.ilike.%"sender_number":"${userPhone}"%`);
      }
      if (userEmail) {
        orConditions.push(`notes.ilike.%"student_email":"${userEmail}"%`);
      }

      if (orConditions.length > 0) {
        fallbackOrderQuery = fallbackOrderQuery.or(orConditions.join(","));
        const { data: matchedOrder } = await fallbackOrderQuery.maybeSingle();
        if (matchedOrder) {
          isEnrolled = true;
          // Auto-sync enrollment to enrollments table so subsequent calls are instant
          try {
            await supabaseAdmin.from("enrollments").upsert({
              user_id: user.id,
              course_id: Number(courseData.id),
              order_id: matchedOrder.id,
              is_active: true,
              enrolled_at: new Date().toISOString(),
            }, { onConflict: "user_id,course_id" });
          } catch {}
        }
      }
    }

    // If user is verified enrolled: GRANT ACCESS with signed Video Session JWT
    if (isEnrolled) {
      const videoSessionToken = signVideoSessionToken({
        sub: user.id,
        email: user.email,
        courseId: courseData?.id || courseSlug,
        courseSlug: courseSlug,
        lessonId: targetLesson.id,
      }, 7200);

      return NextResponse.json({
        authorized: true,
        isFreePreview: false,
        isEnrolled: true,
        isEncrypted: true,
        decoyUrl: DECOY_HONEYPOT_URL,
        videoUrl: encryptVideoUrl(targetLesson.videoUrl),
        servers: encryptServersArray(targetLesson.servers),
        videoSessionToken,
      });
    }

    // Check if user has a pending payment order waiting for admin verification
    let pendingQuery = supabaseAdmin
      .from("orders")
      .select("id, status, notes")
      .eq("user_id", user.id)
      .eq("status", "pending");

    if (courseData?.id && !isNaN(Number(courseData.id))) {
      pendingQuery = pendingQuery.or(`course_id.eq.${courseData.id},notes.ilike.%"course_slug":"${courseSlug}"%`);
    } else {
      pendingQuery = pendingQuery.ilike("notes", `%"course_slug":"${courseSlug}"%`);
    }

    const { data: pendingOrder } = await pendingQuery.maybeSingle();
    if (pendingOrder) {
      let parsedNotes: any = {};
      try {
        if (pendingOrder.notes && pendingOrder.notes.startsWith("{")) {
          parsedNotes = JSON.parse(pendingOrder.notes);
        }
      } catch {}

      return NextResponse.json({
        authorized: false,
        isPending: true,
        reason: "pending_verification",
        orderNumber: parsedNotes.order_number || pendingOrder.id.slice(0, 8),
        transactionId: parsedNotes.transaction_id || "",
        message: "আপনার পেমেন্ট রিকোয়েস্ট যাচাইকরণ প্রক্রিয়াধীন রয়েছে। অ্যাডমিন যাচাই সম্পন্ন করলেই ক্লাসটি চালু হয়ে যাবে।",
      });
    }

    // Non-enrolled user -> DENY ACCESS (Strict anti-bypass, zero video URL leak)
    return NextResponse.json({
      authorized: false,
      isPending: false,
      reason: "not_enrolled",
      message: "এই ক্লাসটি শুধুমাত্র এনরোল্ড শিক্ষার্থীদের জন্য সংরক্ষিত।",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ authorized: false, error: message }, { status: 500 });
  }
}

// GET: Check user's enrollment and order status for a course
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseSlug = searchParams.get("courseSlug");

    if (!courseSlug) {
      return NextResponse.json({ success: false, error: "Course slug required" }, { status: 400 });
    }

    const supabase = await createClient();
    let user = null;

    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      try {
        const { data } = await supabaseAdmin.auth.getUser(token);
        user = data?.user || null;
      } catch {
        // fallback
      }
    }

    if (!user) {
      try {
        const { data } = await supabase.auth.getUser();
        user = data?.user || null;
      } catch {
        user = null;
      }
    }

    if (!user) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        isEnrolled: false,
        isPending: false,
      });
    }

    // Resolve course
    const { data: dbCourse } = await supabaseAdmin
      .from("courses")
      .select("id, slug, price, is_free")
      .eq("slug", courseSlug)
      .maybeSingle();

    const courseId = dbCourse?.id;

    // Check enrollments
    let isEnrolled = false;
    if (courseId && !isNaN(Number(courseId))) {
      const { data: enrollment } = await supabaseAdmin
        .from("enrollments")
        .select("id, is_active")
        .eq("user_id", user.id)
        .eq("course_id", Number(courseId))
        .eq("is_active", true)
        .maybeSingle();

      if (enrollment) isEnrolled = true;
    }

    // Check approved orders
    if (!isEnrolled) {
      let orderQuery = supabaseAdmin
        .from("orders")
        .select("id, status, notes")
        .eq("user_id", user.id)
        .in("status", ["paid", "completed"]);

      if (courseId && !isNaN(Number(courseId))) {
        orderQuery = orderQuery.or(`course_id.eq.${courseId},notes.ilike.%"course_slug":"${courseSlug}"%`);
      } else {
        orderQuery = orderQuery.ilike("notes", `%"course_slug":"${courseSlug}"%`);
      }

      const { data: approvedOrder } = await orderQuery.maybeSingle();
      if (approvedOrder) isEnrolled = true;
    }

    // Check pending orders
    let isPending = false;
    let pendingOrderDetails: any = null;
    if (!isEnrolled) {
      let pendingQuery = supabaseAdmin
        .from("orders")
        .select("id, status, notes")
        .eq("user_id", user.id)
        .eq("status", "pending");

      if (courseId && !isNaN(Number(courseId))) {
        pendingQuery = pendingQuery.or(`course_id.eq.${courseId},notes.ilike.%"course_slug":"${courseSlug}"%`);
      } else {
        pendingQuery = pendingQuery.ilike("notes", `%"course_slug":"${courseSlug}"%`);
      }

      const { data: pendingOrd } = await pendingQuery.maybeSingle();
      if (pendingOrd) {
        isPending = true;
        try {
          if (pendingOrd.notes && pendingOrd.notes.startsWith("{")) {
            pendingOrderDetails = JSON.parse(pendingOrd.notes);
          }
        } catch {}
      }
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      isEnrolled,
      isPending,
      pendingOrder: pendingOrderDetails,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
