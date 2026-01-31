import type { API_CUISINES, UI_CUISINES } from "./constants";

export interface Restaurant {
  id: string;
  name: string;
  amenity: string;
  cuisine: string;
  distanceMiles: number | null;
  [key: string]: unknown;
}

export interface Filters {
  fastFood: boolean;
  cuisine: UICuisine[];
}

export type UICuisine = keyof typeof UI_CUISINES;
export type APICuisine = keyof typeof API_CUISINES;

export type UserLocation = {
  lat: number;
  lng: number;
  source: "gps" | "zip" | "none";
};

export type Status = "idle" | "loading" | "error" | "no-location" | "empty";
