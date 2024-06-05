import { Schema, model } from "mongoose";

const extraSchema = new Schema(
  {
    extra: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "itemType",
    },
    itemType: {
      type: String,
      required: true,
      enum: ["food", "beverage"],
    },
    tableNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const oldExtraSchema = new Schema({
  oldExtra: { type: extraSchema, _id: false },
  extraId: { type: Schema.Types.ObjectId, required: true },
});

const ExtraModel = model("extra", extraSchema);
const OldExtraModel = model("oldextra", oldExtraSchema);

export default ExtraModel;
export { OldExtraModel };
