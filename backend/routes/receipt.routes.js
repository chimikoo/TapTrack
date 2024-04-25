import e, { Router } from 'express';
import { get } from 'mongoose';
import { createReceipt, getAllReceipts } from '../controllers/receipt.controller.js';

const router = Router();

// GET /users/checkout
router.get("/", getAllReceipts);

// POST /users/checkout
router.post("/", createReceipt);

export default router;