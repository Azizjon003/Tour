const nodemailer = require("nodemailer");
const pug = require("pug");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
class Mail {
  constructor(user, url) {
    this.to = user.email;
    this.from = process.env.EMAIL_FROM;
    this.url = url;
    this.name = user.name;
  }
  // 1; // transporter created
  //1
  transporter() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }

  // 2 email option
  async sentMessage(template, message) {
    // template rendering
    const pugTemplate = `${__dirname}/../views/email/${template}.pug`;
    const html = pug.renderFile(pugTemplate, {
      name: this.name,
      url: this.url,
      title: message,
    });
    //messageni kimga yuborish

    const optionsMail = {
      from: "Aliqulov Azizjon <aliqulovazizjon68@gmail.com>",
      to: this.to,
      subject: message,
      html: html,
    };
    await this.transporter().sendMail(optionsMail);
  }

  // transportni yaratib uni yuborish

  // 3 send message
  sentWelcome() {
    this.sentMessage("welcomeM", "Welcome to the Tour App");
  }
  sentResetPassword() {
    this.sentMessage("reset-password", "Reset your password");
  }
}
// const mail = async (options) =>
// 11? transporter yaratish kerak

module.exports = Mail;
