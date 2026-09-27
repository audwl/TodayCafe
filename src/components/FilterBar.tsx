import { FilterType } from "@/types/cafe";

const filters: FilterType[] = [
  "전체",
  "여유",
  "보통",
  "혼잡",
  "조용한 카페",
  "카공 추천",
];

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function FilterBar({
  activeFilter,
  onFilterChange,
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
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-amber-800 text-white shadow-sm"
                  : "border border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-amber-900"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
