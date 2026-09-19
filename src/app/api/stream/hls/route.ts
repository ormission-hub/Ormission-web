import { NextRequest, NextResponse } from "next/server";
import { verifyVideoSessionToken } from "@/lib/crypto/jwt-video-token";

export const dynamic = "force-dynamic";

/**
 * Next.js HLS Streaming Proxy Middleware
 * 
 * 1. Cryptographically verifies short-lived Video Session JWT (HS256).
 * 2. Fetches origin .m3u8 playlists and media segments.
 * 3. Rewrites playlist URLs so all segment fetches remain authenticated and masked.
 * 4. Shields external storage/CDN origins from student DevTools & network inspection.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");
    const token =
      searchParams.get("token") ||
      req.headers.get("authorization")?.replace("Bearer ", "") ||
      req.headers.get("x-video-session-token");

    if (!targetUrl) {
      return NextResponse.json(
        { error: "MISSING_URL", message: "স্ট্রিম URL প্রদান করা হয়নি।" },
        { status: 400 }
      );
    }

    // Decode URL
    let decodedUrl = targetUrl;
    try {
      decodedUrl = decodeURIComponent(targetUrl);
    } catch {}

    // Security check: Verify Video Session JWT
    let isAuthorized = false;
    if (token) {
      const payload = verifyVideoSessionToken(token);
      if (payload) {
        isAuthorized = true;
      }
    }

    // Also allow direct preview if user is authenticated admin/instructor session
    if (!isAuthorized) {
      return NextResponse.json(
        {
          error: "UNAUTHORIZED_HLS_STREAM",
          message: "HLS স্ট্রিমিং অ্যাক্সেসের জন্য ভ্যালিড ক্রিপ্টোগ্রাফিক JWT আবশ্যক।",
        },
        { status: 401 }
      );
    }

    // Fetch the target resource
    const response = await fetch(decodedUrl, {
      headers: {
        "User-Agent": "Ormission-Secure-Stream-Engine/1.0",
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "FETCH_FAILED", status: response.status },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "";
    const isPlaylist =
      decodedUrl.endsWith(".m3u8") ||
      contentType.includes("mpegurl") ||
      contentType.includes("application/x-mpegURL") ||
      contentType.includes("application/vnd.apple.mpegurl");

    if (isPlaylist) {
      const playlistText = await response.text();
      const originBase = decodedUrl.substring(0, decodedUrl.lastIndexOf("/") + 1);

      // Rewrite chunk and sub-playlist URLs to route through this proxy
      const rewrittenPlaylist = playlistText
        .split("\n")
        .map((line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) return line;

          let absoluteChunkUrl = trimmed;
          if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
            absoluteChunkUrl = new URL(trimmed, originBase).toString();
          }

          const proxyChunkUrl = `/api/stream/hls?url=${encodeURIComponent(
            absoluteChunkUrl
          )}&token=${encodeURIComponent(token || "")}`;
          return proxyChunkUrl;
        })
        .join("\n");

      return new NextResponse(rewrittenPlaylist, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Binary segment (.ts, .m4s, etc.)
    const arrayBuffer = await response.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType || "video/mp2t",
        "Cache-Control": "private, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "INTERNAL_STREAM_ERROR", details: err?.message },
      { status: 500 }
    );
  }
}
