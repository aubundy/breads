import service from "./restaurants-service.js";

export async function handleGetRestaurants(req, res, next) {
  try {
    console.log(req.query.filterAmenities);
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
    const lat = parseFloat(req.query.lat) || 33.4093;
    const lng = parseFloat(req.query.lng) || -86.8321;

    const amenities = req.query.filterAmenities || "";
    const filters = amenities.split(",");

    const restaurants = await service.getRestaurants({
      page,
      lat,
      lng,
      filters,
    });

    console.log(`Controller: Retrieved ${restaurants.length} restaurants`);
    res.status(200).json(restaurants);
  } catch (error) {
    next(error);
  }
}
