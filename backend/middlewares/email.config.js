import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");
const emailHost = "smtp.gmail.com";
const emailPort = 587;
const emailSecure = false;

if (!emailUser || !emailPass) {
  throw new Error("EMAIL_USER or EMAIL_PASS is missing");
}

export const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: emailSecure,
  auth: { user: emailUser, pass: emailPass },
});

export const senderAddress = emailUser;

transporter.verify((error) => {
  if (error) console.error("SMTP connection error:", error);
  else console.log("SMTP server is ready");
});