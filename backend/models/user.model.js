import { model, Schema } from "mongoose";

const userModelSchema = new Schema({
  username: { 
    type: String, 
    required: true 
},
  password: { 
    type: String, 
    required: true 
},
  name: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    required: true 
},
  role: { 
    type: String, 
    enum: ["waiter", "manager", "admin"], 
    default: "user" 
},
});

const UserModel = model("UserModel", userModelSchema);

export default UserModel;
