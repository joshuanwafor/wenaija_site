import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Nigeria's own social network`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Nigerian social network",
    "WeNaija",
    "social app Nigeria",
    "local feed Nigeria",
    "LGA social network",
    "Nigerian community app",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Nigeria's own social network`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Nigeria's own social network`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c1310",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: site.name,
              url: site.url,
              description: site.description,
              email: site.email,
              areaServed: "Nigeria",
            }),
          }}
        />
      </body>
    </html>
  );
}
