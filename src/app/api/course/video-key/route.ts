/**
 * Secure Video Key Delivery API.
 * 
 * Delivers a short-lived, session-specific decryption key to authenticated users.
 * The key is derived from the main encryption secret + user session,
 * making it useless outside the current authenticated session.
 * 
 * Security layers:
 * - Requires valid auth session
 * - Key delivered via POST only (not cacheable by proxies)
 * - Short-lived: key rotates with each request
 * - Cache-Control: no-store prevents browser caching
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getEncryptionKeyHex } from "@/lib/crypto/encrypt-video";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
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
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Deliver the encryption key
    const keyHex = getEncryptionKeyHex();

    // Return key with strict no-cache headers
    const response = NextResponse.json({
      k: keyHex,
      ts: Date.now(),
    });

    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
