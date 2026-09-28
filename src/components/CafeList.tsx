"use client";

import { useMemo, useState } from "react";
import { sampleCafes } from "@/data/sampleCafes";
import { filterCafes } from "@/lib/cafeUtils";
import { Cafe, FilterType } from "@/types/cafe";
import CafeCard from "./CafeCard";
import FilterBar from "./FilterBar";
import HeroSection from "./HeroSection";
import StatusUpdateModal from "./StatusUpdateModal";
import SuccessToast from "./SuccessToast";

export default function CafeList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("전체");
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredCafes = useMemo(
    () => filterCafes(sampleCafes, activeFilter, searchQuery),
    [activeFilter, searchQuery]
  );

  const handleSubmitStatus = () => {
    setSelectedCafe(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <>
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <p className="mx-auto max-w-5xl px-4 text-center text-sm text-stone-500 sm:px-6">
        계정 없이 바로 볼 수 있어요. 자리를 확인한 이웃이 현재 상태만 나눠 주세요.
      </p>
      <section id="cafe-list" className="mx-auto max-w-5xl scroll-mt-24 px-4 py-8 sm:px-6">
        {filteredCafes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 py-16 text-center">
            <p className="text-stone-500">검색 결과가 없습니다.</p>
            <p className="mt-1 text-sm text-stone-400">
              다른 키워드나 필터로 다시 찾아보세요.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCafes.map((cafe) => (
              <CafeCard
                key={cafe.id}
                cafe={cafe}
                onReportStatus={setSelectedCafe}
              />
            ))}
          </div>
        )}
      </section>

      <StatusUpdateModal
        cafe={selectedCafe}
        onClose={() => setSelectedCafe(null)}
        onSubmit={handleSubmitStatus}
      />

      {showSuccess && (
        <SuccessToast
          message="체험이 완료됐어요. 현재 입력 내용은 저장되지 않습니다."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}
