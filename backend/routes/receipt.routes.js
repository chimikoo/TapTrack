import e, { Router } from "express";
import { get } from "mongoose";
import {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
} from "../controllers/receipt.controller.js";

const router = Router();

// GET /users/checkout
router.get("/", getAllReceipts);

// POST /users/checkout
router.post("/", createReceipt);

// GET /users/checkout/:id
router.get("/:id", getReceiptById);

// PATCH /users/checkout/:id
router.patch("/:id", updateReceipt);


export default router;
