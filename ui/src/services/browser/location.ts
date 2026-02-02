import type { UserLocation } from "../../utils/types";
import { storage } from "./storage";

export function requestLocation(
  acceptanceCallback: PositionCallback,
  rejectionCallback: PositionErrorCallback,
  options?: PositionOptions,
) {
  return () => {
    navigator.geolocation.getCurrentPosition(
      acceptanceCallback,
      rejectionCallback,
      options,
    );
  };
}

export function getUserLocation(): UserLocation {
  return storage.get("userLocation", { lat: 0, lng: 0, source: "none" });
}

export function setUserLocation(location: UserLocation) {
  return storage.set("userLocation", location);
}

export function getUserAnswer(): boolean {
  return storage.get("userAnswer", true);
}

export function setUserAnswer(answer: boolean) {
  return storage.set("userAnswer", answer);
}
