export interface Restaurant {
  id: string;
  name: string;
  amenity: string;
  cuisine: string;
  distance_miles: number | null;
  [key: string]: unknown;
}
