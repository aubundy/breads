export const migration = {
  name: "004-rename-id-field",

  async up(conn) {
    const collection = conn.collection("places");

    await collection.dropIndex("id_1");

    const result = await collection.updateMany(
      { id: { $exists: true }, osmId: { $exists: false } },
      { $rename: { id: "osmId" } },
    );

    await collection.createIndex({ osmId: 1 }, { unique: true });

    console.log("Migration complete");
    console.log("Modified count:", result.modifiedCount);
  },

  async down(conn) {
    const collection = conn.collection("places");

    await collection.updateMany(
      { osmId: { $exists: true } },
      { $rename: { osmId: "id" } },
    );

    await collection.dropIndex("osmId_1").catch(() => {});
  },
};
