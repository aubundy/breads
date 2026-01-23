import model from "./restaraunts-model.js";

async function getRestaurants({ page, size, lat, lng, filters }) {
  const restaurants = await model.getRestaurants({
    page,
    size,
    lat,
    lng,
    filters,
  });
  return restaurants;
}

export default { getRestaurants };
