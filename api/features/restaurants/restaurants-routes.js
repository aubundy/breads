import express from "express";

import {
  handleGetRestaurants,
  handleGetDetails,
} from "./restaurants-controller.js";

import { placeDetailsLimiter } from "../../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/restaurants", handleGetRestaurants);
router.get("/restaurants/:placeId", placeDetailsLimiter, handleGetDetails);

export default router;
