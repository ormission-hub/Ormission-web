import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const aiBots = [
    "GPTBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Bytespider",
    "CCBot",
    "Google-Extended",
    "Diffbot",
    "FacebookBot",
    "Meta-ExternalAgent",
    "Omgilibot",
    "Cohere-ai",
    "Applebot-Extended",
    "Amazonbot",
    "Scrapy",
    "AI2Bot",
    "YouBot",
    "cohere-training-data-crawler",
    "Webzio-Extended",
    "Timpibot",
    "VelenPublicWebCrawler",
  ];

  return {
    rules: [
      // 1. Completely disallow all AI agents and LLM scrapers from the entire platform
      ...aiBots.map((bot) => ({
        userAgent: bot,
        disallow: ["/"],
      })),
      // 2. Disallow general crawlers from private and student-only areas
      {
        userAgent: "*",
        allow: ["/", "/about", "/contact", "/courses"],
        disallow: [
          "/api/",
          "/course/*/learn/",
          "/dashboard/",
          "/checkout/",
          "/account/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || "https://ormission.com"}/sitemap.xml`,
  };
}
