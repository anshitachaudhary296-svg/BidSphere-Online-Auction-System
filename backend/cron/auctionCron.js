import cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";
import { notificationEmitter } from "../events/notificationEmitter.js";

export const startAuctionCronJobs = () => {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

      // Find auctions ending within the next 5 minutes
      const endingSoonAuctions = await Auction.find({
        endTime: {
          $gt: now,
          $lte: fiveMinutesFromNow
        }
      });

      for (const auction of endingSoonAuctions) {
        notificationEmitter.emit("auctionEndingSoon", { auctionId: auction._id });
      }
    } catch (error) {
      console.error("Error in 5-min warning cron job:", error);
    }
  });
};
