import express from "express";

import {
  handleGetCoordinates,
  handleReverseGeocode,
} from "./location-controller.js";

const router = express.Router();

router.get("/places", handleGetCoordinates);
router.get("/places/reverse", handleReverseGeocode);

export default router;
