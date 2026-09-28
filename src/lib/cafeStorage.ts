import { sampleCafes } from "@/data/sampleCafes";
import { Cafe } from "@/types/cafe";

const STORAGE_KEY = "todaycafe:cafes:v1";

export function loadCafes(): Cafe[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Cafe[]) : sampleCafes;
  } catch {
    return sampleCafes;
  }
}

export function saveCafes(cafes: Cafe[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cafes));
}
