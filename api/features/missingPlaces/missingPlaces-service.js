import { MissingPlace } from "./missingPlaces-model.js";

async function getMissingPlaces({ lat, lng }) {
  return await MissingPlace.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng, lat],
        },
        distanceField: "distance",
        spherical: true,
        key: "location",
        maxDistance: 16093.4, // optional: 10 miles
      },
    },
    { $limit: 5 },
    {
      $project: {
        googleId: 1,
        googleName: 1,
        location: 1,
        category: 1,
        address: 1,
        distanceMiles: {
          $round: [{ $divide: ["$distance", 1609.34] }, 2],
        },
      },
    },
  ]);
}

export default { getMissingPlaces };
