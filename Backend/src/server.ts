import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

import app from "./app";

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DATABASE!);
    console.log("DB connected successfully");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
};

startServer();
