import EventEmitter from "events";
import { notificationService } from "../services/notificationService.js";

export const notificationEmitter = new EventEmitter();

// Listeners
notificationEmitter.on("bidPlaced", async ({ auctionId, bidderId, amount }) => {
  await notificationService.handleBidPlaced(auctionId, bidderId, amount);
});

notificationEmitter.on("outbid", async ({ auctionId, previousBidderId, previousBidAmount, newBidAmount }) => {
  await notificationService.handleOutbid(auctionId, previousBidderId, previousBidAmount, newBidAmount);
});

notificationEmitter.on("auctionEndingSoon", async ({ auctionId }) => {
  await notificationService.handleAuctionEndingSoon(auctionId);
});

notificationEmitter.on("auctionWon", async ({ auctionId, winnerId, commissionAmount }) => {
  await notificationService.handleAuctionWon(auctionId, winnerId, commissionAmount);
});

notificationEmitter.on("auctionFinished", async ({ auctionId, winnerId, commissionAmount }) => {
  await notificationService.handleAuctionFinished(auctionId, winnerId, commissionAmount);
});

notificationEmitter.on("auctionCreated", async ({ auctionId }) => {
  await notificationService.handleAuctionCreated(auctionId);
});
