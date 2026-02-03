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

  const restaurants = await model.getRestaurants({
    page,
    range,
    lat,
    lng,
    filters: mappedFilters,
    excludeFastFood,
  });
  return restaurants;
}

export default { getRestaurants };
