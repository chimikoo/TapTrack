import asyncHandler from "../config/asyncHandler.js";
import Order from "../models/order.model.js";
import Receipt from "../models/receipt.model.js";

const calculateTotalAmount = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate(
      "drinks starter.dishItem main.dishItem side.dishItem dessert.dishItem"
    );

    // console.log(order);
    const calculateFoodSubtotal = (foodItem) => {
      return foodItem.quantity * foodItem.dishItem.price;
    };

    const calculateBeverageSubtotal = (beverage) => {
      return beverage.sizesPrices[0].price;
    };

    const foodSubtotals = order.starter
      .concat(order.main, order.side, order.dessert)
      .map((foodItem) => calculateFoodSubtotal(foodItem));
    const beverageSubtotals = order.drinks.map((beverage) =>
      calculateBeverageSubtotal(beverage)
    );
    console.log(beverageSubtotals);

    const totalAmount =
      foodSubtotals.reduce((acc, curr) => acc + curr, 0) +
      beverageSubtotals.reduce((acc, curr) => acc + curr, 0);

    return totalAmount;
  } catch (error) {
    console.log(error);
  }
};

/* 
@desc    Get all receipts
@route   GET /receipts
@access  Private
*/
const getAllReceipts = asyncHandler(async (req, res) => {});

/* 
@desc    Create a receipt
@route   POST /receipts
@access  Private
*/
const createReceipt = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod, notes } = req.body;
  const totalAmount = await calculateTotalAmount(orderId);
  console.log("totalAmount", totalAmount);
  const newReceipt = await Receipt.create({
    orderId,
    totalAmount,
    paymentMethod,
    notes,
  });
  res.status(201).json({ message: "Receipt created", receipt: newReceipt });
});

export { getAllReceipts, createReceipt };
