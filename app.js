import express from "express";

// import { crawlTiles } from "./openstreetmap/service.js";
import restaurantsRouter from "./restaurants/restaurants-routes.js";

const app = express();
const port = 3000;

// app.get("/", async (req, res) => {
//   await crawlTiles();
//   res.send("Crawling started");
// });

app.use("/api", restaurantsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
