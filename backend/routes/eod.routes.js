import { Router } from "express";
import { generateEodReport, viewEodReport } from "../controllers/eod.controllers.js";

import isAuth from "../middlewares/isAuth.js";

const router = Router();

// POST /eod/generate
router.post("/", isAuth, generateEodReport);
router.get("/", isAuth, viewEodReport);

export default router;