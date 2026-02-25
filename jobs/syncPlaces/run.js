import { createQueryPoints } from "./tasks/createQueryPoints.js";
import { getGooglePlaces } from "./tasks/getGooglePlaces.js";
import { comparePlaces } from "./tasks/comparePlaces.js";
import { createFiles } from "./tasks/createFiles.js";

import { loadEnvVariables } from "../../config/env.js";

const tasks = {
  create: createQueryPoints,
  fetch: getGooglePlaces,
  compare: comparePlaces,
  write: createFiles,
};

async function run(cliTasks, context) {
  loadEnvVariables();
  let taskNames = cliTasks;

  // run all by default
  if (!taskNames.length) taskNames = ["create", "fetch", "compare", "write"];

  for (const name of taskNames) {
    console.log(`Running task: ${name}`);
    const task = tasks[name];

    if (!task) throw new Error(`Unknown task: ${name}`);

    context = await task(context);
  }

  return context;
}

const bbox = {
  south: 33.292655662521405,
  west: -87.20260620117188,
  north: 33.67978264318629,
  east: -86.35940551757814,
};

const args = process.argv.slice(2);

const useFile = args.includes("--use-file");
const cliTasks = args.filter((arg) => arg !== "--use-file");

const initialContext = {
  bbox,
  queryPoints: [],
  googlePlaces: [],
  matches: [],
  newPlaces: [],
  runAgain: [],
  useFile,
};

run(cliTasks, initialContext)
  .then((context) => {
    console.log({
      matches: context.matches.length,
      newPlaces: context.newPlaces.length,
      runAgain: context.runAgain.length,
    });
    console.log("Sync places job complete.");
  })
  .catch(console.error);
