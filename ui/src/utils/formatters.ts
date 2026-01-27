import { API_CUISINES } from "./constants";
import type { APICuisine } from "./types";

export function formatCuisines(cuisines: string) {
  if (!cuisines) return "";

  const cuisineList: APICuisine[] = cuisines.split(";") as APICuisine[];
  return cuisineList.map((c: APICuisine) => API_CUISINES[c]).join(", ");
}

export function formatDistance(distance: number | null) {
  return distance ? distance.toFixed(2) : "-";
}
