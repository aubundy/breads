import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { connectDB } from "../config/db.js";
import { loadEnvVariables } from "../config/env.js";

import restaurantsRouter from "./features/restaurants/restaurants-routes.js";
import locationRouter from "./features/location/location-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../ui/dist")));

app.use("/api", restaurantsRouter);
app.use("/api", locationRouter);
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../ui/dist", "index.html"));
});

const startServer = async () => {
  loadEnvVariables();
  await connectDB(process.env.MONGODB_URI);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
