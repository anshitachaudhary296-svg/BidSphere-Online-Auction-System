import { emailLayout } from "./layout.js";

export const bidPlacedTemplate = ({ productName, currentBid, bidderName, endTime, auctionLink }) => {
  const content = `
    <h2>Hello,</h2>
    <p>Great news! A new bid has been placed on your auction: <span class="highlight">${productName}</span>.</p>
    
    <div class="details-box">
      <p><strong>Bidder:</strong> ${bidderName}</p>
      <p><strong>Current Highest Bid:</strong> Rs. ${currentBid}</p>
      <p><strong>Auction Ends At:</strong> ${new Date(endTime).toLocaleString()}</p>
    </div>

    <p>You can view your auction and its current status by clicking the button below:</p>
    
    <center>
      <a href="${auctionLink}" class="btn">View Auction</a>
    </center>
  `;
  return emailLayout(content);
};
