import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    osmId: { type: String, required: true },
    osmType: { type: String, required: true },
    tileId: { type: String },

    name: { type: String },
    normalizedName: { type: String },

    cuisines: [{ type: String }],

    amenity: { type: String },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
  },
  { timestamps: true },
);

placeSchema.index({ location: "2dsphere" });
placeSchema.index({ cuisines: 1 });
placeSchema.index({ amenity: 1 });

const Place = mongoose.model("Place", placeSchema);

async function getRestaurants({
  page = 1,
  range = 5, // miles
  lat,
  lng,
  filters = [],
  excludeFastFood = false,
}) {
  const limit = 25;
  const skip = page * limit;
  const maxDistanceMeters = range * 1609.34;

  let matchStage = {};

  if (filters.length) {
    matchStage["cuisines"] = { $nin: filters };
  }

  if (excludeFastFood) {
    matchStage["amenity"] = { $ne: "fast_food" };
  }

  const result = await Place.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng, lat],
        },
        distanceField: "distance",
        maxDistance: maxDistanceMeters,
        spherical: true,
        query: matchStage,
      },
    },

    {
      $facet: {
        results: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              cuisines: 1,
              amenity: 1,
              distanceMiles: {
                $round: [{ $divide: ["$distance", 1609.34] }, 2],
              },
              location: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
        cuisineCount: [
          { $unwind: "$cuisines" },
          {
            $group: {
              _id: "$cuisines",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ],
        amenityCount: [
          {
            $group: {
              _id: "$amenity",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ],
      },
    },
  ]);

  const data = result[0];

  return {
    results: data.results,
    totalCount: data.totalCount[0]?.count || 0,
    cuisineCount: data.cuisineCount,
    amenityCount: data.amenityCount,
  };
}

export default { getRestaurants };
