import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Global Market Monitor | 글로벌 마켓 모니터링 터미널",
  description: "글로벌 주요 주식 지수, 외환, 원자재, 미 국채 금리, VIX 공포지수 및 거시경제 지표를 실시간으로 모니터링하는 차세대 대시보드",
  keywords: ["Global Market", "Stock Market", "Forex", "S&P 500", "Nasdaq", "USD/KRW", "VIX", "Bonds", "Crypto"],
  openGraph: {
    title: "Global Market Monitor",
    description: "Real-time Financial Intelligence & Index Analytics Terminal",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#070a12] text-slate-100">
        {children}
      </body>
    </html>
  );
}
