import express from "express";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";
// import { crawlTiles } from "./openstreetmap/service.js";

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

    res.json(restaurants);
  });

  readStream.on("error", (err) => {
    res.status(500).json({ error: err.message });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
