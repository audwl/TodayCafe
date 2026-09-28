"use client";

import { useState } from "react";
import {
  Cafe,
  Crowdedness,
  NoiseLevel,
  OutletLevel,
  StatusUpdateForm,
} from "@/types/cafe";

interface StatusUpdateModalProps {
  cafe: Cafe | null;
  onClose: () => void;
  onSubmit: (form: StatusUpdateForm) => void;
}

const crowdednessOptions: Crowdedness[] = ["여유", "보통", "혼잡"];
const noiseOptions: NoiseLevel[] = ["조용", "보통", "시끄러움"];
const outletOptions: OutletLevel[] = ["많음", "보통", "적음"];

function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-stone-700">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full px-4 py-2 text-sm transition-all ${
              value === option
                ? "bg-amber-800 text-white"
                : "border border-stone-200 bg-white text-stone-600 hover:border-amber-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function StatusUpdateModal({
  cafe,
  onClose,
  onSubmit,
}: StatusUpdateModalProps) {
  const [form, setForm] = useState<StatusUpdateForm>({
    crowdedness: "보통",
    noise: "보통",
    workFriendly: true,
    outlets: "보통",
  });

  if (!cafe) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 p-4 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-modal-title"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 id="status-modal-title" className="text-lg font-bold text-stone-800">
              현재 상태 공유하기
            </h2>
            <p className="mt-1 text-sm text-stone-500">{cafe.name} · 이 브라우저에 저장돼요</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <OptionGroup
            label="혼잡도"
            options={crowdednessOptions}
            value={form.crowdedness}
            onChange={(value) => setForm({ ...form, crowdedness: value })}
          />

          <OptionGroup
            label="소음"
            options={noiseOptions}
            value={form.noise}
            onChange={(value) => setForm({ ...form, noise: value })}
          />

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-stone-700">
              카공하기 좋음
            </legend>
            <div className="flex gap-2">
              {[
                { label: "예", value: true },
                { label: "아니오", value: false },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setForm({ ...form, workFriendly: value })}
                  className={`rounded-full px-4 py-2 text-sm transition-all ${
                    form.workFriendly === value
                      ? "bg-amber-800 text-white"
                      : "border border-stone-200 bg-white text-stone-600 hover:border-amber-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <OptionGroup
            label="콘센트"
            options={outletOptions}
            value={form.outlets}
            onChange={(value) => setForm({ ...form, outlets: value })}
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-amber-800 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-900"
          >
            현재 상태 저장하기
          </button>
        </form>
      </div>
    </div>
  );
}
