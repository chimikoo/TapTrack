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

const ExtraModel = model("extra", extraSchema);

export default ExtraModel;
