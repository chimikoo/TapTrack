import { Router } from "express";
import { addOrder, deleteOrder, getAllOrders, getOrderById, updateOrder } from "../controllers/order.controllers.js";

const router = Router();

// POST /users/menu-orders
router.post("/", addOrder);

// GET /users/menu-orders
router.get("/", getAllOrders);

// GET /users/menu-orders/:id
router.get("/:id", getOrderById);

// PUT /users/menu-orders/:id
router.put("/:id", updateOrder);

// DELETE /users/menu-orders/:id
router.delete("/:id", deleteOrder);

export default router;