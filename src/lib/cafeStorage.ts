import { sampleCafes } from "@/data/sampleCafes";
import { Cafe } from "@/types/cafe";

const STORAGE_KEY = "todaycafe:cafes:v1";
const LEGACY_SAMPLE_IDS = new Set(Array.from({ length: 18 }, (_, index) => String(index + 1)));

export function loadCafes(): Cafe[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return sampleCafes;

    const parsed = JSON.parse(saved) as unknown;
    if (!Array.isArray(parsed)) return sampleCafes;

    const savedCafes = (parsed as Cafe[])
      .filter((cafe) => !LEGACY_SAMPLE_IDS.has(cafe.id))
      .map((cafe) =>
        cafe.id.startsWith("naver-")
          ? { ...cafe, naverMapUrl: undefined, isVerifiedPlace: true }
          : cafe
      );
    const savedById = new Map(savedCafes.map((cafe) => [cafe.id, cafe]));
    const sampleIds = new Set(sampleCafes.map((cafe) => cafe.id));
    const samplePlaceKeys = new Set(
      sampleCafes.map((cafe) => `${cafe.name}:${cafe.address || cafe.neighborhood}`)
    );
    const submittedCafes = savedCafes.filter(
      (cafe) =>
        !sampleIds.has(cafe.id) &&
        !samplePlaceKeys.has(`${cafe.name}:${cafe.address || cafe.neighborhood}`)
    );
    const mergedSamples = sampleCafes.map((sample) => {
      const savedCafe = savedById.get(sample.id);
      const hasLegacyStatus = Boolean(
        savedCafe?.crowdedness ||
        savedCafe?.noise ||
        savedCafe?.workFriendly ||
        savedCafe?.outlets
      );
      const hasCommunityStatus = Boolean(
        savedCafe?.statusSource === "community" ||
        (savedCafe?.statusSource !== "example" && hasLegacyStatus)
      );

      if (!savedCafe || !hasCommunityStatus) return sample;

      return {
        ...sample,
        ...savedCafe,
        category: savedCafe.category || sample.category,
        statusSource: "community" as const,
      };
    });

    return [...submittedCafes, ...mergedSamples];
  } catch {
    return sampleCafes;
  }
}

export function saveCafes(cafes: Cafe[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cafes));
}
