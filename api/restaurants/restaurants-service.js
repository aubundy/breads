import model from "./restaraunts-model.js";

async function getRestaurants({ page, lat, lng, filters }) {
  const restaurants = await model.getRestaurants({
    page,
    lat,
    lng,
    filters,
  });
  return restaurants;
}

export default { getRestaurants };
