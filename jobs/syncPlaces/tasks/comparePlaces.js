import fs from "fs";
import stringSimilarity from "string-similarity";

import { Place } from "../../../api/features/restaurants/restaraunts-model.js";

import { connectDB } from "../../../config/db.js";
import { getEnvVariable } from "../../../config/env.js";

const filePath = "./data/google/google-places.json";

export async function comparePlaces(context) {
  await connectDB(getEnvVariable("MONGODB_URI"));

  let { googlePlaces, useFile } = context;

  if (useFile) {
    const { places } = JSON.parse(fs.readFileSync(filePath));
    googlePlaces = places;
  }

  console.log("Number of google places: ", googlePlaces.length);

  let matches = [];
  let newPlaces = [];

  for (const place of googlePlaces) {
    const { id, displayName, location, point } = place;

    const lng = location.longitude;
    const lat = location.latitude;

    const nearbyOsmPlaces = await Place.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 100, // meters
        },
      },
    }).limit(10);

    let bestMatch = null;
    let bestScore = 0;
    let hasStrongNameMatch = false;

    const normalizedGoogle = normalizeName(displayName.text);

    for (const osmPlace of nearbyOsmPlaces) {
      console.log("Comparing: ", osmPlace.osmId);

      const normalizedOsm = normalizeName(osmPlace.name);

      const similarity = stringSimilarity.compareTwoStrings(
        normalizedGoogle,
        normalizedOsm,
      );

      if (strongNameMatch(normalizedGoogle, normalizedOsm)) {
        hasStrongNameMatch = true;
        bestMatch = osmPlace;
        bestScore = similarity;
        break;
      }

      if (similarity > bestScore) {
        bestScore = similarity;
        bestMatch = osmPlace;
      }
    }

    const result = {
      googleId: id,
      googleName: displayName.text,
      id: bestMatch?.osmId,
      name: bestMatch?.name,
      bestScore,
    };

    if (hasStrongNameMatch || (bestMatch && bestScore >= 0.5)) {
      matches.push(result);
    } else {
      newPlaces.push({ ...result, point });
    }
  }

  return { ...context, matches, newPlaces };
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\b(the|restaurant|grill|cafe|bar)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function strongNameMatch(a, b) {
  return a.includes(b) || b.includes(a);
}
