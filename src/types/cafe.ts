export type Crowdedness = "여유" | "보통" | "혼잡";
export type NoiseLevel = "조용" | "보통" | "시끄러움";
export type WorkFriendly = "추천" | "가능" | "비추천";
export type OutletLevel = "많음" | "보통" | "적음";
export type VibeTag = "조용한" | "카공" | "대형" | "베이커리" | "로스터리" | "디저트";

export interface CrowdReportSummary {
  cafeId: string;
  status: Crowdedness | null;
  confidence: "대기" | "보통" | "높음";
  total: number;
  counts: Record<Crowdedness, number>;
  updatedAt: number | null;
}

export type FilterType =
  | "전체"
  | "조용한"
  | "카공"
  | "대형"
  | "베이커리"
  | "로스터리";

export interface Cafe {
  id: string;
  name: string;
  neighborhood: string;
  address?: string;
  category?: string;
  naverMapUrl?: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  vibeTags?: VibeTag[];
  vibeSource?: "example" | "reviews" | "community";
  crowdedness: Crowdedness | null;
  noise: NoiseLevel | null;
  workFriendly: WorkFriendly | null;
  outlets: OutletLevel | null;
  americanoPrice: number | null;
  lastUpdatedMinutes: number;
  isUserSubmitted?: boolean;
  isVerifiedPlace?: boolean;
  statusSource?: "example" | "community";
}

export interface NaverPlace {
  title: string;
  category: string;
  address: string;
  roadAddress: string;
  link: string;
  mapx: string;
  mapy: string;
}
