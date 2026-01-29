import type { UserLocation } from "../utils/types";
import { storage } from "./storageService";

export function requestLocation(
  acceptanceCallback: PositionCallback,
  rejectionCallback: PositionErrorCallback,
  options?: PositionOptions,
) {
  navigator.geolocation.getCurrentPosition(
    acceptanceCallback,
    rejectionCallback,
    options,
  );
}

export function getLocation(): UserLocation {
  return storage.get("userLocation", { lat: 0, lng: 0, source: "none" });
}
