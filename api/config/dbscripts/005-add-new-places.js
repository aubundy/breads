import fs from "fs/promises";

const filePath = "./data/google/newPlaces.json";

export const migration = {
  name: "005-add-new-places",

  async up(conn) {
    const raw = await fs.readFile(filePath);
    const newPlaces = JSON.parse(raw);

    const collection = conn.collection("missing-places");

    console.log(`Preparing ${newPlaces.length} records...`);

    const operations = newPlaces.map((place) => ({
      updateOne: {
        filter: { googleId: place.googleId },
        update: {
          $setOnInsert: {
            googleId: place.googleId,
            googleName: place.googleName,
            location: {
              type: "Point",
              coordinates: [place.point.longitude, place.point.latitude],
            },
            radius: place.point.radius,
            bbox: place.point.bbox,
            createdAt: new Date(),
          },
          $set: {
            importedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    const result = await collection.bulkWrite(operations, { ordered: false });

    console.log("Bulk write result:");
    console.log("Inserted:", result.upsertedCount);
    console.log("Modified:", result.modifiedCount);

    console.log("Creating indexes...");

    await collection.createIndex({ googleId: 1 }, { unique: true });
    await collection.createIndex({ location: "2dsphere" });

    console.log("Migration complete");
  },

  async down(conn) {
    const collection = conn.collection("missing-places");
    await collection.deleteMany({ importedAt: { $exists: true } });
  },
};
