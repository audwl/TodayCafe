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
  crowdedness: Crowdedness;
  noise: NoiseLevel;
  workFriendly: WorkFriendly;
  outlets: OutletLevel;
  americanoPrice: number;
  lastUpdatedMinutes: number;
}

export interface StatusUpdateForm {
  crowdedness: Crowdedness;
  noise: NoiseLevel;
  workFriendly: boolean;
  outlets: OutletLevel;
}
