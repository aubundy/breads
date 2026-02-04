import { ZipLocation } from "./zipLocation-model.js";

export async function getCoordinates(zip) {
  try {
    return await ZipLocation.findOne({ zip });
  } catch (err) {
    console.error("Error fetching zip location:", err);
    throw Error(err);
  }
}
