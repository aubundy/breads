import { migration as m001 } from "./001-create-zip-location.js";
import { migration as m002 } from "./002-seed-zip-location.js";
import { migration as m003 } from "./003-seed-restaurants.js";
import { migration as m004a } from "./004-rename-id-field.js";
import { migration as m004b } from "./004-add-google-id.js";

export const migrations = [m001, m002, m003, m004a, m004b];
