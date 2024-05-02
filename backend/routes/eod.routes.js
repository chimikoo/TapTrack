import { Router } from "express";
import {
  generateEodReport,
  viewEodReport,
  viewEodReportByDate,
} from "../controllers/eod.controllers.js";

const router = Router();

// POST /eod
router.post("/", generateEodReport);

// GET /eod
router.get("/", viewEodReport);

// GET /eod/:date
router.get("/:date", viewEodReportByDate);

export default router;
