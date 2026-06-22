import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "الصوت المحلي — منصة إعلامية جهوية",
  description: "منصة إعلامية جهوية تغطي ولاية تيارت، ولاية تيسمسيلت، ودائرة قصر الشلالة",
  keywords: ["تيارت", "تيسمسيلت", "قصر الشلالة", "أخبار", "الصوت المحلي"],
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
