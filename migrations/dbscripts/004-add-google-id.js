import fs from "fs";

const filePath = "./data/google/matches.json";

export const migration = {
  name: "004-add-google-id",

  async up(conn) {
    const collection = conn.collection("places");

    console.log("Reading matches file...");

    const matches = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!Array.isArray(matches)) {
      throw new Error("Match file must be an array");
    }

    let ops = [];

    for (const match of matches) {
      const { id, googleId, bestScore } = match;

      if (!id || !googleId) continue;

      ops.push({
        updateOne: {
          filter: { osmId: id, googleMatch: { $exists: false } },
          update: {
            $set: {
              googleMatch: {
                placeId: googleId,
                matchScore: bestScore,
                matchedAt: new Date(),
              },
            },
          },
        },
      });
    }

    if (ops.length === 0) {
      console.log("No operations to perform");
      return;
    }

    const result = await collection.bulkWrite(ops);

    console.log("--- Migration Complete ---");
    console.log(result);
    console.log(
      "Skipped (already matched):",
      matches.length - result.modifiedCount,
    );
  },

  async down(conn) {
    await conn
      .collection("places")
      .updateMany(
        { "googleMatch.source": "migration" },
        { $unset: { googleMatch: "" } },
      );
  },
};
