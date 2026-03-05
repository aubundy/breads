import { getCoordinates, reverseGeocode } from "./location-service.js";
import { validateZipCode } from "../../utils/validators.js";

export async function handleGetCoordinates(req, res) {
  const { zipCode } = req.query;

  if (validateZipCode(zipCode)) {
    return res.status(400).json({ error: "Invalid zip code format" });
  }

  try {
    const coordinates = await getCoordinates(zipCode);

    if (!coordinates) {
      return res.status(404).json({ error: "Zip code not found" });
    }

    return res.status(200).json(coordinates);
  } catch (err) {
    console.error("Error fetching zip location:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function handleReverseGeocode(req, res) {
  const { lat, lng } = req.query;

  try {
    const response = await reverseGeocode(lat, lng);
    return res.status(200).json(response);
  } catch (err) {
    console.error("Error reverse geocoding:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
