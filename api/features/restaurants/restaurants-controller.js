import service from "./restaurants-service.js";

export async function handleGetRestaurants(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 0;
    const range = parseInt(req.query.range) || 10;
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    const cuisines = req.query.filterCuisines || "";
    const excludeFastFood = req.query.excludeFastFood === "true";
    const filters = cuisines.split(",");

    console.log("Query: ", {
      page,
      range,
      lat,
      lng,
      filters: filters.length,
      excludeFastFood,
    });

    const restaurants = await service.getRestaurants({
      page,
      range,
      lat,
      lng,
      filters,
      excludeFastFood,
    });

    console.log("Restaurants: ", restaurants.length);

    res.status(200).json(restaurants);
  } catch (error) {
    next(error);
  }
}

export async function handleGetDetails(req, res, next) {
  try {
    const { placeId } = req.params;
    const details = await service.getRestaurantDetails(placeId);
    res.status(200).json(details);
  } catch (error) {
    next(error);
  }
}
