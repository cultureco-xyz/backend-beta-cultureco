import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("🟢 MongoDB connected successfully 🟢");
    } catch (error) {
      console.error("❌ MongoDB connection failed: ❌", error);
      process.exit(1); // Exit process with failure
    }
  } else {
    console.error("❌ MongoDB URL not found ❌");
    process.exit(1); // Exit process with failure
  }
};
