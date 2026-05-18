import mongoose from "mongoose";

export const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MERN_AUCTION_PLATFORM",
    });

    console.log("✅ Connected to database.");
  } catch (error) {
    console.log("❌ Database connection failed:");
    console.log(error.message);
  }
};
