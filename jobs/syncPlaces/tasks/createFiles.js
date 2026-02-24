import fs from "fs/promises";

const filePath = "./data/google";

export async function createFiles(context) {
  const { matches, newPlaces, runAgain } = context;

  await fs.writeFile(
    `${filePath}/matches.json`,
    JSON.stringify(matches, null, 2),
  );

  await fs.writeFile(
    `${filePath}/newPlaces.json`,
    JSON.stringify(newPlaces, null, 2),
  );

  await fs.writeFile(
    `${filePath}/runAgain.json`,
    JSON.stringify(runAgain, null, 2),
  );

  await fs.writeFile(
    `${filePath}/metadata.json`,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        matchCount: matches.length,
        newPlaceCount: newPlaces.length,
        runAgainCount: runAgain.length,
      },
      null,
      2,
    ),
  );

  console.log(`Results written to ${filePath}`);

  return context;
}
