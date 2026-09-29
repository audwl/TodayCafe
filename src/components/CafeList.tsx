"use client";

import { useEffect, useMemo, useState } from "react";
import { sampleCafes } from "@/data/sampleCafes";
import { loadCafes, saveCafes } from "@/lib/cafeStorage";
import { filterCafes } from "@/lib/cafeUtils";
import { Cafe, FilterType, NaverPlace, StatusUpdateForm } from "@/types/cafe";
import CafeCard from "./CafeCard";
import FilterBar from "./FilterBar";
import HeroSection from "./HeroSection";
import StatusUpdateModal from "./StatusUpdateModal";
import SuccessToast from "./SuccessToast";

export default function CafeList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("전체");
  const [cafes, setCafes] = useState<Cafe[]>(sampleCafes);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [places, setPlaces] = useState<NaverPlace[]>([]);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      setCafes(loadCafes());
      if (new URLSearchParams(window.location.search).has("added")) {
        setShowSuccess(true);
        window.history.replaceState(null, "", "/#cafe-list");
        window.setTimeout(() => setShowSuccess(false), 4000);
      }
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  const filteredCafes = useMemo(
    () => filterCafes(cafes, activeFilter, searchQuery),
    [activeFilter, cafes, searchQuery]
  );

  const handleNaverSearch = async () => {
    const query = searchQuery.trim();
    if (query.length < 2) return;

    setIsSearching(true);
    setSearchError("");
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = (await response.json()) as { items?: NaverPlace[]; error?: string };
      if (!response.ok) throw new Error(data.error || "검색 결과를 불러오지 못했습니다.");
      setPlaces(data.items ?? []);
      if (!data.items?.length) setSearchError("네이버에서 검색 결과를 찾지 못했습니다.");
    } catch (error) {
      setPlaces([]);
      setSearchError(error instanceof Error ? error.message : "검색 중 오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
    }
  };

  const addNaverPlace = (place: NaverPlace) => {
    const address = place.roadAddress || place.address;
    const duplicate = cafes.some(
      (cafe) => cafe.name === place.title && (cafe.address || cafe.neighborhood) === address
    );
    if (duplicate) {
      setSearchError("이미 내 목록에 있는 카페입니다.");
      return;
    }

    const cafe: Cafe = {
      id: `naver-${place.mapx}-${place.mapy}`,
      name: place.title,
      neighborhood: address.split(" ").slice(1, 3).join(" ") || address,
      address,
      category: place.category,
      crowdedness: null,
      noise: null,
      workFriendly: null,
      outlets: null,
      americanoPrice: null,
      lastUpdatedMinutes: 0,
      isUserSubmitted: true,
      isVerifiedPlace: true,
    };
    const nextCafes = [cafe, ...cafes];
    setCafes(nextCafes);
    saveCafes(nextCafes);
    setPlaces((current) => current.filter((item) => item !== place));
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 4000);
  };

  const handleSubmitStatus = (form: StatusUpdateForm) => {
    if (!selectedCafe) return;
    const nextCafes = cafes.map((cafe) =>
      cafe.id === selectedCafe.id
        ? {
            ...cafe,
            crowdedness: form.crowdedness,
            noise: form.noise,
            workFriendly: form.workFriendly ? "추천" as const : "비추천" as const,
            outlets: form.outlets,
            lastUpdatedMinutes: 0,
            statusSource: "community" as const,
          }
        : cafe
    );
    setCafes(nextCafes);
    saveCafes(nextCafes);
    setSelectedCafe(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <>
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNaverSearch={handleNaverSearch}
        isSearching={isSearching}
      />

      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {(places.length > 0 || searchError) && (
        <section className="mx-auto mt-5 max-w-5xl px-4 sm:px-6" aria-live="polite">
          {searchError ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {searchError}
            </p>
          ) : null}
          {places.length > 0 ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-semibold text-stone-800">네이버 실제 카페 검색 결과</h2>
                <span className="text-xs text-stone-500">다양한 카페 최대 12개</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {places.map((place) => (
                  <article key={`${place.mapx}-${place.mapy}`} className="rounded-xl bg-white p-4 shadow-sm">
                    <h3 className="font-semibold text-stone-800">{place.title}</h3>
                    <p className="mt-1 text-xs text-stone-500">{place.roadAddress || place.address}</p>
                    <p className="mt-1 text-xs text-stone-400">{place.category}</p>
                    <button
                      type="button"
                      onClick={() => addNaverPlace(place)}
                      className="mt-3 w-full rounded-lg bg-emerald-700 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                    >
                      내 목록에 추가
                    </button>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      )}

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
          message="내 목록에 저장했어요. 이 브라우저에서 계속 확인할 수 있습니다."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}
