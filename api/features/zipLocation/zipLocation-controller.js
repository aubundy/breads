import { getCoordinates } from "./zipLocation-service.js";
import { validateZipCode } from "../../utils/validators.js";

export async function handleGetCoordinates(req, res) {
  const { zipCode } = req.params;

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
