import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config({
  path: "./.env",
});

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    app.on("error", (error) => {
      console.log("Error starting server:", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
