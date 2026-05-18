import { sendHtmlEmail } from "./emailService.js";
import { Notification } from "../models/Notification.js";

class EmailQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  // data = { notificationId, email, subject, htmlContent }
  async addJob(data) {
    this.queue.push(data);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift(); // Get the first job
      let retries = 3;
      let success = false;

      while (retries > 0 && !success) {
        try {
          await sendHtmlEmail({
            email: job.email,
            subject: job.subject,
            htmlContent: job.htmlContent,
          });
          success = true;
          
          // Update DB Status
          if (job.notificationId) {
            await Notification.findByIdAndUpdate(job.notificationId, { status: "SENT" });
          }
          console.log(`Email sent successfully to ${job.email}`);
        } catch (error) {
          retries--;
          console.error(`Failed to send email to ${job.email}. Retries left: ${retries}. Error: ${error.message}`);
          if (retries === 0) {
            // Update DB Status to Failed
            if (job.notificationId) {
              await Notification.findByIdAndUpdate(job.notificationId, { 
                status: "FAILED",
                errorLog: error.message 
              });
            }
          } else {
            // Wait 2 seconds before retry
            await new Promise((res) => setTimeout(res, 2000));
          }
        }
      }
    }

    this.isProcessing = false;
  }
}

export const emailQueue = new EmailQueue();
