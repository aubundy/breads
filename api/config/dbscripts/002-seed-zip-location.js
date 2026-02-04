import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const migration = {
  name: "002-seed-zip-locations",

  async up(conn) {
    const collection = conn.collection("ziplocations");
    const filePath = path.join(__dirname, "../../data/uszips.csv");

    let records = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(parse({ columns: true, trim: true }))
        .on("data", (row) => records.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    if (!records.length) {
      console.warn("No zip records found in CSV");
      return;
    }

    await collection.insertMany(
      records.map((r) => ({
        zip: r.zip,
        lat: Number(r.lat),
        lng: Number(r.lng),
        source: "simplemaps",
      })),
      { ordered: false },
    );
  },

  async down(conn) {
    await conn.collection("ziplocations").drop();
  },
};
