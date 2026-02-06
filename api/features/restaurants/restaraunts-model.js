import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { findNearby } from "../../utils/distance.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getRestaurants({ page, range, lat, lng, filters, excludeFastFood }) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(
      __dirname,
      "../../data/all-osm-restaurants.jsonl",
    );

    let points = [];

    const readStream = fs.createReadStream(outputPath, { encoding: "utf-8" });

    let leftover = "";

    readStream.on("data", (chunk) => {
      const lines = (leftover + chunk).split("\n");
      leftover = lines.pop();

      for (const line of lines) {
        if (line.trim()) {
          points.push(JSON.parse(line));
        }
      }
    });

    readStream.on("end", () => {
      if (leftover.trim()) {
        points.push(JSON.parse(leftover));
      }

      const matchesCuisineType = ({ cuisine }) => !filters.includes(cuisine);
      const isNotFastFood = ({ amenity }) =>
        excludeFastFood ? amenity !== "fast_food" : true;

      const restaraunts = findNearby(
        points.filter(matchesCuisineType).filter(isNotFastFood),
        lat,
        lng,
        range, // radius miles
        page,
      );

      const amenityCounts = restaraunts.reduce((counts, place) => {
        const amenity = place.amenity || "unknown";
        counts[amenity] = (counts[amenity] || 0) + 1;
        return counts;
      }, {});

      // console.log("Amenity counts:", amenityCounts);

      const cuisineCounts = restaraunts.reduce((counts, place) => {
        const cuisine = place.cuisine || "unknown";

        if (cuisine.includes(";")) {
          const cuisines = cuisine.split(";");
          cuisines.forEach((c) => {
            counts[c.trim()] = (counts[c.trim()] || 0) + 1;
          });
          return counts;
        }

        counts[cuisine] = (counts[cuisine] || 0) + 1;
        return counts;
      }, {});

      // console.log("Cuisine counts:", cuisineCounts);
      resolve(restaraunts);
    });

    readStream.on("error", (err) => {
      reject(err);
    });
  });
}

export default { getRestaurants };
