import asyncHandler from "../config/asyncHandler.js";
import Receipt, { OldReceipt } from "../models/receipt.model.js";
import EodModel from "../models/eod.model.js";
import Order from "../models/order.model.js";

/* 
@desc   Calculate and generate End of Day report
@route  POST /eod/generate
@access Private (Only accessible to admin or manager)
*/
const generateEodReport = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "admin" && userRole !== "manager") {
    res.status(403);
    throw new Error("Not authorized!");
  }

  // Retrieve all paid receipts
  const receipts = await Receipt.find({}).populate("orderId");

  // Initialize variables to calculate EoD report
  let totalRevenue = 0;
  let cashRevenue = 0;
  let cardRevenue = 0;
  let totalOrders = 0;
  let totalLoss = 0;
  let totalOrdersNotPaid = 0;
  let totalFoodItems = 0;
  let totalBeverageItems = 0;
  const itemsSoldMap = new Map();

  // Iterate over each paid receipt to calculate EoD report
  receipts.forEach((receipt) => {
    totalOrders++;
    if (!receipt.isPaid) {
      totalLoss += receipt.totalAmount;
      totalOrdersNotPaid++;
    } else {
      totalRevenue += receipt.totalAmount;
    }
    if (receipt.paymentMethod === "Cash" && receipt.isPaid) {
      cashRevenue += receipt.totalAmount;
    } else if (receipt.paymentMethod === "Credit card" && receipt.isPaid) {
      cardRevenue += receipt.totalAmount;
    }

    // Iterate over each item in the receipt to update items sold map
    receipt.items.forEach((item) => {
      updateItemsSoldMap(itemsSoldMap, item);
      if (item.category === "beverage") {
        totalBeverageItems++;
      } else {
        totalFoodItems++;
      }
    });
  });

  // Convert itemsSoldMap to array of objects
  const itemsSold = [...itemsSoldMap.entries()].map(([itemName, quantity]) => ({
    itemName,
    quantity,
  }));

  // Create EoD report document
  const eodReport = await EodModel.create({
    totalOrders,
    totalFoodItems,
    totalBeverageItems,
    totalLoss,
    totalOrdersNotPaid,
    itemsSold,
    cashRevenue,
    cardRevenue,
    totalRevenue,
  });

  // Reset all of Receipt/Orders
  await OldReceipt.insertMany(receipts);
  await Receipt.deleteMany({});
  await Order.deleteMany({});

  res
    .status(200)
    .json({ message: "End of Day report generated", data: eodReport });
});

// Helper function to update itemsSoldMap
function updateItemsSoldMap(itemsSoldMap, item) {
  const { itemName, quantity } = item;
  if (itemsSoldMap.has(itemName)) {
    itemsSoldMap.set(itemName, itemsSoldMap.get(itemName) + quantity);
  } else {
    itemsSoldMap.set(itemName, quantity);
  }
}

const viewEodReport = asyncHandler(async (req, res) => {
  const eodReports = await EodModel.find();
  res.status(200).json({ message: "All EoD reports", data: eodReports });
});

export { generateEodReport, viewEodReport };
