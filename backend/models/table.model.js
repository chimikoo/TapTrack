import { Schema, model } from "mongoose";

const tableSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  tableNumber: { type: Number, required: true },
  orderId: { type: Schema.Types.ObjectId, ref: "order" },
  state: { type: String, enum: ['occupied', 'reserved', 'available'], default: 'available' }
});

const Table = model("table", tableSchema);

export default Table;