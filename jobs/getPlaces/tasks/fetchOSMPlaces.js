const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export async function fetchOSMPlaces(context) {
  const { bbox } = context;

  console.log("Crawling OSM for bbox: ", bbox);

  try {
    const data = await fetchAmenities(bbox);
    console.log(data.elements);
    console.log(`Crawling complete: ${data.elements.length} total places`);

    return { ...context, places: data.elements };
  } catch (err) {
    console.error(`Fetching OSM places failed:`, err.message);
  }
}

async function fetchAmenities(tile) {
  const query = buildQuery(tile);

  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Breads/0.1 (atmb405@gmail.com)",
    },
    body: "data=" + encodeURIComponent(query),
  });

  if (!res.ok) throw new Error(`Overpass error: ${res.status}`);
  return res.json();
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
