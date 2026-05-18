import { emailLayout } from "./layout.js";

export const auctionCreatedTemplate = ({ productName, startTime, endTime, startingBid, auctionLink }) => {
  const content = `
    <h2>Your Auction is Live!</h2>
    <p>Congratulations! Your auction for <span class="highlight">${productName}</span> has been created successfully.</p>
    
    <div class="details-box">
      <p><strong>Starting Bid:</strong> Rs. ${startingBid}</p>
      <p><strong>Starts At:</strong> ${new Date(startTime).toLocaleString()}</p>
      <p><strong>Ends At:</strong> ${new Date(endTime).toLocaleString()}</p>
    </div>

    <p>Share your auction link to attract more bidders!</p>
    
    <center>
      <a href="${auctionLink}" class="btn">View Your Auction</a>
    </center>
  `;
  return emailLayout(content);
};
