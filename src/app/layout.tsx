import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "الصوت المحلي — منصة إعلامية جهوية",
    template: "%s — الصوت المحلي",
  },
  description: "منصة إعلامية جهوية تغطي ولاية تيارت، ولاية تيسمسيلت، ومنطقة قصر الشلالة",
  keywords: ["تيارت", "تيسمسيلت", "قصر الشلالة", "أخبار", "الصوت المحلي"],
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    siteName: "الصوت المحلي | The Local Echo",
    title: "الصوت المحلي — منصة إعلامية جهوية",
    description: "اهتمام محلي ... التزام وطني. منصة إعلامية جهوية تغطي تيارت، تيسمسيلت، وقصر الشلالة.",
    url: "https://school-news-ai-209c.apps.hostingguru.io",
  },
  twitter: {
    card: "summary",
    title: "الصوت المحلي | The Local Echo",
    description: "اهتمام محلي ... التزام وطني. منصة إعلامية جهوية تغطي تيارت، تيسمسيلت، وقصر الشلالة.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 font-sans">
        {children}
      </body>
    </html>
  );
}
