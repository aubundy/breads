import { apiClient } from "./apiClient";

import type { UserLocation } from "../../utils/types";

export async function getCoordinates(zipCode: string): Promise<UserLocation> {
  try {
    return await apiClient(`/api/places?zipCode=${zipCode}`);
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return { lat: 0, lng: 0, source: "zip" };
  }
}

export async function getLocation(lat: number, lng: number): Promise<string> {
  try {
    return await apiClient(`/api/places/reverse?lat=${lat}&lng=${lng}`);
  } catch (error) {
    console.error("Error fetching location name:", error);
    return "Current location";
  }
}
