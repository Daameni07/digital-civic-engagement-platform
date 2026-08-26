import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");
export const resendApiKey = process.env.RESEND_API_KEY;
export const emailFrom = process.env.EMAIL_FROM || emailUser;
const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
const isGmail = emailHost === "smtp.gmail.com";
const emailPort = isGmail ? 587 : Number(process.env.EMAIL_PORT || 587);
const emailSecure = isGmail ? false : process.env.EMAIL_SECURE === "true";

if (!resendApiKey && (!emailUser || !emailPass)) {
  throw new Error("EMAIL_USER or EMAIL_PASS is missing");
}

export const transporter = resendApiKey ? null : nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: emailSecure,
  auth: { user: emailUser, pass: emailPass },
});

export const senderAddress = emailFrom || emailUser;

if (transporter) {
  transporter.verify((error) => {
    if (error) console.error("SMTP connection error:", error);
    else console.log("SMTP server is ready");
  });
}