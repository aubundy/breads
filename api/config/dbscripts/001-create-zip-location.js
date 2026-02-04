export const migration = {
  name: "001-create-zip-location",

  async up(conn) {
    const collection = conn.collection("ziplocations");
    await collection.createIndex({ zip: 1 }, { unique: true });
  },

  async down(conn) {
    await conn.collection("ziplocations").drop();
  },
};
