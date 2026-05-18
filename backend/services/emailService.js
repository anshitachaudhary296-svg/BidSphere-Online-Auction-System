import nodeMailer from "nodemailer";

export const sendHtmlEmail = async ({ email, subject, htmlContent }) => {
  console.log(`[EmailService] Attempting to send email to: ${email}, subject: ${subject}`);
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const options = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject,
    html: htmlContent,
  };

  await transporter.sendMail(options);
  console.log(`[EmailService] Email sent successfully to: ${email}`);
};
