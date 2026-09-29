"use client";

import { useEffect, useMemo, useState } from "react";
import { sampleCafes } from "@/data/sampleCafes";
import { loadCafes, saveCafes } from "@/lib/cafeStorage";
import { filterCafes } from "@/lib/cafeUtils";
import {
  Cafe,
  Crowdedness,
  CrowdReportSummary,
  FilterType,
  NaverPlace,
} from "@/types/cafe";
import CafeCard from "./CafeCard";
import FilterBar from "./FilterBar";
import HeroSection from "./HeroSection";
import SuccessToast from "./SuccessToast";

const REPORTER_ID_KEY = "todaycafe:reporter-id:v1";
const MY_REPORTS_KEY = "todaycafe:my-crowd-reports:v1";

function getReporterId(): string {
  const saved = window.localStorage.getItem(REPORTER_ID_KEY);
  if (saved) return saved;

  const created = window.crypto.randomUUID();
  window.localStorage.setItem(REPORTER_ID_KEY, created);
  return created;
}

export default function CafeList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("전체");
  const [cafes, setCafes] = useState<Cafe[]>(sampleCafes);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [places, setPlaces] = useState<NaverPlace[]>([]);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [reportSummaries, setReportSummaries] = useState<Record<string, CrowdReportSummary>>({});
  const [myReports, setMyReports] = useState<Record<string, Crowdedness>>({});
  const [reportingChoice, setReportingChoice] = useState<{
    cafeId: string;
    status: Crowdedness;
  } | null>(null);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      setCafes(loadCafes());
      try {
        const savedReports = JSON.parse(
          window.localStorage.getItem(MY_REPORTS_KEY) || "{}"
        ) as Record<string, Crowdedness>;
        setMyReports(savedReports);
      } catch {
        setMyReports({});
      }
      if (new URLSearchParams(window.location.search).has("added")) {
        setSuccessMessage("카페를 내 목록에 저장했어요.");
        setShowSuccess(true);
        window.history.replaceState(null, "", "/#cafe-list");
        window.setTimeout(() => setShowSuccess(false), 4000);
      }
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    const cafeIds = cafes.map((cafe) => cafe.id).slice(0, 50);
    if (!cafeIds.length) return;

    const controller = new AbortController();
    fetch(`/api/reports?cafeIds=${encodeURIComponent(cafeIds.join(","))}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return;
        const data = (await response.json()) as {
          summaries?: Record<string, CrowdReportSummary>;
        };
        if (data.summaries) setReportSummaries(data.summaries);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [cafes]);

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
    setSuccessMessage("카페를 내 목록에 저장했어요.");
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 4000);
  };

  const handleQuickReport = async (targetCafe: Cafe, crowdedness: Crowdedness) => {
    setReportingChoice({ cafeId: targetCafe.id, status: crowdedness });
    setSearchError("");

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cafeId: targetCafe.id,
          status: crowdedness,
          reporterId: getReporterId(),
        }),
      });
      const data = (await response.json()) as {
        summary?: CrowdReportSummary;
        error?: string;
      };
      if (!response.ok || !data.summary) {
        throw new Error(data.error || "제보를 저장하지 못했습니다.");
      }

      setReportSummaries((current) => ({
        ...current,
        [targetCafe.id]: data.summary!,
      }));
      setMyReports((current) => {
        const next = { ...current, [targetCafe.id]: crowdedness };
        window.localStorage.setItem(MY_REPORTS_KEY, JSON.stringify(next));
        return next;
      });
      setSuccessMessage(
        data.summary.total < 3
          ? `${targetCafe.name} 제보가 접수됐어요. ${3 - data.summary.total}건 더 모이면 상태가 표시돼요.`
          : `${targetCafe.name} 최근 혼잡도 집계에 반영했어요.`
      );
      setShowSuccess(true);
      window.setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "제보 중 오류가 발생했습니다.");
    } finally {
      setReportingChoice(null);
    }
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
                reportSummary={reportSummaries[cafe.id]}
                selectedReport={myReports[cafe.id]}
                reportingStatus={
                  reportingChoice?.cafeId === cafe.id ? reportingChoice.status : null
                }
                onReportCrowdedness={handleQuickReport}
              />
            ))}
          </div>
        )}
      </section>

      {showSuccess && (
        <SuccessToast
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}
