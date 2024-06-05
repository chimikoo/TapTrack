import { Router } from "express";
import {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  getReceiptByUserId,
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

// GET /users/checkout/user/:id
router.get("/user/:id", getReceiptByUserId);

export default router;
