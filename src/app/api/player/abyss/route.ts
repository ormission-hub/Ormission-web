import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Clean & Ad-Blocked Abyss Player Proxy Route
 * 
 * Fetches the Abyss player for a given slug, sanitizes all popup ad scripts,
 * hides the click-jacking overlay, blocks window.open redirects, and serves
 * a pristine, ad-free streaming player to the student.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("v") || searchParams.get("slug");

    if (!slug || !/^[a-zA-Z0-9_-]{4,64}$/.test(slug)) {
      return new NextResponse("Invalid Abyss video slug", { status: 400 });
    }

    const targetUrl = `https://player.abyssplayer.com/${slug}`;
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Referer": "https://abyss.to/",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return new NextResponse("Abyss video not available or loading", { status: res.status });
    }

    let html = await res.text();

    // 1. Defang all popup URLs from Abyss client-side code
    html = html.replace(/var urls = \[[^\]]*\]/g, "var urls = []");
    html = html.replace(/popups:\s*\[[^\]]*\]/g, "popups: []");

    // 2. Inject high-performance AdBlocker CSS & JS Shield
    const adBlockShield = `
    <style>
      #overlay { display: none !important; pointer-events: none !important; width: 0 !important; height: 0 !important; z-index: -9999 !important; }
      #playback { display: none !important; pointer-events: none !important; }
      .jw-ad-container, .jw-ad-top, .jw-ads, .jw-advertising, .jw-ad-ui { display: none !important; }
      center:has(h2) { display: none !important; }
    </style>
    <script>
      (function() {
        // Block all popup window creations
        window.open = function() { 
          console.log('[AdBlock Shield] Blocked popup window'); 
          return { focus: function(){}, closed: true, close: function(){} }; 
        };
        window.abyssConfig = { popups: [] };

        // Neutralize dynamic anchor tag click popups
        var origCreate = document.createElement.bind(document);
        document.createElement = function(tag) {
          var el = origCreate(tag);
          if (tag && String(tag).toLowerCase() === 'a') {
            var origClick = el.click.bind(el);
            el.click = function() {
              var href = el.getAttribute('href') || '';
              if (/decafeligiblyhad|morphify|pop|banner|ad/i.test(href)) {
                return;
              }
              return origClick();
            };
          }
          return el;
        };
      })();
    </script>
    `;

    html = html.replace(/<\/head>/i, `${adBlockShield}</head>`);
    html = html.replace(/if\(top\.location\s*==\s*self\.location[^}]+}\s*else\s*\{/i, "{");
    html = html.replace(/Due to certain reasons \(AdBlock\/Sandbox\)[^<]*/g, "");

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("Server error loading Abyss video", { status: 500 });
  }
}
