export function normalizeResponse(context) {
  const { places } = context;
  const normalizedPlaces = places.filter(hasCoordinates).map(normalizeElement);
  return { ...context, places: normalizedPlaces };
}

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
    tildId: 1002,
  };
}
