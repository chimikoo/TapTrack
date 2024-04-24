import { Router } from "express";
import isAuth from "../middlewares/isAuth.js";

import {
  createBeverageItem,
  createFoodItem,
  deleteBeverageItem,
  deleteFoodItem,
  getAllBeverageItems,
  getAllFoodItems,
  getAllMenuItems,
  getOneBeverageItem,
  getOneFoodItem,
  updateBeverageItem,
  addExtra,
  updateFoodItem,
} from "../controllers/menu.controllers.js";

const router = Router();

// GET /users/menu/items
router.get("/", isAuth, getAllMenuItems);

// GET /users/menu/items/foods
router.get("/foods", isAuth, getAllFoodItems);

// GET /users/menu/items/beverages
router.get("/beverages", isAuth, getAllBeverageItems);

// GET /users/menu/items/foods/:id
router.get("/foods/:id", isAuth, getOneFoodItem);

// GET /users/menu/items/beverages/:id
router.get("/beverages/:id", isAuth, getOneBeverageItem);

// POST /users/menu/items/foods
router.post("/foods", isAuth, createFoodItem);

// POST /users/menu/items/beverages
router.post("/beverages", isAuth, createBeverageItem);

// PUT /users/menu/items/foods/:id
router.put("/foods/:id", isAuth, updateFoodItem);

// PUT /users/menu/items/beverages/:id
router.put("/beverages/:id", isAuth, updateBeverageItem);

// DELETE /users/menu/items/foods/:id
router.delete("/foods/:id", isAuth, deleteFoodItem);

// DELETE /users/menu/items/beverages/:id
router.delete("/beverages/:id", isAuth, deleteBeverageItem);

// POST /users/menu/items/extras
router.post("/extras", isAuth, addExtra);

export default router;
