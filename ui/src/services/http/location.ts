import type { UserLocation } from "../../utils/types";

export async function getCoordinates(zipCode: string): Promise<UserLocation> {
  try {
    const response = await fetch(`/api/places?zipCode=${zipCode}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return { lat: 0, lng: 0, source: "zip" };
  }
}

export async function getLocation(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(`/api/places/reverse?lat=${lat}&lng=${lng}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching location name:", error);
    return "Current location";
  }
}
