import { Schema, model } from "mongoose";

const eodReceiptSchema = new Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
});

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
  items: [eodReceiptSchema], // Reference to items from the order
});



const Receipt = model("Receipt", receiptSchema);
const OldReceipt = model("OldReceipt", receiptSchema);

export default Receipt;
export { OldReceipt };