export type Crowdedness = "여유" | "보통" | "혼잡";
export type NoiseLevel = "조용" | "보통" | "시끄러움";
export type WorkFriendly = "추천" | "가능" | "비추천";
export type OutletLevel = "많음" | "보통" | "적음";

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

export interface StatusUpdateForm {
  crowdedness: Crowdedness;
  noise: NoiseLevel;
  workFriendly: boolean;
  outlets: OutletLevel;
}
