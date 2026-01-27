import type { Filters, Restaurant } from "../utils/types";

export async function getRestaurants(
  page: number,
  appliedFilters: Filters,
): Promise<Restaurant[]> {
  try {
    const { cuisine, fastFood } = appliedFilters;
    const cuisineQuery = "&filterCuisines=" + cuisine.join(",");
    const fastFoodQuery = fastFood ? "" : "&excludeFastFood=true";

    const response = await fetch(
      `/api/restaurants?lat=33.4093&lng=-86.8321&page=${page}${cuisineQuery}${fastFoodQuery}`,
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
}
