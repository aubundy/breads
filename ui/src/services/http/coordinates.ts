import type { UserLocation } from "../../utils/types";

export async function getCoordinates(zipCode: string): Promise<UserLocation> {
  try {
    // const response = await fetch(`/api/coordinates/${zipCode}`);
    // const data = await response.json();
    console.log({ zipCode });
    return { lat: 33.382188736254705, lng: -86.82463804007124, source: "zip" };
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return { lat: 0, lng: 0, source: "zip" };
  }
}
