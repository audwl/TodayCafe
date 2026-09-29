interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onNaverSearch: () => void;
  isSearching: boolean;
}

export default function HeroSection({
  searchQuery,
  onSearchChange,
  onNaverSearch,
  isSearching,
}: HeroSectionProps) {
  return (
    <section className="px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mx-auto mb-6 flex max-w-xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-950">
          <span aria-hidden="true">🚧</span>
          <p>
            <strong className="font-semibold">공개 베타</strong>
            <span className="text-amber-800"> · 카페와 주소는 실제 장소이며, 예시 상태는 사용자 제보가 들어오면 실제 제보로 교체됩니다.</span>
          </p>
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-stone-800 sm:text-4xl">
          지금 어디 카페 갈까?
        </h1>
        <p className="mt-3 text-base text-stone-500 sm:text-lg">
          동네 사람들이 알려주는 카페의 현재 분위기
        </p>

        <div className="mx-auto mt-8 flex max-w-xl flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
              🔍
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onNaverSearch();
              }}
              placeholder="카페 이름이나 동네를 검색해보세요"
              className="w-full rounded-2xl border border-stone-200 bg-white py-3.5 pl-11 pr-4 text-sm text-stone-800 shadow-sm outline-none transition-shadow placeholder:text-stone-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
            />
          </div>
          <button
            type="button"
            onClick={onNaverSearch}
            disabled={isSearching || searchQuery.trim().length < 2}
            className="rounded-2xl bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {isSearching ? "찾는 중..." : "실제 카페 찾기"}
          </button>
        </div>
      </div>
    </section>
  );
}
