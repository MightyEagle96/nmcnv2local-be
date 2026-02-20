import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
let DATABASE = process.env.DATABASE || "";

export const ConnectDatabase = () => {
  mongoose
    .connect(DATABASE, {
      connectTimeoutMS: 60000,
      serverSelectionTimeoutMS: 60000,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((e) => {
      console.log(e);
      console.log("DB could not connect at this time. Shutting down");
      process.exit(1);
    });
};
