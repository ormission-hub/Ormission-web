import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch current count
    const { data: current, error: fetchErr } = await supabase
      .from("resources")
      .select("download_count")
      .eq("id", id)
      .single();

    if (fetchErr || !current) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    const newCount = (current.download_count || 0) + 1;

    const { error: updateErr } = await supabase
      .from("resources")
      .update({ download_count: newCount, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (updateErr) {
      console.warn("Failed to increment download count:", updateErr.message);
    }

    return NextResponse.json({ success: true, downloadCount: newCount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
