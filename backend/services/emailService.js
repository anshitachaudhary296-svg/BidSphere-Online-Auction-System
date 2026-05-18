import nodeMailer from "nodemailer";

export const sendHtmlEmail = async ({ email, subject, htmlContent }) => {
  const smtpPort = parseInt(process.env.SMTP_PORT, 10) || 465;
  console.log(`[EmailService] Attempting to send email to: ${email}, subject: ${subject}`);
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    service: process.env.SMTP_SERVICE,
    secure: smtpPort === 465,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
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
