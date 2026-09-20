import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Clean & Ad-Blocked Abyss Player Proxy Route
 * 
 * Fetches the Abyss player for a given slug, sanitizes all popup ad scripts,
 * removes the click-jacking overlay, defangs anti-devtools killer scripts,
 * routes core scripts through an immunized pipeline, and serves a smooth,
 * 100% ad-free video player to the student.
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
      cache: "no-store",
    });

    if (!res.ok) {
      return new NextResponse("Abyss video not available or loading", { status: res.status });
    }

    let html = await res.text();

    // 1. Remove the click-jacking overlay entirely so student clicks directly interact with JWPlayer
    html = html.replace(/<div id="overlay">[\s\S]*?<\/div>\s*<\/div>/, "");

    // 2. Defang all popup URL generators & ad-block detection re-injection
    html = html.replace(/var urls = \[[^\]]*\]/g, "var urls = []");
    html = html.replace(/popups:\s*\[[^\]]*\]/g, "popups: []");
    html = html.replace(/const adBlockDetected = \(\) => \{[^}]*\};/g, "const adBlockDetected = () => { urls = []; };");
    html = html.replace(/if\(track\.window\s*>=\s*2\)/g, "if(false)");

    // 3. Neutralize external fuckadblock script
    html = html.replace(/https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/fuckadblock\/[^"']+/g, "data:text/javascript,");

    // 4. Route core bundle through our immunized local proxy
    html = html.replace(/https:\/\/iamcdn\.net\/player-v2\/core\.bundle\.js/g, "/api/player/abyss/core");

    // 5. Remove top.location frame breaker
    html = html.replace(/if\(top\.location\s*==\s*self\.location[^}]+}\s*else\s*\{/i, "{");
    html = html.replace(/Due to certain reasons \(AdBlock\/Sandbox\)[^<]*/g, "");

    // 6. Inject our robust AdBlock & Player Immunity Shield
    const immunityShield = `
    <style>
      #overlay, #playback { display: none !important; pointer-events: none !important; width: 0 !important; height: 0 !important; }
      .jw-ad-container, .jw-ad-top, .jw-ads, .jw-advertising, .jw-ad-ui { display: none !important; }
      center:has(h2) { display: none !important; }
    </style>
    <script>
      (function() {
        // A. Clear any poisoned devtool flags from sessionStorage
        try {
          sessionStorage.removeItem('devtool');
          var origSetItem = sessionStorage.setItem.bind(sessionStorage);
          sessionStorage.setItem = function(k, v) {
            if (k === 'devtool') return;
            return origSetItem(k, v);
          };
        } catch(e) {}

        // B. Neutralize Function('debugger') anti-devtool trap
        var origFunction = window.Function;
        window.Function = function() {
          for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === 'string' && arguments[i].indexOf('debugger') !== -1) {
              return function() {};
            }
          }
          return origFunction.apply(this, arguments);
        };
        window.Function.prototype = origFunction.prototype;

        // C. Block popup windows
        window.open = function() { 
          return { focus: function(){}, closed: true, close: function(){} }; 
        };
        window.abyssConfig = { popups: [] };

        // D. Intercept and protect JWPlayer instance from being destroyed
        var checkCount = 0;
        var protectJw = function() {
          if (window.jwplayer && !window.jwplayer.__shielded) {
            var origJw = window.jwplayer;
            var wrapInst = function(inst) {
              if (!inst) return inst;
              inst.remove = function() { return inst; };
              inst.destroy = function() { return inst; };
              return inst;
            };
            window.jwplayer = function() {
              var inst = origJw.apply(this, arguments);
              return wrapInst(inst);
            };
            Object.assign(window.jwplayer, origJw);
            window.jwplayer.__shielded = true;
          }
          checkCount++;
          if (checkCount > 100) clearInterval(jwTimer);
        };
        var jwTimer = setInterval(protectJw, 50);

        // E. Defang any anchor click popups
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

    html = html.replace(/<\/head>/i, `${immunityShield}</head>`);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("[Abyss Route Error]:", err);
    return new NextResponse("Server error loading Abyss video", { status: 500 });
  }
}
