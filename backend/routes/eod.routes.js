import { Router } from "express";
import {
  generateEodReport,
  viewEodReport,
  viewEodReportByDay,
} from "../controllers/eod.controllers.js";

const router = Router();

// POST /eod
router.post("/", generateEodReport);

// GET /eod
router.get("/", viewEodReport);

// GET /eod/:day
router.get("/:day", viewEodReportByDay);

export default router;
