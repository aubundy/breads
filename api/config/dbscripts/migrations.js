import { migration as m001 } from "./001-create-zip-location.js";
import { migration as m002 } from "./002-seed-zip-location.js";
import { migration as m003 } from "./003-seed-restaurants.js";

export const migrations = [m001, m002, m003];
