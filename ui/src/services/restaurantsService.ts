import type { Restaurant } from "../utils/types";

export async function getRestaurants(
  page: number,
  appliedFilters: string[],
): Promise<Restaurant[]> {
  try {
    const filterQuery = "&filterAmenities=" + appliedFilters.join(",");

    const response = await fetch(
      `/api/restaurants?lat=33.4093&lng=-86.8321&page=${page}${filterQuery}`,
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
}
