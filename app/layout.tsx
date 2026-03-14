import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR, Geist_Mono } from "next/font/google";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "연말정산 미리계산",
  description: "연말정산 예상 환급액과 실수령액을 미리 계산해보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSerifKR.variable} ${notoSansKR.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
          <Navigation />
          <div className="flex min-h-screen flex-col pb-16 md:pb-0 md:col-start-2">
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
