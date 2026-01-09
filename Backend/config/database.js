import mongoose from "mongoose";

const connectDB = async () => {
  console.log("Database connection attempt...");
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error Message:", error.message);
    if (error.reason) console.error("Reason:", error.reason);
    process.exit(1);
  }
};

export { connectDB };
export default connectDB;
