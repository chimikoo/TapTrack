import { Schema, model } from "mongoose";
import Order from "./order.model.js";

// Define sub-schema for nested objects
const receiptSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "order", required: true }, // Reference to the order
  totalAmount: { type: Number },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Credit card", "Cash"],
  },
  transactionDate: { type: Date, default: Date.now },
  notes: { type: String, default: "" },
  isPaid: { type: Boolean, default: false },
});

// Calculate totalAmount before saving the receipt document
/* receiptSchema.post("save", async function () {
  try {
    const order = await Order.findById(this.orderId).populate(
      "drinks starter.dishItem main.dishItem side.dishItem dessert.dishItem"
    );

    const calculateFoodSubtotal = (foodItem) => {
      return foodItem.quantity * foodItem.dishItem.price;
    };

    const calculateBeverageSubtotal = (beverage) => {
      return beverage.price;
    };

    const foodSubtotals = order.starter
      .concat(order.main, order.side, order.dessert)
      .map((foodItem) => calculateFoodSubtotal(foodItem));

    const beverageSubtotals = order.drinks.map((beverage) =>
      calculateBeverageSubtotal(beverage)
    );

    const totalAmount =
      foodSubtotals.reduce((acc, curr) => acc + curr, 0) +
      beverageSubtotals.reduce((acc, curr) => acc + curr, 0);

    // Set the calculated totalAmount
    this.totalAmount = totalAmount;


  } catch (error) {
    console.log(error);
  }
});
 */
const Receipt = model("Receipt", receiptSchema);

export default Receipt;
