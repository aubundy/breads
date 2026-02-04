import express from "express";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";

// import { crawlTiles } from "./features/openstreetmap/service.js";
import restaurantsRouter from "./features/restaurants/restaurants-routes.js";
import zipRouter from "./features/zipLocation/zipLocation-routes.js";

dotenv.config({ path: `./api/config/.env.${process.env.NODE_ENV}` });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../ui/dist")));

// app.get("/", async (req, res) => {
//   await crawlTiles();
//   res.send("Crawling started");
// });

app.use("/api", restaurantsRouter);
app.use("/api", zipRouter);
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../ui/dist", "index.html"));
});

const startServer = async () => {
  await connectDB(process.env.MONGODB_URI);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
