import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import { Navbar } from "@/components/global/navbar";
import { Footer } from "@/components/global/footer";
import { ThemeProvider } from "@/components/global/theme-provider";
import { SplashScreen } from "@/components/global/splash-screen";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ormission — Learn · Build · Grow",
    template: "%s | Ormission",
  },
  description:
    "Ormission is a premium education platform offering expert-led courses, structured learning paths, and resources to help you succeed.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "Ormission",
    title: "Ormission — Learn · Build · Grow",
    description:
      "Ormission is a premium education platform offering expert-led courses, structured learning paths, and resources to help you succeed.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ormission — Learn · Build · Grow",
    description:
      "Ormission is a premium education platform offering expert-led courses, structured learning paths, and resources to help you succeed.",
  },
  icons: {
    icon: [
      { url: "/images/brand-logo-v2.png?v=2026", sizes: "512x512", type: "image/png" },
      { url: "/icon.png?v=2026", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png?v=2026", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2026",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    robots: "noai, noimageai",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/images/brand-logo-v2.png?v=2026" type="image/png" sizes="512x512" />
        <link rel="shortcut icon" href="/favicon.ico?v=2026" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=2026" />
      </head>
      <body className="min-h-screen bg-background text-text antialiased font-sans">
        <ThemeProvider>
          <SplashScreen />
          <Navbar />
          <main className="pb-24 lg:pb-0">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
