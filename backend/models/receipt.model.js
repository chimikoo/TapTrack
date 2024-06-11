import { Schema, model } from "mongoose";

const eodReceiptSchema = new Schema(
  {
    itemName: { type: String, required: true, default: "Unnamed Item" },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    extras: [
      {
        extraName: { type: String, required: true },
        extraPrice: { type: Number, required: true },
      },
    ],
  },
  { _id: false }
);

const receiptSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "order" }, // Reference to the order
  host: { type: String },
  totalAmount: { type: Number },
  tableNumber: { type: Number },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Credit Card", "Cash"],
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
