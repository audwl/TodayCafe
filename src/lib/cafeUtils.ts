import { Cafe, Crowdedness, FilterType, WorkFriendly } from "@/types/cafe";

export function getCrowdednessEmoji(crowdedness: Crowdedness | null): string {
  if (!crowdedness) return "⚪";
  const map: Record<Crowdedness, string> = {
    여유: "🟢",
    보통: "🟡",
    혼잡: "🔴",
  };
  return map[crowdedness];
}

export function getWorkFriendlyLabel(workFriendly: Cafe["workFriendly"]): string {
  if (!workFriendly) return "정보 없음";
  const map: Record<WorkFriendly, string> = {
    추천: "👍 추천",
    가능: "가능",
    비추천: "비추천",
  };
  return map[workFriendly];
}

export function formatPrice(price: number | null): string {
  if (price === null) return "정보 없음";
  return `${price.toLocaleString("ko-KR")}원`;
}

export function formatLastUpdated(minutes: number): string {
  return `${minutes}분 전`;
}

export function getNaverMapUrl(
  cafe: Pick<Cafe, "name" | "neighborhood" | "naverMapUrl">
): string {
  if (cafe.naverMapUrl) {
    return cafe.naverMapUrl;
  }
  const query = encodeURIComponent(`${cafe.neighborhood} ${cafe.name}`);
  return `https://map.naver.com/p/search/${query}`;
}

export function getNaverBlogSearchUrl(cafe: Pick<Cafe, "name" | "neighborhood">): string {
  const query = encodeURIComponent(`${cafe.neighborhood} ${cafe.name}`);
  return `https://search.naver.com/search.naver?where=blog&query=${query}`;
}

export function calculateDistanceKm(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
): number {
  const earthRadiusKm = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const startLatitude = toRadians(from.latitude);
  const endLatitude = toRadians(to.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
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
        cafe.neighborhood.toLowerCase().includes(query) ||
        cafe.address?.toLowerCase().includes(query) ||
        cafe.category?.toLowerCase().includes(query) ||
        cafe.vibeTags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  switch (filter) {
    case "조용한":
      return result.filter((cafe) => cafe.vibeTags?.includes("조용한"));
    case "카공":
      return result.filter((cafe) => cafe.vibeTags?.includes("카공"));
    case "대형":
      return result.filter((cafe) => cafe.vibeTags?.includes("대형"));
    case "베이커리":
      return result.filter(
        (cafe) => cafe.vibeTags?.includes("베이커리") || cafe.category?.includes("베이커리")
      );
    case "로스터리":
      return result.filter(
        (cafe) => cafe.vibeTags?.includes("로스터리") || cafe.category?.includes("로스터리")
      );
    default:
      return result;
  }
}
