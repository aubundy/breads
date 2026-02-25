import fs from "fs/promises";

const filePath = "./data/google/runAgain.json";

export const migration = {
  name: "006-add-dense-tiles",

  async up(conn) {
    const raw = await fs.readFile(filePath);
    const bboxes = JSON.parse(raw);

    const collection = conn.collection("dense-tiles");

    const operations = bboxes.map((bbox) => {
      const lat = (bbox.north + bbox.south) / 2;
      const lng = (bbox.east + bbox.west) / 2;

      return {
        updateOne: {
          filter: { bbox },
          update: {
            $setOnInsert: {
              bbox,
              centroid: {
                type: "Point",
                coordinates: [lng, lat],
              },
              source: "google_overflow",
              status: "pending",
              depth: 1,
              createdAt: new Date(),
            },
            $set: {
              updatedAt: new Date(),
            },
          },
          upsert: true,
        },
      };
    });

    const result = await collection.bulkWrite(operations, { ordered: false });

    console.log("Inserted:", result.upsertedCount);
    console.log("Modified:", result.modifiedCount);

    // Ensure indexes
    await collection.createIndex({ centroid: "2dsphere" });
    await collection.createIndex({ status: 1 });
    await collection.createIndex(
      { "bbox.north": 1, "bbox.south": 1, "bbox.east": 1, "bbox.west": 1 },
      { unique: true },
    );

    console.log("Done");
  },

  async down(conn) {
    const collection = conn.collection("dense-tiles");
    await collection.deleteMany({ source: "google_overflow" });
  },
};
