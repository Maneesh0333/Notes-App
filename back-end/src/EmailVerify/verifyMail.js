import nodemailer from "nodemailer";
import handlebars from "handlebars";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("Missing EMAIL_USER or EMAIL_PASS in .env");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const verifyMail = async (mail, verifyUrl) => {
  try {
    const source = await fs.promises.readFile(
      path.join(__dirname, "template.hbs"),
      "utf-8",
    );

    const template = handlebars.compile(source);

    const htmlToSend = template({
      verifyUrl: encodeURI(verifyUrl),
      appName: "Notes App",
    });

    const info = await transporter.sendMail({
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: mail,
      subject: "Verify your email",
      text: `Click the link to verify your email: ${verifyUrl}`,
      html: htmlToSend,
    });

    return info;
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
};

export default verifyMail;
