import { FilterType } from "@/types/cafe";

const filters: FilterType[] = [
  "전체",
  "조용한",
  "카공",
  "대형",
  "베이커리",
  "로스터리",
];

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  isDistanceSort: boolean;
  isLocating: boolean;
  onToggleDistanceSort: () => void;
}

export default function FilterBar({
  activeFilter,
  onFilterChange,
  isDistanceSort,
  isLocating,
  onToggleDistanceSort,
}: FilterBarProps) {
  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isActive
                  ? "bg-amber-800 text-white shadow-sm"
                  : "border border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-amber-900"
              }`}
            >
              {filter}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onToggleDistanceSort}
          disabled={isLocating}
          className={`ml-auto shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-wait disabled:opacity-60 ${
            isDistanceSort
              ? "bg-emerald-700 text-white shadow-sm"
              : "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
          }`}
        >
          {isLocating ? "위치 확인 중…" : isDistanceSort ? "📍 직선 거리순" : "📍 가까운 순"}
        </button>
      </div>
      <p className="mx-auto mt-1 max-w-5xl text-xs text-stone-400">
        분위기 태그는 초기 참고 정보이며, 거리순은 현재 위치 기준 직선거리예요.
      </p>
    </div>
  );
}
