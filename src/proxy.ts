import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Comprehensive blacklist of known AI crawlers and LLM training bots
const AI_BOT_SIGNATURES = [
  "gptbot",
  "chatgpt-user",
  "chatgpt",
  "claudebot",
  "claude-web",
  "anthropic-ai",
  "perplexitybot",
  "bytespider",
  "ccbot",
  "google-extended",
  "diffbot",
  "facebookbot",
  "meta-externalagent",
  "omgilibot",
  "omgili",
  "cohere-ai",
  "cohere-training-data-crawler",
  "applebot-extended",
  "amazonbot",
  "youbot",
  "ai2bot",
  "timpibot",
  "velenpublicwebcrawler",
  "webzio-extended",
  "petalbot",
  "scrapinghub",
  "dotbot",
  "semrushbot",
  "ahrefsbot",
  "mj12bot",
];

// Blacklist of automated scraping tools, headless drivers, and CLI HTTP clients
const SCRAPER_SIGNATURES = [
  "scrapy",
  "python-requests",
  "aiohttp",
  "httpx",
  "urllib",
  "beautifulsoup",
  "curl/",
  "wget/",
  "httpclient",
  "postmanruntime",
  "go-http-client",
  "headlesschrome",
  "puppeteer",
  "playwright",
  "selenium",
  "phantomjs",
  "colly",
  "node-fetch",
  "got/",
  "axios/",
  "libwww-perl",
  "okhttp",
  "winhttp",
  "apache-httpclient",
  "zgrab",
  "nmap",
  "masscan",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow static assets, images, and public media immediately
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png" ||
    pathname === "/apple-icon.png" ||
    pathname === "/robots.txt" ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|css|js)$/i)
  ) {
    return NextResponse.next();
  }

  const userAgent = (request.headers.get("user-agent") || "").toLowerCase().trim();

  // 2. Block requests with missing, blank, or suspiciously short User-Agents
  if (!userAgent || userAgent.length < 4) {
    return new NextResponse(
      JSON.stringify({
        error: "Access Denied: Suspicious automated client request.",
        code: "INVALID_USER_AGENT",
        status: 403,
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noai, noimageai",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }

  // 3. Detect AI agent or scraper signature in User-Agent
  const isAiBot = AI_BOT_SIGNATURES.some((bot) => userAgent.includes(bot));
  const isScraper = SCRAPER_SIGNATURES.some((scraper) => userAgent.includes(scraper));

  if (isAiBot || isScraper) {
    return new NextResponse(
      JSON.stringify({
        error: "Access Denied: Automated scraping, AI crawling, and bot access are strictly prohibited on this platform.",
        code: isAiBot ? "AI_BOT_BLOCKED" : "SCRAPER_BLOCKED",
        status: 403,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noai, noimageai",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }

  // 4. For legitimate visitors, inject AI opt-out and security headers
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noai, noimageai");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

// Next.js 16 alias for backward compatibility
export const middleware = proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - static image formats
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
