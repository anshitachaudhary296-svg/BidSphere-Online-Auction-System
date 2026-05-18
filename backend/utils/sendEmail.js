import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  const smtpPort = parseInt(process.env.SMTP_PORT, 10) || 465;
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
    text: message,
  };
  await transporter.sendMail(options);
};
