import { Router } from "express";
import { addOrder, getAllOrders } from "../controllers/order.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const router = Router();

// POST /users/menu/order
router.post("/", isAuth, addOrder);

// GET /users/menu/order
router.get("/", isAuth, getAllOrders);

export default router;