import { Schema, model } from "mongoose";

const extraSchema = new Schema({
    extra: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const ExtraModel = model("extra", extraSchema);

export default ExtraModel;