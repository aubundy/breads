import service from "./missingPlaces-service.js";

export async function handleGetMissingPlaces(req, res) {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ error: "Invalid lat/lng" });
    }

    const results = await service.getMissingPlaces({ lat, lng });

    console.log(results);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
