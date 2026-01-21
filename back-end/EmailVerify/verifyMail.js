import nodemailer from "nodemailer";
import handlebars from "handlebars";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const verifyMail = async (token, mail) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  try {
    // Read the Handlebars template file synchronously
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, "template.hbs"),
      "utf-8"
    );

    // Compile the template
    const template = handlebars.compile(emailTemplateSource);

    // Execute the template with data, ensuring the token is URL-safe
    const htmlToSend = template({
      token: encodeURIComponent(token),
    });

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mail, // recipient’s email
      subject: "Verify your email",
      text: `Click the link to verify your email:`,
      html: htmlToSend,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default verifyMail;
