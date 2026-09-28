import { Cafe } from "@/types/cafe";
import {
  formatLastUpdated,
  formatPrice,
  getCrowdednessEmoji,
  getNaverMapUrl,
  getWorkFriendlyLabel,
} from "@/lib/cafeUtils";

interface CafeCardProps {
  cafe: Cafe;
  onReportStatus: (cafe: Cafe) => void;
}

export default function CafeCard({ cafe, onReportStatus }: CafeCardProps) {
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
          </div>
          <p className="mt-0.5 text-sm text-stone-500">
            {cafe.address || cafe.neighborhood}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            cafe.isUserSubmitted
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-800"
          }`}>
            {cafe.isUserSubmitted ? "내 제보" : "샘플 정보"}
          </span>
          <span className="text-xs text-stone-400">
            {cafe.isUserSubmitted ? formatLastUpdated(cafe.lastUpdatedMinutes) : `예시 · ${formatLastUpdated(cafe.lastUpdatedMinutes)}`}
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-stone-400">혼잡도</dt>
          <dd className="mt-0.5 font-medium text-stone-700">
            {getCrowdednessEmoji(cafe.crowdedness)} {cafe.crowdedness || "정보 없음"}
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

      <button
        type="button"
        onClick={() => onReportStatus(cafe)}
        className="mt-5 w-full rounded-xl bg-stone-50 py-2.5 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-50"
      >
        지금 상태 알려주기
      </button>
    </article>
  );
}
