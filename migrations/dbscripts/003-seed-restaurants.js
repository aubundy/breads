import fs from "fs";
import readline from "readline";
import { randomUUID } from "crypto";

const BATCH_SIZE = 1000;
const filePath = "./data/restaurants.jsonl";

export const migration = {
  name: "003-seed-restaurants",

  async up(conn) {
    const collection = conn.collection("places");

    console.log("Connected to MongoDB");

    // Drop collection for one-time migration
    await collection.drop().catch(() => {});
    await collection.createIndex({ id: 1 }, { unique: true });

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    let bulkOps = [];
    let processed = 0;

    for await (const line of rl) {
      if (!line.trim()) continue;

      const el = JSON.parse(line);

      if (typeof el.lat !== "number" || typeof el.lon !== "number") continue;
      if (!el.name) continue;

      const uid = randomUUID();

      function normalizeCuisines(cuisineString) {
        if (!cuisineString || typeof cuisineString !== "string") return [];

        return [
          ...new Set(
            cuisineString.split(";").map((c) => c.trim().toLowerCase()),
          ),
        ];
      }

      bulkOps.push({
        insertOne: {
          document: {
            id: uid,
            osmType: el.osmType,
            tileId: el.tileId,
            name: el.name,
            normalizedName: el.name?.toLowerCase().trim(),
            tags: el.tags || {},
            amenity: el.amenity,
            cuisines: normalizeCuisines(el.cuisine),
            location: {
              type: "Point",
              coordinates: [el.lon, el.lat], // MUST be [lon, lat]
            },
            source: "osm",
            updatedAt: new Date(),
          },
        },
      });

      if (bulkOps.length >= BATCH_SIZE) {
        await collection.bulkWrite(bulkOps);
        processed += bulkOps.length;
        console.log(`Inserted ${processed}`);
        bulkOps = [];
      }
    }

    if (bulkOps.length > 0) {
      await collection.bulkWrite(bulkOps);
      processed += bulkOps.length;
    }

    console.log(`Inserted total: ${processed}`);

    await collection.createIndex({ location: "2dsphere" });
    await collection.createIndex({ cuisines: 1 });
    await collection.createIndex({ amenity: 2 });

    console.log("2dsphere index created.");
    console.log("Migration complete.");
  },

  async down(conn) {
    await conn.collection("places").deleteMany({ source: "osm" });
  },
};
