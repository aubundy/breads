import service from "./restaurants-service.js";

export async function handleGetRestaurants(req, res, next) {
  try {
    // const amenitites = {
    //   restaurant: 379,
    //   ice_cream: 14,
    //   cafe: 43,
    //   bar: 14,
    //   pub: 7,
    //   public_building: 3,
    //   food_court: 3,
    //   fast_food: 447,
    // };

    // 33.5207, // Birmingham lat
    // -86.8025, // Birmingham lng

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
