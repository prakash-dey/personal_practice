import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in the environment variables");
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
        console.error("MongoDB Connection Error:", error.message);
    } else {
        console.error("An unknown error occurred");
    }
    process.exit(1);
  }
};

export default connectDB;