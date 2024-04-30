import { Schema, model } from "mongoose";

const eodModelSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  totalRevenue: { type: Number, default: 0 },
  cashRevenue: { type: Number, default: 0 },
  cardRevenue: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalOrdersNotPaid: { type: Number, default: 0 },
  totalLoss: { type: Number, default: 0 },
  totalFoodItems: { type: Number, default: 0 },
  totalBeverageItems: { type: Number, default: 0 },
  itemsSold: [{ itemName: String, quantity: Number }],
  day: { type: Number, required: true, default: new Date().getDate() },
});

const EodModel = model("Eod", eodModelSchema);

export default EodModel;
