import { formatCuisines, formatDistance } from "./formatters";
import type { APICuisine, CellAction, Restaurant, TableColumn } from "./types";

export const TABLE_COLUMNS: TableColumn[] = [
  {
    key: 0,
    header: "ID",
    views: ["mobile", "tablet", "desktop"],
    value: (r: Restaurant) => ({ text: r.id, type: "TEXT" }),
  },
  {
    key: 1,
    header: "Restaurant name",
    views: ["mobile", "tablet", "desktop"],
    value: (r: Restaurant, onClick?: CellAction) => {
      const c = (r.cuisines[0] as APICuisine) || "unknown";

      return {
        text: `${API_CUISINES[c]?.emoji || "🍽️"} ${r.name}`,
        type: !r.googleMatch ? "TEXT" : "LINK",
        onClick,
      };
    },
  },
  {
    key: 2,
    header: "Amenity",
    views: ["desktop"],
    value: (r: Restaurant) => ({ text: r.amenity, type: "TEXT" }),
    width: 200,
  },
  {
    key: 3,
    header: "Cuisine",
    views: ["tablet", "desktop"],
    value: (r: Restaurant) => ({
      text: formatCuisines(r.cuisines),
      type: "TEXT",
    }),
    width: 250,
  },
  {
    key: 4,
    header: "Mi",
    views: ["mobile", "tablet", "desktop"],
    value: (r: Restaurant) => ({
      text: formatDistance(r.distanceMiles),
      type: "TEXT",
    }),
    width: 70,
  },
];

export const GROUPED_CUISINES = {
  American: [
    "american",
    "bar_and_grill",
    "barbecue",
    "burger",
    "cajun",
    "chicken",
    "chicken_fingers",
    "chicken_salad",
    "fries",
    "pizza",
    "hot_dog",
    "southern",
    "steak",
    "steak_house",
    "wings",
    "regional",
  ],
  "Latin American": ["mexican", "tex-mex", "latin_american", "tamales", "maiz"],
  Asian: ["asian", "chinese", "japanese", "sushi", "ramen", "korean", "thai"],
  European: [
    "italian",
    "pasta",
    "greek",
    "mediterranean",
    "british",
    "european",
  ],
  "Middle Eastern": ["middle_eastern", "indian", "ethiopian"],
  Breakfast: ["breakfast", "pancake", "bagel"],
  "Light Meals": ["sandwich", "salad"],
  Desserts: ["dessert", "ice_cream", "frozen_yogurt", "donut", "cookies"],
  "Cafes & Drinks": ["coffee_shop", "bubble_tea", "juice", "smoothie"],
  Seafood: ["seafood"],
  Other: ["fusion", "international", "buffet", "unknown", "bakery"],
};

export const API_CUISINES = {
  american: {
    text: "American",
    emoji: "🍔",
  },
  asian: {
    text: "Asian",
    emoji: "🍜",
  },
  bagel: {
    text: "Bagel",
    emoji: "🥯",
  },
  bakery: {
    text: "Bakery",
    emoji: "🥐",
  },
  bar_and_grill: {
    text: "Bar and Grill",
    emoji: "🍻",
  },
  barbecue: {
    text: "Barbecue",
    emoji: "🍖",
  },
  breakfast: {
    text: "Breakfast",
    emoji: "🍳",
  },
  british: {
    text: "British",
    emoji: "🥧",
  },
  bubble_tea: {
    text: "Bubble Tea",
    emoji: "🧋",
  },
  buffet: {
    text: "Buffet",
    emoji: "🍽️",
  },
  burger: {
    text: "Burger",
    emoji: "🍔",
  },
  cajun: {
    text: "Cajun",
    emoji: "🦐",
  },
  chicken_fingers: {
    text: "Chicken Fingers",
    emoji: "🍗",
  },
  chicken_salad: {
    text: "Chicken Salad",
    emoji: "🥗",
  },
  chicken: {
    text: "Chicken",
    emoji: "🍗",
  },
  chinese: {
    text: "Chinese",
    emoji: "🥡",
  },
  coffee_shop: {
    text: "Coffee Shop",
    emoji: "☕",
  },
  cookies: {
    text: "Cookies",
    emoji: "🍪",
  },
  dessert: {
    text: "Dessert",
    emoji: "🍰",
  },
  donut: {
    text: "Donut",
    emoji: "🍩",
  },
  ethiopian: {
    text: "Ethiopian",
    emoji: "🍲",
  },
  european: {
    text: "European",
    emoji: "🍝",
  },
  fries: {
    text: "Fries",
    emoji: "🍟",
  },
  frozen_yogurt: {
    text: "Frozen Yogurt",
    emoji: "🍦",
  },
  fusion: {
    text: "Fusion",
    emoji: "🍽️",
  },
  greek: {
    text: "Greek",
    emoji: "🥙",
  },
  hot_dog: {
    text: "Hot Dog",
    emoji: "🌭",
  },
  ice_cream: {
    text: "Ice Cream",
    emoji: "🍨",
  },
  indian: {
    text: "Indian",
    emoji: "🍛",
  },
  international: {
    text: "International",
    emoji: "🌍",
  },
  italian: {
    text: "Italian",
    emoji: "🍝",
  },
  japanese: {
    text: "Japanese",
    emoji: "🍣",
  },
  juice: {
    text: "Juice",
    emoji: "🧃",
  },
  korean: {
    text: "Korean",
    emoji: "🍲",
  },
  latin_american: {
    text: "Latin American",
    emoji: "🌮",
  },
  maiz: {
    text: "Maiz",
    emoji: "🌽",
  },
  mediterranean: {
    text: "Mediterranean",
    emoji: "🫒",
  },
  mexican: {
    text: "Mexican",
    emoji: "🌮",
  },
  middle_eastern: {
    text: "Middle Eastern",
    emoji: "🧆",
  },
  pancake: {
    text: "Pancake",
    emoji: "🥞",
  },
  pasta: {
    text: "Pasta",
    emoji: "🍝",
  },
  pizza: {
    text: "Pizza",
    emoji: "🍕",
  },
  ramen: {
    text: "Ramen",
    emoji: "🍜",
  },
  regional: {
    text: "Regional",
    emoji: "🍽️",
  },
  salad: {
    text: "Salad",
    emoji: "🥗",
  },
  sandwich: {
    text: "Sandwich",
    emoji: "🥪",
  },
  seafood: {
    text: "Seafood",
    emoji: "🦞",
  },
  smoothie: {
    text: "Smoothie",
    emoji: "🥤",
  },
  southern: {
    text: "Southern",
    emoji: "🍗",
  },
  steak_house: {
    text: "Steak House",
    emoji: "🥩",
  },
  steak: {
    text: "Steak",
    emoji: "🥩",
  },
  sushi: {
    text: "Sushi",
    emoji: "🍣",
  },
  tamales: {
    text: "Tamales",
    emoji: "🫔",
  },
  "tex-mex": {
    text: "Tex-Mex",
    emoji: "🌯",
  },
  thai: {
    text: "Thai",
    emoji: "🍜",
  },
  unknown: {
    text: "Unknown",
    emoji: "🍽️",
  },
  wings: {
    text: "Wings",
    emoji: "🍗",
  },
};
