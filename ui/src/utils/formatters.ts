export function formatCuisines(cuisines: string) {
  return cuisines ? cuisines.replace(/;/g, ", ") : "-";
}

export function formatDistance(distance: number | null) {
  return distance ? distance.toFixed(2) : "-";
}
