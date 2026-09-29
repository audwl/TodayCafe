import { sampleCafes } from "@/data/sampleCafes";
import { Cafe } from "@/types/cafe";

const STORAGE_KEY = "todaycafe:cafes:v1";

export function loadCafes(): Cafe[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return sampleCafes;

    const parsed = JSON.parse(saved) as unknown;
    if (!Array.isArray(parsed)) return sampleCafes;

    const savedCafes = parsed as Cafe[];
    const savedById = new Map(savedCafes.map((cafe) => [cafe.id, cafe]));
    const sampleIds = new Set(sampleCafes.map((cafe) => cafe.id));
    const submittedCafes = savedCafes.filter((cafe) => !sampleIds.has(cafe.id));
    const mergedSamples = sampleCafes.map((sample) => ({
      ...sample,
      ...savedById.get(sample.id),
      category: savedById.get(sample.id)?.category || sample.category,
    }));

    return [...submittedCafes, ...mergedSamples];
  } catch {
    return sampleCafes;
  }
}

export function saveCafes(cafes: Cafe[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cafes));
}
