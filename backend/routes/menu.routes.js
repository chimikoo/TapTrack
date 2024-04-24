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

// POST /users/menu/items/addFood
router.post("/addFood", isAuth, createFoodItem);

// POST /users/menu/items/addBeverage
router.post("/addBeverage", isAuth, createBeverageItem);

// PUT /users/menu/items/updateFood/:id
router.put("/updateFood/:id", isAuth, updateFoodItem);

// PUT /users/menu/items/updateBeverage/:id
router.put("/updateBeverage/:id", isAuth, updateBeverageItem);

// DELETE /users/menu/items/deleteFood/:id
router.delete("/deleteFood/:id", isAuth, deleteFoodItem);

// DELETE /users/menu/items/deleteBeverage/:id
router.delete("/deleteBeverage/:id", isAuth, deleteBeverageItem);

// POST /users/menu/items/addExtra
router.post("/addExtra", isAuth, addExtra);

export default router;
