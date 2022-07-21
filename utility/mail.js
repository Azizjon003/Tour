const nodemailer = require("nodemailer");

const mail = async (options) => {
  // 11? transporter yaratish kerak
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  const optionsMail = {
    from: "Aliqulov Azizjon <aliqulovazizjon68@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(optionsMail);
};

module.exports = mail;
