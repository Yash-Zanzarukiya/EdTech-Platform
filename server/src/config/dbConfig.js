import mongoose from "mongoose";
import { DB_NAME, MONGO_URL } from "./serverConfig.js";

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(`${MONGO_URL}/${DB_NAME}`);
    console.log(`Database Connected!! DB Host : ${connectionInstance?.connection.host}`);
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
}

export default connectDB;
