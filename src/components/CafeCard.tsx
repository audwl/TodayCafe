import { Cafe, Crowdedness, CrowdReportSummary } from "@/types/cafe";
import {
  formatLastUpdated,
  formatPrice,
  getCrowdednessEmoji,
  getNaverBlogSearchUrl,
  getNaverMapUrl,
  getWorkFriendlyLabel,
} from "@/lib/cafeUtils";

interface CafeCardProps {
  cafe: Cafe;
  reportSummary?: CrowdReportSummary;
  selectedReport?: Crowdedness;
  reportingStatus: Crowdedness | null;
  onReportCrowdedness: (cafe: Cafe, crowdedness: Crowdedness) => void;
}

const quickReportOptions: Array<{ value: Crowdedness; label: string; emoji: string }> = [
  { value: "여유", label: "여유", emoji: "🟢" },
  { value: "보통", label: "보통", emoji: "🟡" },
  { value: "혼잡", label: "혼잡", emoji: "🔴" },
];

export default function CafeCard({
  cafe,
  reportSummary,
  selectedReport,
  reportingStatus,
  onReportCrowdedness,
}: CafeCardProps) {
  const hasStatus = Boolean(
    cafe.crowdedness || cafe.noise || cafe.workFriendly || cafe.outlets
  );
  const displayedCrowdedness = reportSummary?.total
    ? reportSummary.status
    : cafe.crowdedness;
  const reportStatusLabel = reportSummary?.status
    ? `최근 60분 혼잡도 ${reportSummary.total}명 · 신뢰도 ${reportSummary.confidence}`
    : reportSummary?.total
      ? `최근 혼잡도 제보 ${reportSummary.total}건 · 3건부터 집계`
      : cafe.statusSource === "example"
        ? "예시 상태 · 실제와 다를 수 있어요"
        : hasStatus
          ? formatLastUpdated(cafe.lastUpdatedMinutes)
          : "최근 제보 없음";

  return (
    <article className="flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-stone-800">{cafe.name}</h2>
            <a
              href={getNaverMapUrl(cafe)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100"
              aria-label={`${cafe.name} 네이버 지도에서 보기`}
            >
              지도 ↗
            </a>
            <a
              href={getNaverBlogSearchUrl(cafe)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-sky-50 px-2 py-1 text-xs font-medium text-sky-800 transition-colors hover:bg-sky-100"
              aria-label={`${cafe.name} 네이버 블로그 후기 검색`}
            >
              후기 ↗
            </a>
          </div>
          <p className="mt-0.5 text-sm text-stone-500">
            {cafe.address || cafe.neighborhood}
          </p>
          {cafe.category ? (
            <p className="mt-2 inline-flex rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
              {cafe.category}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            cafe.isUserSubmitted
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-800"
          }`}>
            {cafe.isUserSubmitted ? "내 목록" : cafe.isVerifiedPlace ? "실제 장소" : "등록 카페"}
          </span>
          <span className="text-xs text-stone-400">
            {reportStatusLabel}
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-stone-400">혼잡도</dt>
          <dd className="mt-0.5 font-medium text-stone-700">
            {getCrowdednessEmoji(displayedCrowdedness)} {displayedCrowdedness || "정보 없음"}
          </dd>
        </div>
        <div>
          <dt className="text-stone-400">소음</dt>
          <dd className="mt-0.5 font-medium text-stone-700">{cafe.noise || "정보 없음"}</dd>
        </div>
        <div>
          <dt className="text-stone-400">카공</dt>
          <dd className="mt-0.5 font-medium text-stone-700">
            {getWorkFriendlyLabel(cafe.workFriendly)}
          </dd>
        </div>
        <div>
          <dt className="text-stone-400">콘센트</dt>
          <dd className="mt-0.5 font-medium text-stone-700">{cafe.outlets || "정보 없음"}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-stone-400">아메리카노</dt>
          <dd className="mt-0.5 font-semibold text-amber-900">
            {formatPrice(cafe.americanoPrice)}
          </dd>
        </div>
      </dl>

      {cafe.statusSource === "example" ? (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          소음·카공·콘센트는 화면 체험용 예시예요.
        </p>
      ) : null}

      <fieldset className="mt-5 border-t border-stone-100 pt-4">
        <legend className="px-1 text-center text-xs font-medium text-stone-500">
          {selectedReport
            ? `내 선택: ${selectedReport} · 다시 누르면 선택이 바뀌어요`
            : "지금 자리 있나요? 한 번만 눌러주세요"}
        </legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {quickReportOptions.map((option) => {
            const visibleSelection = reportingStatus || selectedReport;
            const isSelected = visibleSelection === option.value;
            const isSubmitting = reportingStatus === option.value;
            const isOtherSubmitting = Boolean(reportingStatus && !isSubmitting);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onReportCrowdedness(cafe, option.value)}
                disabled={Boolean(reportingStatus)}
                className={`rounded-xl border px-2 py-2.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-wait ${
                  isSubmitting || isSelected
                    ? "border-amber-500 bg-amber-100 text-amber-950 ring-2 ring-amber-200"
                    : "border-stone-200 bg-stone-50 text-stone-700 hover:border-amber-300 hover:bg-amber-50"
                } ${isOtherSubmitting ? "opacity-40" : "opacity-100"}`}
                aria-label={`${cafe.name} 현재 혼잡도 ${option.value}로 제보`}
                aria-pressed={isSelected}
              >
                <span aria-hidden="true">{isSubmitting ? "⏳" : option.emoji}</span>{" "}
                {option.label}
                {isSelected && !isSubmitting ? " ✓" : ""}
                {reportSummary?.total ? (
                  <span className="ml-1 text-stone-400">{reportSummary.counts[option.value]}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </fieldset>
    </article>
  );
}
