import asyncHandler from "../config/asyncHandler.js";
import FoodModel from "../models/food.model.js";
import BeverageModel from "../models/beverage.model.js";
import ExtraModel from "../models/extra.model.js";

/* 
@desc   Get all menu items
@route  GET /users/menu-items
@access Public
*/
const getAllMenuItems = asyncHandler(async (req, res) => {
  const foods = await FoodModel.find();
  if (!foods) {
    res.status(404);
    throw new Error("No food items found");
  }
  const beverages = await BeverageModel.find();
  if (!beverages) {
    res.status(404);
    throw new Error("No beverage items found");
  }

  res.status(200).json({
    message: "All menu items",
    numberItems: foods.length + beverages.length,
    data: { foods, beverages },
  });
});

/* 
@desc   Get all food items
@route  GET /users/menu-items/foods
@access Public
*/
const getAllFoodItems = asyncHandler(async (req, res) => {
  let foodQuery = FoodModel.find();
  // Filtering food items
  if (req.query.category) {
    foodQuery = foodQuery.where("category").equals(req.query.category);
  }
  if (req.query.name) {
    foodQuery = foodQuery.where("name").regex(new RegExp(req.query.name, "i"));
  }
  if (req.query.price) {
    foodQuery = foodQuery.where("price").lt(req.query.price);
  }

  // Sorting
  if (req.query.sort) {
    foodQuery = foodQuery.sort(req.query.sort);
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100; // Increase the limit to ensure all items are fetched
  const startIndex = (page - 1) * limit;
  foodQuery = foodQuery.limit(limit).skip(startIndex);

  const foods = await foodQuery;
  if (!foods) {
    res.status(404);
    throw new Error("No food items found");
  }
  const totalPages = Math.ceil((await FoodModel.countDocuments()) / limit);
  const totalItems = await FoodModel.countDocuments();

  res.status(200).json({
    message: "All food items",
    totalItems,
    itemsPerPage: limit,
    currentPage: page,
    totalPages,
    numberItems: foods.length,
    data: foods,
  });
});

/* 
@desc   Get all beverage items
@route  GET /users/menu-items/beverages
@access Public
*/
const getAllBeverageItems = asyncHandler(async (req, res) => {
  let beverageQuery = BeverageModel.find();
  // Filtering beverage items
  if (req.query.name) {
    beverageQuery = beverageQuery
      .where("name")
      .regex(new RegExp(req.query.name, "i"));
  }
  if (req.query.type) {
    beverageQuery = beverageQuery.where("type").equals(req.query.type);
  }
  if (req.query.price) {
    beverageQuery = beverageQuery
      .where("sizesPrices.price")
      .lt(req.query.price);
  }
  if (req.query.size) {
    beverageQuery = beverageQuery
      .where("sizesPrices.size")
      .equals(req.query.size);
  }

  // Sorting
  if (req.query.sort) {
    beverageQuery = beverageQuery.sort(req.query.sort);
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  beverageQuery = beverageQuery.limit(limit).skip(startIndex);

  const beverages = await beverageQuery;
  if (!beverages) {
    res.status(404);
    throw new Error("No beverage items found");
  }
  const totalPages = Math.ceil((await BeverageModel.countDocuments()) / limit);
  const totalItems = await BeverageModel.countDocuments();

  res.status(200).json({
    message: "All beverage items",
    totalItems,
    itemsPerPage: limit,
    currentPage: page,
    totalPages,
    numberItems: beverages.length,
    data: beverages,
  });
});

/* 
@desc   Get one food item
@route  GET /users/menu-items/foods/:id
@access Public
*/
const getOneFoodItem = asyncHandler(async (req, res) => {
  const food = await FoodModel.findById(req.params.id);
  if (!food) {
    res.status(404);
    throw new Error("Food item not found");
  }
  res.status(200).json({ message: "Food item", data: food });
});

/* 
@desc   Get one beverage item
@route  GET /users/menu-items/beverages/:id
@access Public
*/
const getOneBeverageItem = asyncHandler(async (req, res) => {
  const beverage = await BeverageModel.findById(req.params.id);
  if (!beverage) {
    res.status(404);
    throw new Error("Beverage item not found");
  }
  res.status(200).json({ message: "Beverage item", data: beverage });
});

/* 
@desc   Create a food item
@route  POST /users/menu-items/foods
@access Private
*/
const createFoodItem = asyncHandler(async (req, res) => {
  const { name, price, description, category } = req.body;
  if (!name || !price || !description || !category) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }
  const newFoodItem = await FoodModel.create({
    name,
    price,
    description,
    category,
  });
  res.status(201).json({ message: "Food item created", data: newFoodItem });
});

/* 
@desc   Create a beverage item
@route  POST /users/menu-items/beverages
@access Private
*/
const createBeverageItem = asyncHandler(async (req, res) => {
  const { name, description, category, type, sizesPrices } = req.body;
  if (!name || !description || !category || !type || !sizesPrices) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }
  const newBeverageItem = await BeverageModel.create({
    name,
    description,
    category,
    type,
    sizesPrices,
  });
  res
    .status(201)
    .json({ message: "Beverage item created", data: newBeverageItem });
});

/* 
@desc   Update a food item
@route  PUT /users/menu-items/foods/:id
@access Private
*/
const updateFoodItem = asyncHandler(async (req, res) => {
  const { name, price, description, category } = req.body;
  const updatedFoodItem = await FoodModel.findByIdAndUpdate(
    req.params.id,
    { name, price, description, category },
    { new: true }
  );
  if (!updatedFoodItem) {
    res.status(404);
    throw new Error("Food item not found");
  }

  res.status(200).json({ message: "Food item updated", data: updatedFoodItem });
});

/* 
@desc   Update a beverage item
@route  PUT /users/menu-items/beverages/:id
@access Private
*/
const updateBeverageItem = asyncHandler(async (req, res) => {
  const { name, description, category, type, sizesPrices } = req.body;
  const updatedBeverageItem = await BeverageModel.findByIdAndUpdate(
    req.params.id,
    { name, description, category, type, sizesPrices },
    { new: true }
  );
  if (!updatedBeverageItem) {
    res.status(404);
    throw new Error("Beverage item not found");
  }

  res
    .status(200)
    .json({ message: "Beverage item updated", data: updatedBeverageItem });
});

/* 
@desc   Delete a food item
@route  DELETE /users/menu-items/foods/:id
@access Private
*/
const deleteFoodItem = asyncHandler(async (req, res) => {
  await FoodModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Food item deleted" });
});

/* 
@desc   Delete a beverage item
@route  DELETE /users/menu-items/beverages/:id
@access Private
*/
const deleteBeverageItem = asyncHandler(async (req, res) => {
  await BeverageModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Beverage item deleted" });
});

/* 
@desc   ADD extras
@route  POST /users/menu-items/extras
@access Private
*/
const addExtra = asyncHandler(async (req, res) => {
  const { extra, price, itemId, itemType, tableNumber } = req.body;
  if (!extra || !price) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }
  const newExtra = await ExtraModel.create({
    extra,
    price,
    itemId,
    itemType,
    tableNumber,
  });
  res.status(201).json({ message: "Extra added", data: newExtra });
});

/* 
@desc   Get extras by item id
@route  GET /users/menu-items/extras/table/:tableNumber
@access Private
*/
const getExtrasByTable = asyncHandler(async (req, res) => {
  const extras = await ExtraModel.find({ tableNumber: req.params.tableNumber });
  if (!extras) {
    res.status(404);
    throw new Error("No extras found");
  }
  res.status(200).json({
    message: "Extras",
    numberExtras: extras.length,
    data: extras,
  });
});

/* 
@desc   Get extra by id
@route  GET /users/menu-items/extras/:id
@access Private
*/
const getExtraById = asyncHandler(async (req, res) => {
  const extra = await ExtraModel.findById(req.params.id);
  if (!extra) {
    res.status(404);
    throw new Error("Extra not found");
  }
  res.status(200).json({ extra });
});

/* 
@desc   Delete extras by table
@route  DELETE /users/menu-items/extras/table/:tableNumber
@access Private
*/
const deleteExtrasByTable = asyncHandler(async (req, res) => {
  await ExtraModel.deleteMany({ tableNumber: req.params.tableNumber });
  res.status(200).json({ message: "Extras deleted" });
});

/* 
@desc   Update item stock
@route  PUT /users/menu-items/stock/:type/:id
@access Private
*/
const updateItemStock = asyncHandler(async (req, res) => {
  const { id, type } = req.params;
  const { stock } = req.body;

  // Check if the type is for updating food or beverage item
  let updatedItem;
  if (type === "foods") {
    updatedItem = await FoodModel.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    );
  } else if (type === "beverages") {
    updatedItem = await BeverageModel.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    );
  }

  if (!updatedItem) {
    res.status(404);
    throw new Error("Item not found");
  }

  res.status(200).json({ message: "Item stock updated", data: updatedItem });
});

export {
  getAllMenuItems,
  getAllFoodItems,
  getAllBeverageItems,
  getOneFoodItem,
  getOneBeverageItem,
  createFoodItem,
  createBeverageItem,
  updateFoodItem,
  updateBeverageItem,
  deleteFoodItem,
  deleteBeverageItem,
  addExtra,
  getExtrasByTable,
  getExtraById,
  deleteExtrasByTable,
  updateItemStock,
};
