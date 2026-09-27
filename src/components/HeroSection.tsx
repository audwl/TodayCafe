interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function HeroSection({
  searchQuery,
  onSearchChange,
}: HeroSectionProps) {
  return (
    <section className="px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-stone-800 sm:text-4xl">
          지금 어디 카페 갈까?
        </h1>
        <p className="mt-3 text-base text-stone-500 sm:text-lg">
          동네 사람들이 알려주는 카페의 현재 분위기
        </p>

        <div className="relative mx-auto mt-8 max-w-xl">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            🔍
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="카페 이름이나 동네를 검색해보세요"
            className="w-full rounded-2xl border border-stone-200 bg-white py-3.5 pl-11 pr-4 text-sm text-stone-800 shadow-sm outline-none transition-shadow placeholder:text-stone-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
          />
        </div>
      </div>
    </section>
  );
}
