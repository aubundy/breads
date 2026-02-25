import fs from "fs";

import { getEnvVariable } from "../../../config/env.js";

const filePath = "./data/google/google-places.json";

export async function getGooglePlaces(context) {
  const { queryPoints, useFile } = context;

  let runAgain = [];

  console.log(`Querying Google for ${queryPoints.length} points`);

  let places = new Set();
  let seenIds = new Set();

  for (const point of queryPoints) {
    const results = await fetchNearbyPlaces(point);

    if (results.length === 20) runAgain.push(point.bbox);

    for (const place of results) {
      if (!seenIds.has(place.id)) {
        seenIds.add(place.id);
        places.add({ ...place, point });
      }
    }
  }

  console.log("Places fetched: ", places.size);
  const placesArray = Array.from(places);

  if (useFile) {
    fs.writeFileSync(
      filePath,
      JSON.stringify({ places: placesArray }, null, 2),
    );
    console.log("Results written to ", filePath);
  }

  console.log(runAgain);

  return { ...context, googlePlaces: placesArray, runAgain };
}

async function fetchNearbyPlaces(point) {
  const { latitude, longitude, radius } = point;
  const url = new URL("https://places.googleapis.com/v1/places:searchNearby");

  const body = {
    includedTypes: ["restaurant"],
    locationRestriction: {
      circle: { center: { latitude, longitude }, radius },
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": getEnvVariable("GOOGLE_API_KEY"),
      "X-Goog-FieldMask": "places.id,places.displayName,places.location",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  console.log({ results: data?.places?.length || 0 });

  await new Promise((r) => setTimeout(r, 2500)); // delay

  return data.places || [];
}
