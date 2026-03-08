import type { API_CUISINES, GROUPED_CUISINES } from "./constants";

export interface Restaurant {
  id: string;
  name: string;
  amenity: string;
  cuisines: APICuisine[];
  distanceMiles: number | null;
  googleMatch: GoogleMatch | null;
  [key: string]: unknown;
}

export interface GoogleMatch {
  placeId: string;
  matchScore: number;
  matchedAt: Date;
}

export interface Filters {
  fastFood: boolean;
  cuisine: GroupedCuisine[];
}

export type GroupedCuisine = keyof typeof GROUPED_CUISINES;
export type APICuisine = keyof typeof API_CUISINES;

export type UserLocation = {
  lat: number;
  lng: number;
  source: "gps" | "zip" | "none";
};

export type Status = "idle" | "loading" | "error" | "no-location" | "empty";

export type Cell = {
  text: string;
  type: "TEXT" | "LINK";
  onClick?: CellAction;
};

export type CellAction = (e: React.MouseEvent) => void | undefined;

export type TableColumn = {
  key: number;
  header: string;
  views: ("mobile" | "tablet" | "desktop")[];
  value: (r: Restaurant, onClick?: CellAction) => Cell;
  width?: number;
};

export type Details = {
  formattedAddress: string;
  nationalPhoneNumber: string;
  rating: number;
};
