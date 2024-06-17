import { Router } from "express";
import {
  generateEodReport,
  viewEodReport,
  viewEodReportByDate,
  getReceiptsByDateRange
} from "../controllers/eod.controllers.js";

const router = Router();

// POST /eod
router.post("/", generateEodReport);

// GET /eod
router.get("/", viewEodReport);

// GET /eod/:date
router.get("/date", viewEodReportByDate);

// GET /receipts/date-range
router.get("/receipts/date-range", getReceiptsByDateRange);

export default router;
