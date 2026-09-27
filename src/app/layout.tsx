import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "오늘카페 - 지금 어디 카페 갈까?",
  description: "동네 사람들이 알려주는 카페의 현재 분위기. 혼잡도, 소음, 카공 정보를 확인하세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fafaf8] text-stone-800">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 bg-white py-8 text-center text-sm text-stone-400">
          <p>© 2026 오늘카페. 로그인 없이, 동네 카페의 현재 상태를 함께 나눠요.</p>
        </footer>
      </body>
    </html>
  );
}
