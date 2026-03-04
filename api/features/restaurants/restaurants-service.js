import { getEnvVariable } from "../../../config/env.js";
import model from "./restaurants-model.js";

async function getRestaurants({
  page,
  range,
  lat,
  lng,
  filters,
  excludeFastFood,
}) {
  const mappedFilters = filters.map((f) => (f === "unknown" ? null : f));

  const data = await model.getRestaurants({
    page,
    range,
    lat,
    lng,
    filters: mappedFilters,
    excludeFastFood,
  });

  console.log({
    results: data.results.length,
    total: data.totalCount,
    cuisineCount: data.cuisineCount.length,
    amentityCount: data.amenityCount.length,
  });

  return data.results;
}

async function getRestaurantDetails(placeId) {
  const url = new URL("https://places.googleapis.com/v1/places/" + placeId);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": getEnvVariable("GOOGLE_API_KEY"),
      "X-Goog-FieldMask":
        "displayName,location,formattedAddress,rating,nationalPhoneNumber",
    },
  });

  const data = await response.json();
  return data;
}

export default { getRestaurants, getRestaurantDetails };
