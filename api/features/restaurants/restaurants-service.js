import model from "./restaraunts-model.js";

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

export default { getRestaurants };
