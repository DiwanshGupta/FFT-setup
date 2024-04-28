import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
require("dotenv").config();

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;
  // Path of email template file
  const templatePath = path.join(__dirname, "../mails", template);

  try {
    // Render Email template
    const html: string = await ejs.renderFile(templatePath, data);

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
