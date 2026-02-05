import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const FILE_PATH = "../../data/san-fran-osm-restaurants.jsonl";

export async function crawlTiles() {
  const tiles = generateTiles(bbox3);
  console.log(tiles.length);
  //   for (let i = 0; i < tiles.length; i++) {
  try {
    // console.log(`Crawling tile ${i} ${tiles[i].tileId}`);

    const data = await getAmenities(bbox3);
    const places = normalizeOverpassResponse(data);
    await savePlaces(places, 1001);

    console.log(`✓ ${places.length} places`);
  } catch (err) {
    console.error(`✗ Tile ${1001} failed`, err.message);
  }

  // Politeness delay
  await sleep(2000);
  //   }

  console.log("Crawling complete");
}

async function getAmenities(tile) {
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

function normalizeOverpassResponse(data) {
  function hasCoordinates(el) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;

    return Boolean(lat && lon);
  }

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

  return data.elements.filter(hasCoordinates).map(normalizeElement);
}

async function savePlaces(places, tileId) {
  const outputPath = path.join(__dirname, FILE_PATH);
  const writeStream = fs.createWriteStream(outputPath, { flags: "a" });

  for (const place of places) {
    writeStream.write(
      JSON.stringify({
        tileId,
        ...place,
      }) + "\n",
    );
  }
}

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

// const bbox = {
//   south: 33.37548,
//   west: -86.84023,
//   north: 33.3997,
//   east: -86.75715,
// };

const bbox2 = {
  south: 33.292655662521405,
  west: -87.20260620117188,
  north: 33.67978264318629,
  east: -86.35940551757814,
};

const bbox3 = {
  south: 37.17891977403989,
  west: -122.73788452148439,
  north: 38.043765107439675,
  east: -121.45935058593751,
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

crawlTiles();
