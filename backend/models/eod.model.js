import { Schema, model } from "mongoose";

const eodModelSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  totalRevenue: { type: Number, default: 0 },
  cashRevenue: { type: Number, default: 0 },
  cardRevenue: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalFoodItems: { type: Number, default: 0 },
  totalBeverageItems: { type: Number, default: 0 },
  itemsSold: [{ itemName: String, quantity: Number }],
});

const EodModel = model("Eod", eodModelSchema);

export default EodModel;
