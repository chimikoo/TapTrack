import asyncHandler from "../config/asyncHandler.js";
import Receipt from "../models/receipt.model.js";
import calculateTotalAmount from "../utils/calculateTotalAmount.js";
import Order from "../models/order.model.js";

/* 
@desc    Get all receipts
@route   GET /receipts
@access  Private
*/
const getAllReceipts = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  // Populate the receipt and then populate the nested objects in the order
  const receipts = await Receipt.find().populate({
    path: "orderId",
    populate: {
      path: "userId drinks.drinkItem starter.dishItem main.dishItem side.dishItem dessert.dishItem",
    },
  });
  if (receipts.length === 0 || !receipts) {
    res.status(404);
    throw new Error("No receipts found");
  }
  res.status(200).json({ message: "All receipts", data: receipts });
});

/* 
@desc    Create a receipt
@route   POST /receipts
@access  Private
*/
const createReceipt = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const { orderId, paymentMethod, notes } = req.body;

  // Retrieve the order to get the items
  const order = await Order.findById(orderId).populate([
    "drinks.drinkItem",
    "starter.dishItem",
    "main.dishItem",
    "side.dishItem",
    "dessert.dishItem",
  ]);

  // Extract the items from the order
  const items = [];

  const addItem = (item, quantity, category, size) => {
    items.push({
      itemName: item.name,
      quantity: quantity,
      price: size
        ? item.sizesPrices.find((sizePrice) => sizePrice.size === size).price
        : item.price,
      category: category,
    });
  };

  order.drinks.forEach((drink) =>
    addItem(drink.drinkItem, drink.quantity, "beverage", drink.size)
  );
  order.starter.forEach((starter) =>
    addItem(starter.dishItem, starter.quantity, "starter")
  );
  order.main.forEach((main) => addItem(main.dishItem, main.quantity, "main"));
  order.side.forEach((side) => addItem(side.dishItem, side.quantity, "side"));
  order.dessert.forEach((dessert) =>
    addItem(dessert.dishItem, dessert.quantity, "dessert")
  );

  // Calculate total amount of the order
  const totalAmount = await calculateTotalAmount(orderId);

  // Create the receipt object with the populated items array
  const newReceipt = await Receipt.create({
    orderId,
    totalAmount,
    paymentMethod,
    notes,
    items,
  });

  res.status(201).json({ message: "Receipt created", receipt: newReceipt });
});

/* 
@desc    Get a receipt by ID
@route   GET /receipts/:id
@access  Private
*/
const getReceiptById = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const receipt = await Receipt.findById(req.params.id).populate({
    path: "orderId",
    populate: {
      path: "userId drinks.drinkItem starter.dishItem main.dishItem side.dishItem dessert.dishItem",
    },
  });
  if (!receipt) {
    res.status(404);
    throw new Error("Receipt not found");
  }
  res.status(200).json({ message: "Receipt found", data: receipt });
});

/* 
@desc    Update a receipt by ID
@route   PUT /receipts/:id
@access  Private
*/
const updateReceipt = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "waiter" && userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }
  const { id } = req.params;
  const { paymentMethod, notes, isPaid } = req.body;
  const receipt = await Receipt.findByIdAndUpdate(
    id,
    { paymentMethod, notes, isPaid },
    { new: true }
  );
  if (!receipt) {
    res.status(404);
    throw new Error("Receipt not found");
  }
  res.status(200).json({ message: "Receipt updated", data: receipt });
});

export { getAllReceipts, createReceipt, getReceiptById, updateReceipt };
