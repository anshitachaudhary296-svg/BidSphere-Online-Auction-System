import { Notification } from "../models/Notification.js";
import { emailQueue } from "./queueService.js";
import { User } from "../models/userSchema.js";
import { Auction } from "../models/auctionSchema.js";
import { bidPlacedTemplate } from "../templates/bidPlacedTemplate.js";
import { outbidTemplate } from "../templates/outbidTemplate.js";
import { endingSoonTemplate } from "../templates/endingSoonTemplate.js";
import { winnerTemplate } from "../templates/winnerTemplate.js";
import { sellerFinishedTemplate } from "../templates/sellerFinishedTemplate.js";
import { auctionCreatedTemplate } from "../templates/auctionCreatedTemplate.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const notificationService = {
  async handleBidPlaced(auctionId, bidderId, amount) {
    try {
      const auction = await Auction.findById(auctionId);
      const seller = await User.findById(auction.createdBy);
      const bidder = await User.findById(bidderId);

      const subject = "New Bid Placed on Your Auction";
      const htmlContent = bidPlacedTemplate({
        productName: auction.title,
        currentBid: amount,
        bidderName: bidder.userName,
        endTime: auction.endTime,
        auctionLink: `${FRONTEND_URL}/auction/item/${auction._id}`
      });

      const notification = await Notification.create({
        recipient: seller._id,
        auctionItem: auction._id,
        type: "BID_PLACED",
        subject,
        message: "HTML Email Content"
      });

      emailQueue.addJob({
        notificationId: notification._id,
        email: seller.email,
        subject,
        htmlContent
      });
    } catch (error) {
      console.error("Error in handleBidPlaced notification:", error);
    }
  },

  async handleOutbid(auctionId, previousBidderId, previousBidAmount, newBidAmount) {
    try {
      const auction = await Auction.findById(auctionId);
      const previousBidder = await User.findById(previousBidderId);

      const subject = "You Have Been Outbid!";
      const htmlContent = outbidTemplate({
        productName: auction.title,
        previousBidAmount,
        newBidAmount,
        auctionLink: `${FRONTEND_URL}/auction/item/${auction._id}`
      });

      const notification = await Notification.create({
        recipient: previousBidder._id,
        auctionItem: auction._id,
        type: "OUTBID",
        subject,
        message: "HTML Email Content"
      });

      emailQueue.addJob({
        notificationId: notification._id,
        email: previousBidder.email,
        subject,
        htmlContent
      });
    } catch (error) {
      console.error("Error in handleOutbid notification:", error);
    }
  },

  async handleAuctionEndingSoon(auctionId) {
    try {
      const auction = await Auction.findById(auctionId);
      
      // Prevent duplicate ending soon emails for the same auction
      const existingNotification = await Notification.findOne({
        auctionItem: auction._id,
        type: "AUCTION_ENDING_SOON"
      });

      if (existingNotification) return;

      const seller = await User.findById(auction.createdBy);
      let highestBidder = null;
      
      // Find current highest bidder from auction.bids array
      if (auction.bids && auction.bids.length > 0) {
        const sortedBids = [...auction.bids].sort((a, b) => b.amount - a.amount);
        highestBidder = await User.findById(sortedBids[0].userId);
      }

      const subject = "Auction Ending in 5 Minutes!";
      const htmlContent = endingSoonTemplate({
        productName: auction.title,
        currentBid: auction.currentBid,
        remainingTime: "5 minutes",
        auctionLink: `${FRONTEND_URL}/auction/item/${auction._id}`
      });

      // Notify Seller
      const sellerNotif = await Notification.create({
        recipient: seller._id,
        auctionItem: auction._id,
        type: "AUCTION_ENDING_SOON",
        subject,
        message: "HTML Email Content"
      });
      emailQueue.addJob({
        notificationId: sellerNotif._id,
        email: seller.email,
        subject,
        htmlContent
      });

      // Notify Highest Bidder if exists
      if (highestBidder) {
        const bidderNotif = await Notification.create({
          recipient: highestBidder._id,
          auctionItem: auction._id,
          type: "AUCTION_ENDING_SOON",
          subject,
          message: "HTML Email Content"
        });
        emailQueue.addJob({
          notificationId: bidderNotif._id,
          email: highestBidder.email,
          subject,
          htmlContent
        });
      }

    } catch (error) {
      console.error("Error in handleAuctionEndingSoon notification:", error);
    }
  },

  async handleAuctionWon(auctionId, winnerId, commissionAmount) {
    try {
      const auction = await Auction.findById(auctionId);
      const winner = await User.findById(winnerId);
      const seller = await User.findById(auction.createdBy);

      const subject = "Congratulations! You Won the Auction";
      
      let paymentMethodsString = "";
      if (seller.paymentMethods) {
        const bt = seller.paymentMethods.bankTransfer;
        if (bt && (bt.bankAccountName || bt.bankAccountNumber || bt.bankName)) {
          paymentMethodsString += `1. Bank Transfer:\n- Name: ${bt.bankAccountName || "N/A"}\n- A/C No: ${bt.bankAccountNumber || "N/A"}\n- Bank: ${bt.bankName || "N/A"}\n\n`;
        }
        const ep = seller.paymentMethods.easypaisa;
        if (ep && ep.easypaisaAccountNumber) {
          paymentMethodsString += `2. Easypaisa:\n- A/C No: ${ep.easypaisaAccountNumber}\n\n`;
        }
        const pp = seller.paymentMethods.paypal;
        if (pp && pp.paypalEmail) {
          paymentMethodsString += `3. PayPal:\n- Email: ${pp.paypalEmail}\n\n`;
        }
      }

      const htmlContent = winnerTemplate({
        winnerName: winner.userName,
        productName: auction.title,
        winningAmount: auction.currentBid,
        sellerEmail: seller.email,
        sellerPaymentMethods: paymentMethodsString || "Please contact seller for payment methods."
      });

      const notification = await Notification.create({
        recipient: winner._id,
        auctionItem: auction._id,
        type: "AUCTION_WON",
        subject,
        message: "HTML Email Content"
      });

      emailQueue.addJob({
        notificationId: notification._id,
        email: winner.email,
        subject,
        htmlContent
      });
    } catch (error) {
      console.error("Error in handleAuctionWon notification:", error);
    }
  },

  async handleAuctionFinished(auctionId, winnerId, commissionAmount) {
    try {
      const auction = await Auction.findById(auctionId);
      const seller = await User.findById(auction.createdBy);
      
      let winnerName = "No bids placed";
      let winnerEmail = "N/A";
      
      if (winnerId) {
        const winner = await User.findById(winnerId);
        winnerName = winner.userName;
        winnerEmail = winner.email;
      }

      const subject = "Your Auction Has Successfully Ended";
      const htmlContent = sellerFinishedTemplate({
        productName: auction.title,
        finalSellingPrice: auction.currentBid,
        winnerName,
        winnerEmail,
        commissionAmount
      });

      const notification = await Notification.create({
        recipient: seller._id,
        auctionItem: auction._id,
        type: "AUCTION_FINISHED",
        subject,
        message: "HTML Email Content"
      });

      emailQueue.addJob({
        notificationId: notification._id,
        email: seller.email,
        subject,
        htmlContent
      });
    } catch (error) {
      console.error("Error in handleAuctionFinished notification:", error);
    }
  },

  async handleAuctionCreated(auctionId) {
    try {
      const auction = await Auction.findById(auctionId);
      const seller = await User.findById(auction.createdBy);

      const subject = "Your Auction Has Been Created Successfully";
      const htmlContent = auctionCreatedTemplate({
        productName: auction.title,
        startTime: auction.startTime,
        endTime: auction.endTime,
        startingBid: auction.startingBid,
        auctionLink: `${FRONTEND_URL}/auction/item/${auction._id}`
      });

      const notification = await Notification.create({
        recipient: seller._id,
        auctionItem: auction._id,
        type: "AUCTION_CREATED",
        subject,
        message: "HTML Email Content"
      });

      emailQueue.addJob({
        notificationId: notification._id,
        email: seller.email,
        subject,
        htmlContent
      });
    } catch (error) {
      console.error("Error in handleAuctionCreated notification:", error);
    }
  }
};
