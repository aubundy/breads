import express from "express";

import { handleGetRestaurants } from "./restaurants-controller.js";

const router = express.Router();

router.get("/restaurants", handleGetRestaurants);

export default router;
