import mongoose from "mongoose";

export const connection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MERN_AUCTION_PLATFORM", {
      dbName: "MERN_AUCTION_PLATFORM",
    });

    console.log("✅ Connected to database.");
  } catch (error) {
    console.log("❌ Database connection failed:");
    console.log(error.message);
  }
};
