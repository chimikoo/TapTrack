// 1. EOD Schema with the following fields:
// - timestamp: Date
// - sales: Number
// - cash: Number
// - card: Number
// - totalOrders: Number
// - totalItems: Number
// - totalFoodItems: Number
// - totalBeverageItems: Number
// - totalFoodRevenue: Number
// - totalBeverageRevenue: Number
// - totalRevenue: Number
// - totalLoss: Number
// - totalProfit: Number

import { Schema, model } from "mongoose";

const eodModelSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  sales: { type: Number, required: true },
  cash: { type: Number, required: true },
  card: { type: Number, required: true },
  totalOrders: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  totalFoodItems: { type: Number, required: true },
  totalBeverageItems: { type: Number, required: true },
  totalFoodRevenue: { type: Number, required: true },
  totalBeverageRevenue: { type: Number, required: true },
  totalRevenue: { type: Number, required: true },
  totalLoss: { type: Number, required: true },
  totalProfit: { type: Number, required: true },
});

const EodModel = model("eod", eodModelSchema);

export default EodModel;
