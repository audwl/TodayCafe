import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "카페 제보하기 - 오늘카페",
  description: "로그인 없이 동네 카페를 알려 주세요.",
};

export default function SuggestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
