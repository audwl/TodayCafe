export type Crowdedness = "여유" | "보통" | "혼잡";
export type NoiseLevel = "조용" | "보통" | "시끄러움";
export type WorkFriendly = "추천" | "가능" | "비추천";
export type OutletLevel = "많음" | "보통" | "적음";

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
  | "여유"
  | "보통"
  | "혼잡"
  | "조용한 카페"
  | "카공 추천";

export interface Cafe {
  id: string;
  name: string;
  neighborhood: string;
  address?: string;
  category?: string;
  naverMapUrl?: string;
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
