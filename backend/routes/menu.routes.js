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
  updateItemStock
} from "../controllers/menu.controllers.js";

const router = Router();

// GET /users/menu-items
router.get("/", getAllMenuItems);

// foods routes
router
  .route("/foods")
  .get(getAllFoodItems) // GET /users/menu-items/foods
  .post(createFoodItem); // POST /users/menu-items/foods
  
router
  .route("/foods/:id")
  .get(getOneFoodItem) // GET /users/menu-items/foods/:id
  .put(updateFoodItem) // PUT /users/menu-items/foods/:id
  .delete(deleteFoodItem); // DELETE /users/menu-items/foods/:id

// beverages routes
router
  .route("/beverages")
  .get(getAllBeverageItems) // GET /users/menu-items/beverages
  .post(createBeverageItem); // POST /users/menu-items/beverages

router
  .route("/beverages/:id")
  .get(getOneBeverageItem) // GET /users/menu-items/beverages/:id
  .put(updateBeverageItem) // PUT /users/menu-items/beverages/:id
  .delete(deleteBeverageItem); // DELETE /users/menu-items/beverages/:id


// POST /users/menu-items/extras
router.post("/extras", addExtra);

// PUT /users/menu-items/:type/:id/stock
router.put("/:type/:id/stock", updateItemStock);

export default router;
