import model from "./restaraunts-model.js";

async function getRestaurants({ page, lat, lng, filters, excludeFastFood }) {
  const restaurants = await model.getRestaurants({
    page,
    lat,
    lng,
    filters,
    excludeFastFood,
  });
  return restaurants;
}

export default { getRestaurants };
