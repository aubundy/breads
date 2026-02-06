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
  const defaultLocation: UserLocation = { lat: 0, lng: 0, source: "none" };
  const currentLocation = storage.get("userLocation", defaultLocation);

  if (currentLocation.source === "gps") {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setUserLocation({
        lat: coords.latitude,
        lng: coords.longitude,
        source: "gps",
      });
    });
  }

  return storage.get("userLocation", defaultLocation);
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
