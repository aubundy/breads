import fs from "fs";

const FILE_PATH = "./data/osm/restaurants.jsonl";

export async function createFile(context) {
  const { places } = context;

  console.log(`Saving ${places.length} places to file`);

  const writeStream = fs.createWriteStream(FILE_PATH, { flags: "a" });

  for (const place of places) {
    writeStream.write(JSON.stringify(place) + "\n");
  }

  writeStream.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => {
      console.log("Places saved successfully");
      resolve(context);
    });
    writeStream.on("error", reject);
  });
}
