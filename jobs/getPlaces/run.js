import { fetchOSMPlaces } from "./tasks/fetchOSMPlaces.js";
import { normalizeResponse } from "./tasks/normalizeResponse.js";
import { createFile } from "./tasks/createFile.js";

const tasks = {
  fetch: fetchOSMPlaces,
  normalize: normalizeResponse,
  write: createFile,
};

async function run(cliTasks, context) {
  let taskNames = cliTasks;

  // run all by default
  if (!taskNames.length) taskNames = ["fetch", "normalize", "write"];

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

const cliTasks = process.argv.slice(2);

const initialContext = {
  bbox,
  places: [],
};

run(cliTasks, initialContext)
  .then((context) => {
    console.log({
      placesFound: context.places.length,
    });
    console.log("OpenStreetMap crawl job complete.");
  })
  .catch(console.error);
