"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loadCafes, saveCafes } from "@/lib/cafeStorage";
import { Cafe } from "@/types/cafe";

export default function SuggestPage() {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const cafe: Cafe = {
      id: `user-${Date.now()}`,
      name: String(formData.get("name") ?? "").trim(),
      neighborhood: String(formData.get("neighborhood") ?? "").trim(),
      crowdedness: null,
      noise: null,
      workFriendly: null,
      outlets: null,
      americanoPrice: Number(formData.get("americanoPrice")),
      lastUpdatedMinutes: 0,
      isUserSubmitted: true,
    };
    saveCafes([cafe, ...loadCafes()]);
    router.push("/?added=1#cafe-list");
  };

  return (
    <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium text-amber-800">로그인 없이 제보</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-800">
        동네 카페 알려주기
      </h1>
      <p className="mt-3 text-stone-500">
        제보한 카페는 이 브라우저에 바로 저장되고 카페 찾기 목록에 표시됩니다.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        <label className="block text-sm font-medium text-stone-700">
          카페 이름
          <input
            required
            name="name"
            placeholder="예: 카페 온도"
            className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
          />
        </label>
        <label className="block text-sm font-medium text-stone-700">
          아메리카노 가격
          <input
            required
            min="0"
            step="100"
            type="number"
            inputMode="numeric"
            name="americanoPrice"
            placeholder="예: 4500"
            className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
          />
        </label>
        <label className="block text-sm font-medium text-stone-700">
          동네
          <input
            required
            name="neighborhood"
            placeholder="예: 망원동"
            className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
          />
        </label>
        <label className="block text-sm font-medium text-stone-700">
          한 줄 메모
          <textarea
            name="note"
            rows={3}
            placeholder="콘센트가 많아요, 창가 자리가 좋아요 등"
            className="mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-amber-800 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-900"
        >
          카페 등록하기
        </button>
      </form>
    </section>
  );
}
