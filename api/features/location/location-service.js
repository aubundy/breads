import { ZipLocation } from "./location-model.js";

export async function getCoordinates(zip) {
  try {
    return await ZipLocation.findOne({ zip });
  } catch (err) {
    console.error("Error fetching zip location:", err);
    throw Error(err);
  }
}

export async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=geocodejson`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Nominatim error: ${response.status}`);

  const data = await response.json();
  return data.features[0].properties.geocoding.city;
}
