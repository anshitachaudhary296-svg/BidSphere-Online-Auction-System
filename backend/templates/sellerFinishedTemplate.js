import { emailLayout } from "./layout.js";

export const sellerFinishedTemplate = ({ productName, finalSellingPrice, winnerName, winnerEmail, commissionAmount }) => {
  const content = `
    <h2>Your Auction Has Ended Successfully!</h2>
    <p>Your auction for <span class="highlight">${productName}</span> has completed.</p>
    
    <div class="details-box">
      <p><strong>Final Selling Price:</strong> Rs. ${finalSellingPrice}</p>
      <p><strong>Winning Bidder:</strong> ${winnerName}</p>
      <p><strong>Winner's Contact:</strong> ${winnerEmail}</p>
      <p><strong>Platform Commission Added:</strong> Rs. ${commissionAmount}</p>
    </div>

    <p>The winning bidder has been sent an email with your contact and payment details. Please await their communication or reach out to them directly to arrange the final transaction and delivery.</p>
    <p>Thank you for using BidSphere!</p>
  `;
  return emailLayout(content);
};
