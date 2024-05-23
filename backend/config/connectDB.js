import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const { MONGODB_URI } = process.env;

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.yellow.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;
