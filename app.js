import express from "express";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";
// import { crawlTiles } from "./openstreetmap/service.js";
import { findNearby } from "./utils/distance.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// app.get("/", async (req, res) => {
//   await crawlTiles();
//   res.send("Crawling started");
// });

app.get("/restaurants", (req, res) => {
  const outputPath = path.join(
    __dirname,
    "osm_data/2-birmingham-osm-restaurants.jsonl",
  );

  let restaurants = [];

  const readStream = fs.createReadStream(outputPath, { encoding: "utf-8" });

  let leftover = "";

  readStream.on("data", (chunk) => {
    const lines = (leftover + chunk).split("\n");
    leftover = lines.pop();

    for (const line of lines) {
      if (line.trim()) {
        restaurants.push(JSON.parse(line));
      }
    }
  });

  readStream.on("end", () => {
    if (leftover.trim()) {
      restaurants.push(JSON.parse(leftover));
    }

    const test = findNearby(
      restaurants,
      // 33.5207, // Birmingham lat
      33.4093, // Hoover lat
      // -86.8025, // Birmingham lng
      -86.8321, // Hoover lng
      2, // radius miles
      50, // limit
    );

    console.log(`Found ${test.length} nearby restaurants`);

    const amenityCounts = test.reduce((counts, place) => {
      const amenity = place.amenity || "unknown";
      counts[amenity] = (counts[amenity] || 0) + 1;
      return counts;
    }, {});

    console.log("Amenity counts:", amenityCounts);

    res.json(test);
  });

  readStream.on("error", (err) => {
    res.status(500).json({ error: err.message });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
