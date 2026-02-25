import { Place } from "../../../api/features/restaurants/restaraunts-model.js";

import { connectDB } from "../../../config/db.js";
import { getEnvVariable } from "../../../config/env.js";

export async function createQueryPoints(context) {
  await connectDB(getEnvVariable("MONGODB_URI"));

  const { bbox } = context;

  const tiles = await createTiles(bbox, 1000);
  const expected = tiles.reduce((sum, t) => sum + t.expectedHits, 0);
  console.log("Expected places: ", expected);
  const queryPoints = tilesToGoogleQueryPoints(tiles).slice(0, 5); // update as needed

  return { ...context, queryPoints };
}

async function createTiles(bbox, expectedHits) {
  const { north, south, east, west } = bbox;
  const MAX_RESULTS = 10;

  const tileCount = Math.ceil(expectedHits / MAX_RESULTS);

  const rows = Math.ceil(Math.sqrt(tileCount));
  const cols = Math.ceil(tileCount / rows);

  const osmPlaces = await Place.find({
    location: {
      $geoWithin: {
        $box: [
          [west, south],
          [east, north],
        ],
      },
    },
  });

  const grid = buildDensityGrid(bbox, osmPlaces, rows, cols);
  const tiles = markTilesForSubdivision(grid);

  let result = [];

  for (const tile of tiles) {
    if (tile.expectedHits === 0) continue;
    if (tile.expectedHits > MAX_RESULTS) {
      const subResults = await createTiles(tile, tile.expectedHits);
      result.push(...subResults);
    } else {
      result.push(tile);
    }
  }

  return result;
}

function tilesToGoogleQueryPoints(tiles) {
  const EARTH_RADIUS = 6378137; // meters

  function haversineDistance(lat1, lng1, lat2, lng2) {
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS * c;
  }

  return tiles.map((tile) => {
    const { south, north, west, east } = tile;

    const latitude = (south + north) / 2;
    const longitude = (west + east) / 2;

    // radius to tile corner since overlap is ok
    const radius = haversineDistance(latitude, longitude, north, east);

    return {
      latitude,
      longitude,
      radius: Math.floor(radius),
      bbox: { north, south, east, west },
    };
  });
}

function buildDensityGrid(bbox, osmPlaces, rows) {
  const { north, south, east, west } = bbox;

  const midLat = (north + south) / 2;

  // meters per degree
  const metersPerDegLat = 111_320;
  const metersPerDegLng = 111_320 * Math.cos((midLat * Math.PI) / 180);

  const latMeters = (north - south) * metersPerDegLat;
  const lngMeters = (east - west) * metersPerDegLng;

  // Make tile height in meters
  const tileSizeMeters = latMeters / rows;

  // Derive number of columns so tiles are square in meters
  const cols = Math.ceil(lngMeters / tileSizeMeters);

  const latStep = tileSizeMeters / metersPerDegLat;
  const lngStep = tileSizeMeters / metersPerDegLng;

  let grid = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid.push({
        south: south + r * latStep,
        north: south + (r + 1) * latStep,
        west: west + c * lngStep,
        east: west + (c + 1) * lngStep,
        osmCount: 0,
      });
    }
  }

  // Assign OSM places
  for (const point of osmPlaces) {
    const [lng, lat] = point.location.coordinates;

    const r = Math.min(rows - 1, Math.floor((lat - south) / latStep));
    const c = Math.min(cols - 1, Math.floor((lng - west) / lngStep));

    const index = r * cols + c;
    if (grid[index]) grid[index].osmCount++;
  }

  return grid;
}

function markTilesForSubdivision(grid) {
  const EXPANSION_FACTOR = 3; // tune from real data

  return grid.map((tile) => ({
    ...tile,
    expectedHits: tile.osmCount * EXPANSION_FACTOR,
  }));
}
