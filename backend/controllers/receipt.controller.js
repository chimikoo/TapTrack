import asyncHandler from "../config/asyncHandler.js";
import Receipt from "../models/receipt.model.js";
import calculateTotalAmount from "../utils/calculateTotalAmount.js";
import Order from "../models/order.model.js";
import extractItemsFromOrder from "../utils/extractItemsFromOrder.js";
import Table from "../models/table.model.js";

/* 
@desc    Get all receipts
@route   GET /users/checkout
@access  Private
*/
const getAllReceipts = asyncHandler(async (req, res) => {
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
  res.status(200).json({
    message: "All receipts",
    numberOfReceipts: receipts.length,
    data: receipts,
  });
});

/* 
@desc    Create a receipt
@route   POST /users/checkout
@access  Private
*/
const createReceipt = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod, notes } = req.body;
  if (!orderId) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }
  // Retrieve the order to get the items
  const order = await Order.findById(orderId).populate([
    "drinks.drinkItem",
    "starter.dishItem",
    "main.dishItem",
    "side.dishItem",
    "dessert.dishItem",
  ]);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  // Extract the items from the order
  const items = extractItemsFromOrder(order);

  // Calculate total amount of the order
  const totalAmount = await calculateTotalAmount(order);

  // Retrieve the associated table
  const table = await Table.findOne({ orderId });
  if (!table) {
    res.status(404);
    throw new Error("Table not found");
  }

  // Update table state to available and remove orderId
  table.state = "available";
  table.orderId = null;
  table.userId = null;
  await table.save();

  // Update the order to be checked out
  order.isCheckout = true;
  await order.save();

  // Create the receipt object with the populated items array
  const newReceipt = await Receipt.create({
    orderId,
    totalAmount,
    paymentMethod,
    notes,
    items,
    tableNumber: table.tableNumber,
  });

  // console.log("Receipt created", newReceipt);

  res.status(201).json({ message: "Receipt created", receipt: newReceipt });
});

/* 
@desc    Get a receipt by ID
@route   GET /users/checkout/:id
@access  Private
*/
const getReceiptById = asyncHandler(async (req, res) => {
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
@desc    Get a receipt by user ID
@route   GET /users/checkout/user/:id
@access  Private
*/
const getReceiptByUserId = asyncHandler(async (req, res) => {
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
  // Filter receipts based on the user ID
  const userReceipts = receipts.filter((receipt) => {
    const userId = receipt.orderId?.userId?._id.toString();
    return userId === req.params.id;
  });

  if (userReceipts.length === 0) {
    res.status(404);
    throw new Error("No receipts found for this user");
  }

  res.status(200).json({
    message: "All receipts",
    numberOfReceipts: userReceipts.length,
    data: userReceipts,
  });
});

/* 
@desc    Update a receipt by ID
@route   PUT /users/checkout/:id
@access  Private
*/
const updateReceipt = asyncHandler(async (req, res) => {
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

export {
  getAllReceipts,
  createReceipt,
  getReceiptById,
  getReceiptByUserId,
  updateReceipt,
};
