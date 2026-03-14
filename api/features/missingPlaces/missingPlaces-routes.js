import express from "express";

import { handleGetMissingPlaces } from "./missingPlaces-controller.js";

const router = express.Router();

router.get("/missing-places", handleGetMissingPlaces);

export default router;
