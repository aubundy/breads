export function findNearby(points, userLat, userLng, radiusMiles = 5, page) {
  const bbox = getBoundingBox(userLat, userLng, radiusMiles);
  const p2 = points.filter((point) => point.name !== null);
  const candidates = getCandidates(p2, bbox, userLat, userLng, radiusMiles);

  const fromIndex = page * 25;
  const limit = fromIndex + 25;
  console.log(`Returning results from index ${fromIndex} to ${limit}`);

  return candidates
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(fromIndex, limit);
}

function getBoundingBox(userLat, userLng, radiusMiles = 5) {
  const latDelta = radiusMiles / 69; // ~69 miles per degree latitude
  const lngDelta = radiusMiles / (69 * Math.cos((userLat * Math.PI) / 180));

  const minLat = userLat - latDelta;
  const maxLat = userLat + latDelta;
  const minLng = userLng - lngDelta;
  const maxLng = userLng + lngDelta;

  return { minLat, maxLat, minLng, maxLng };
}

function getCandidates(points, bbox, userLat, userLng, radiusMiles) {
  let candidates = [];
  for (const point of points) {
    if (
      point.lat >= bbox.minLat &&
      point.lat <= bbox.maxLat &&
      point.lon >= bbox.minLng &&
      point.lon <= bbox.maxLng
    ) {
      const distanceMiles = haversineMiles(
        userLat,
        userLng,
        point.lat,
        point.lon,
      );

      if (distanceMiles <= radiusMiles) {
        // console.log(
        //   `Distance to point ${point.lat},${point.lon}: ${distanceMiles} miles`,
        // );
        let copy = point;
        copy.distanceMiles = distanceMiles; // move to helper fn
        candidates.push(copy);
      }
    }
  }

  return candidates;
}

function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Radius of the Earth in miles

  const toRad = (deg) => (deg * Math.PI) / 180;

  const rlat1 = toRad(lat1);
  const rlat2 = toRad(lat2);
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}
