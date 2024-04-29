import { Router } from "express";

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
  updateItemStock,
} from "../controllers/menu.controllers.js";
import isAdminOrManager from "../middlewares/isAdminOrManager.js";

const router = Router();

// GET /users/menu-items
router.get("/", getAllMenuItems);

// foods routes
router
  .route("/foods")
  .get(getAllFoodItems) // GET /users/menu-items/foods
  .post(isAdminOrManager, createFoodItem); // POST /users/menu-items/foods

router
  .route("/foods/:id")
  .get(getOneFoodItem) // GET /users/menu-items/foods/:id
  .put(isAdminOrManager, updateFoodItem) // PUT /users/menu-items/foods/:id
  .delete(isAdminOrManager, deleteFoodItem); // DELETE /users/menu-items/foods/:id

// beverages routes
router
  .route("/beverages")
  .get(getAllBeverageItems) // GET /users/menu-items/beverages
  .post(isAdminOrManager, createBeverageItem); // POST /users/menu-items/beverages

router
  .route("/beverages/:id")
  .get(getOneBeverageItem) // GET /users/menu-items/beverages/:id
  .put(isAdminOrManager, updateBeverageItem) // PUT /users/menu-items/beverages/:id
  .delete(isAdminOrManager, deleteBeverageItem); // DELETE /users/menu-items/beverages/:id

// POST /users/menu-items/extras
router.post("/extras", addExtra);

// PUT /users/menu-items/stock/:type/:id
router.put("/stock/:type/:id", isAdminOrManager, updateItemStock);

export default router;
