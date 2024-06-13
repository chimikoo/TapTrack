import { Router } from "express";
import {
  createReceipt,
  getAllReceipts,
  getReceiptById,
  getReceiptByUserId,
  getOldReceiptsByUserId, // Import the new controller function
  getAllOldReceipts,
  updateReceipt,
  getOldReceiptById,
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

// GET /users/checkout/user/:id/old - Add the new route for old receipts
router.get("/user/:id/old", getOldReceiptsByUserId);

// GET /users/checkout/receipts/oldreceipts
router.get("/receipts/oldreceipts", getAllOldReceipts);

// GET /users/checkout/receipts/oldreceipts/:id
router.get("/receipts/oldreceipts/:id", getOldReceiptById);

export default router;
