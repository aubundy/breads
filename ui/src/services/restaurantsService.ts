import { UI_CUISINES } from "../utils/constants";
import type { Filters, Restaurant } from "../utils/types";

export async function getRestaurants(
  page: number,
  range: number,
  appliedFilters: Filters,
): Promise<Restaurant[]> {
  try {
    const { cuisine, fastFood } = appliedFilters;
    const cuisineQuery = `&filterCuisines=${cuisine.map((c) => UI_CUISINES[c]).join(",")}`;
    const fastFoodQuery = `&excludeFastFood=${!fastFood}`;

    const response = await fetch(
      `/api/restaurants?lat=33.4093&lng=-86.8321&page=${page}&range=${range}${cuisineQuery}${fastFoodQuery}`,
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
}
