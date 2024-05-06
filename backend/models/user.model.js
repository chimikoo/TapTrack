import { model, Schema } from "mongoose";

const userModelSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["waiter", "manager", "admin"],
    default: "waiter",
  },
  avatar: {
    type: String,
    default: "cat.png",
  },
});

const UserModel = model("user", userModelSchema);

export default UserModel;
