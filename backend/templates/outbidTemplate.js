import { emailLayout } from "./layout.js";

export const outbidTemplate = ({ productName, previousBidAmount, newBidAmount, auctionLink }) => {
  const content = `
    <h2>Hello,</h2>
    <p>We are writing to let you know that you have been outbid on <span class="highlight">${productName}</span>.</p>
    
    <div class="details-box">
      <p><strong>Your Previous Bid:</strong> Rs. ${previousBidAmount}</p>
      <p><strong>New Highest Bid:</strong> Rs. ${newBidAmount}</p>
    </div>

    <p>Don't miss out! There is still time to win this item. Click the button below to place a new bid:</p>
    
    <center>
      <a href="${auctionLink}" class="btn">Place Another Bid</a>
    </center>
  `;
  return emailLayout(content);
};
