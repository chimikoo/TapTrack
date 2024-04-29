import { Router } from "express";
import { generateEodReport } from "../controllers/eod.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const router = Router();

// POST /eod/generate
router.post("/generate", isAuth, generateEodReport);

export default router;