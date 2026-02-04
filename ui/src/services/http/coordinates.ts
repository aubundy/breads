import type { UserLocation } from "../../utils/types";

export async function getCoordinates(zipCode: string): Promise<UserLocation> {
  try {
    const response = await fetch(`/api/zip/${zipCode}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return { lat: 0, lng: 0, source: "zip" };
  }
}
