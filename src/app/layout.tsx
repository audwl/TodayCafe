import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://todaycafe.audwl44.workers.dev"),
  title: "오늘카페 - 지금 어디 카페 갈까?",
  description: "동네 사람들이 알려주는 카페의 현재 분위기. 혼잡도, 소음, 카공 정보를 확인하세요.",
  openGraph: {
    title: "오늘카페 - 지금 어디 카페 갈까?",
    description: "동네 카페의 혼잡도, 소음, 카공 환경을 한눈에 확인하세요.",
    locale: "ko_KR",
    type: "website",
    siteName: "오늘카페",
  },
  twitter: {
    card: "summary",
    title: "오늘카페 - 지금 어디 카페 갈까?",
    description: "동네 카페의 혼잡도, 소음, 카공 환경을 한눈에 확인하세요.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fafaf8] text-stone-800">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 bg-white py-8 text-center text-sm text-stone-400">
          <p>© 2026 오늘카페 · 공개 베타</p>
          <p className="mt-1">실제 장소 정보와 이웃의 상태 제보로 운영되는 공개 베타예요.</p>
        </footer>
      </body>
    </html>
  );
}
