import { NextResponse } from "next/server";

export const runtime = "nodejs";

let cachedPatchedCore: string | null = null;

/**
 * Serves a patched, immunized version of Abyss's core.bundle.js
 * - Removes anti-devtools debugger interval that erroneously destroys the player
 * - Defangs jwplayer().remove() killer call
 * - Suppresses modal error alerts from hijacking the video screen
 */
export async function GET() {
  try {
    if (cachedPatchedCore) {
      return new NextResponse(cachedPatchedCore, {
        status: 200,
        headers: {
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    }

    const res = await fetch("https://iamcdn.net/player-v2/core.bundle.js", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Referer": "https://abyss.to/",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return new NextResponse("// Failed to fetch core bundle", { status: 502 });
    }

    let code = await res.text();

    // 1. Defang _0x2e413c (the function that destroys jwplayer)
    code = code.replace("function _0x2e413c(){", "function _0x2e413c(){return;");

    // 2. Defang _0x4b3633 (the debugger time measurement)
    code = code.replace("function _0x4b3633(){", "function _0x4b3633(){return false;");

    // 3. Prevent Notification modal popup (_0x3cb7a7) from covering the player
    code = code.replace(
      "_0x3cb7a7=(_0x5a53c1,_0x4c351b)=>{",
      '_0x3cb7a7=(_0x5a53c1,_0x4c351b)=>{console.warn("[Abyss Shield]",_0x5a53c1,_0x4c351b);return document.createElement("div");};var _unused=()=>{'
    );

    // 4. Disable the anti-devtools watcher loop entirely
    code = code.replace("_0x25bc3c||((()=>{", "true||((()=>{");

    cachedPatchedCore = code;

    return new NextResponse(code, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error("[Abyss Core Proxy Error]:", err);
    return new NextResponse("// Internal error loading core bundle", { status: 500 });
  }
}
