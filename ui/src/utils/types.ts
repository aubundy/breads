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
  cuisine: string[];
}
