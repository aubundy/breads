import { API_CUISINES } from "./constants";
import type { APICuisine } from "./types";

export function formatCuisines(cuisines: APICuisine[]) {
  if (!cuisines) return "";

  return cuisines.map((c: APICuisine) => API_CUISINES[c]).join(", ");
}

export function formatDistance(distance: number | null) {
  return distance ? distance.toFixed(2) : "-";
}
