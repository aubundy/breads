import express from "express";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

  function buildQuery({ south, west, north, east }) {
    return `
    [out:json][timeout:25];
    (
      node["amenity"~"restaurant|fast_food|bar|pub|cafe|biergarten|food_court|ice_cream"]
        (${south},${west},${north},${east});
      way["amenity"~"restaurant|fast_food|bar|pub|cafe|biergarten|food_court|ice_cream"]
        (${south},${west},${north},${east});
      relation["amenity"~"restaurant|fast_food|bar|pub|cafe|biergarten|food_court|ice_cream"]
        (${south},${west},${north},${east});
    );
    out tags center;
  `;
  }

  async function fetchTile(tile) {
    const query = buildQuery(tile);

    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Breads/0.1 (atmb405@gmail.com)",
      },
      body: "data=" + encodeURIComponent(query),
    });

    if (!res.ok) {
      throw new Error(`Overpass error: ${res.status}`);
    }

    return res.json();
  }

  const bbox = {
    south: 33.37548,
    west: -86.84023,
    north: 33.3997,
    east: -86.75715,
  };

  const TILE_SIZE = 0.01;

  function generateTiles(bbox) {
    const tiles = [];

    const latStart = Math.floor(bbox.south / TILE_SIZE);
    const latEnd = Math.floor(bbox.north / TILE_SIZE);
    const lonStart = Math.floor(bbox.west / TILE_SIZE);
    const lonEnd = Math.floor(bbox.east / TILE_SIZE);

    for (let lat = latStart; lat <= latEnd; lat++) {
      for (let lon = lonStart; lon <= lonEnd; lon++) {
        tiles.push({
          tileId: `${lat}:${lon}`,
          south: lat * TILE_SIZE,
          west: lon * TILE_SIZE,
          north: (lat + 1) * TILE_SIZE,
          east: (lon + 1) * TILE_SIZE,
        });
      }
    }

    return tiles;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function crawlTiles(tiles, { onPlaces }) {
    for (const tile of tiles) {
      try {
        console.log(`Crawling tile ${tile.tileId}`);

        const data = await fetchTile(tile);
        const places = normalizeOverpassResponse(data);
        // const places = data;

        await onPlaces(places, tile);

        console.log(`✓ ${places.length} places`);
      } catch (err) {
        console.error(`✗ Tile ${tile.tileId} failed`, err.message);
      }

      // Politeness delay
      await sleep(1500);
    }
  }

  const tiles = generateTiles(bbox);

  function normalizeElement(el) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;

    if (!lat || !lon) return null;

    return {
      source: "osm",
      osmType: el.type,
      osmId: el.id,

      name: el.tags?.name || null,
      amenity: el.tags?.amenity || null,
      cuisine: el.tags?.cuisine || null,
      openingHours: el.tags?.opening_hours || null,

      lat,
      lon,

      address: {
        street: el.tags?.["addr:street"],
        housenumber: el.tags?.["addr:housenumber"],
        city: el.tags?.["addr:city"],
        postcode: el.tags?.["addr:postcode"],
      },

      phone: el.tags?.phone,
      website: el.tags?.website,

      rawTags: el.tags,
    };
  }

  function normalizeOverpassResponse(data) {
    return data.elements.map(normalizeElement).filter(Boolean);
  }

  // Kick off async crawl
  const outputPath = path.join(
    __dirname,
    "osm_data/birmingham-osm-restaurants.jsonl",
  );

  const writeStream = fs.createWriteStream(outputPath, { flags: "a" });

  crawlTiles(tiles, {
    onPlaces: async (places, tile) => {
      for (const place of places) {
        writeStream.write(
          JSON.stringify({
            ...place,
            tileId: tile.tileId,
          }) + "\n",
        );
      }
    },
  });

  res.json({
    status: "started",
    tileCount: tiles.length,
    output: outputPath,
  });
});

app.get("/restaurants", (req, res) => {
  const outputPath = path.join(
    __dirname,
    "osm_data/birmingham-osm-restaurants.jsonl",
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
