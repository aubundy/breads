import express from "express";

import { handleGetCoordinates } from "./zipLocation-controller.js";

const router = express.Router();

router.get("/zip/:zipCode", handleGetCoordinates);

export default router;
