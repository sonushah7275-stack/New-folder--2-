import mongoose from "mongoose";
import dns from "dns";

/**
 * Connects to MongoDB database using Mongoose.
 * Configures Google Public DNS for reliable SRV record resolution across all environments.
 */
const connectDB = async () => {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);

    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoURI) {
      console.warn("⚠️ MONGODB_URI is not defined in environment variables.");
      return false;
    }

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
