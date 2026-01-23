import express from "express";

// import { crawlTiles } from "./openstreetmap/service.js";
import restaurantsRouter from "./restaurants/restaurants-routes.js";

import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "../ui/dist")));

// app.get("/", async (req, res) => {
//   await crawlTiles();
//   res.send("Crawling started");
// });

app.use("/api", restaurantsRouter);
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../ui/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
