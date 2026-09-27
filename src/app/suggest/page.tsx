"use client";

import { FormEvent, useState } from "react";
import SuccessToast from "@/components/SuccessToast";

export default function SuggestPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
    window.setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium text-amber-800">로그인 없이 제보</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-800">
        동네 카페 알려주기
      </h1>
      <p className="mt-3 text-stone-500">
        아직 없는 카페를 알려주시면, 다음 버전에 목록에 넣을 수 있어요. 지금은 화면에만
        남겨 두고 저장하지는 않습니다.
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
          제보 보내기
        </button>
      </form>

      {submitted ? (
        <SuccessToast
          message="제보가 도착한 것처럼 보여 드렸어요. 저장은 다음 단계에서 연결할게요."
          onClose={() => setSubmitted(false)}
        />
      ) : null}
    </section>
  );
}
