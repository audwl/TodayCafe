import { Cafe, Crowdedness, FilterType } from "@/types/cafe";

export function getCrowdednessEmoji(crowdedness: Crowdedness): string {
  const map: Record<Crowdedness, string> = {
    여유: "🟢",
    보통: "🟡",
    혼잡: "🔴",
  };
  return map[crowdedness];
}

export function getWorkFriendlyLabel(workFriendly: Cafe["workFriendly"]): string {
  const map: Record<Cafe["workFriendly"], string> = {
    추천: "👍 추천",
    가능: "가능",
    비추천: "비추천",
  };
  return map[workFriendly];
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

export function formatLastUpdated(minutes: number): string {
  return `${minutes}분 전`;
}

export function getNaverMapUrl(cafe: Pick<Cafe, "name" | "neighborhood">): string {
  const query = encodeURIComponent(`${cafe.neighborhood} ${cafe.name}`);
  return `https://map.naver.com/p/search/${query}`;
}

export function filterCafes(
  cafes: Cafe[],
  filter: FilterType,
  searchQuery: string
): Cafe[] {
  let result = cafes;

  if (searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase();
    result = result.filter(
      (cafe) =>
        cafe.name.toLowerCase().includes(query) ||
        cafe.neighborhood.toLowerCase().includes(query)
    );
  }

  switch (filter) {
    case "여유":
    case "보통":
    case "혼잡":
      return result.filter((cafe) => cafe.crowdedness === filter);
    case "조용한 카페":
      return result.filter((cafe) => cafe.noise === "조용");
    case "카공 추천":
      return result.filter((cafe) => cafe.workFriendly === "추천");
    default:
      return result;
  }
}
